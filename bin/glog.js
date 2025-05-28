#!/usr/bin/env node

const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Store connected WebSocket clients
const clients = new Set();

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

// Read from stdin
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const lines = chunk.split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      broadcast(line);
    }
  });
});

process.stdin.on('end', () => {
  console.error('[glog] stdin ended');
});

// Start server
server.listen(PORT, () => {
  console.error(`[glog] Server running at http://localhost:${PORT}`);
  console.error(`[glog] Reading from stdin...`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n[glog] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});