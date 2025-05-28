# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

glog is a Node.js command-line tool that reads input streams from stdin and displays them in a live-updating web interface. It creates a web server with WebSocket support to stream log data in real-time to connected browsers.

## Development Commands

- `npm start` - Start the glog server (same as running `node bin/glog.js`)
- `npm install` - Install dependencies (express, ws)
- `glog` - CLI command (after npm link or global install)

## Usage Examples

```bash
# Pipe command output to glog
tail -f /var/log/system.log | glog

# Stream any command output
ping google.com | glog

# Use with other CLI tools
npm run build | glog
```

## Architecture

- **bin/glog.js** - Main CLI script that reads from stdin and serves the web interface
- **public/index.html** - Browser-based log viewer with live updates
- **index.js** - Entry point that delegates to bin/glog.js

### Data Flow
1. CLI reads from stdin line by line
2. Each line is timestamped and broadcast via WebSocket to all connected clients
3. Browser clients display logs in real-time with auto-scrolling
4. Web interface provides controls for clearing logs and toggling auto-scroll

### Key Features
- Real-time log streaming via WebSocket
- Dark terminal-style interface
- Automatic reconnection on connection loss
- Timestamp display for each log entry
- Clear logs and auto-scroll toggle controls