#!/usr/bin/env node

const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3214;

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: glog <command> [args...]');
  console.error('Example: glog tail -f /var/log/system.log');
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Store connected WebSocket clients
const clients = new Set();

// Store all active HTTP connections for cleanup
const connections = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  clients.add(ws);
  console.error(`[glog] Client connected. Total clients: ${clients.size}`);

  ws.on('close', () => {
    clients.delete(ws);
    console.error(`[glog] Client disconnected. Total clients: ${clients.size}`);
  });
});

// Broadcast message to all connected clients
function broadcast(message) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message: message.trim()
  };

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(logEntry));
    }
  });
}

// Spawn the command and capture output
let childProcess;

function startCommand() {
  childProcess = spawn(command, commandArgs, {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Handle stdout
  childProcess.stdout.setEncoding('utf8');
  childProcess.stdout.on('data', (chunk) => {
    const lines = chunk.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        broadcast(`[stdout] ${line}`);
      }
    });
  });

  // Handle stderr
  childProcess.stderr.setEncoding('utf8');
  childProcess.stderr.on('data', (chunk) => {
    const lines = chunk.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        broadcast(`[stderr] ${line}`);
      }
    });
  });

  // Handle process exit
  childProcess.on('close', (code, signal) => {
    const exitMessage = signal 
      ? `[glog] Command terminated by signal: ${signal}`
      : `[glog] Command exited with code: ${code}`;
    console.error(exitMessage);
    broadcast(exitMessage);
  });

  childProcess.on('error', (error) => {
    const errorMessage = `[glog] Failed to start command: ${error.message}`;
    console.error(errorMessage);
    broadcast(errorMessage);
  });
}

// Track HTTP connections for cleanup
server.on('connection', (socket) => {
  connections.add(socket);
  socket.on('close', () => {
    connections.delete(socket);
  });
});

// Start server
server.listen(PORT, () => {
  console.error(`[glog] Server running at http://localhost:${PORT}`);
  console.error(`[glog] Executing command: ${command} ${commandArgs.join(' ')}`);
  startCommand();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n[glog] Shutting down...');
  
  // Kill the child process
  if (childProcess && !childProcess.killed) {
    childProcess.kill('SIGTERM');
  }
  
  // Immediately close all WebSocket connections
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN || client.readyState === WebSocket.CONNECTING) {
      client.terminate();
    }
  });
  clients.clear();
  
  // Immediately destroy all HTTP connections
  connections.forEach(socket => {
    socket.destroy();
  });
  connections.clear();
  
  // Close the server and exit
  server.close(() => {
    process.exit(0);
  });
  
  // Force exit if server doesn't close within 1 second
  setTimeout(() => {
    console.error('[glog] Force exiting...');
    process.exit(1);
  }, 1000);
});
