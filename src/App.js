import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FilterContainer from './components/FilterContainer';
import LogContainer from './components/LogContainer';
import Controls from './components/Controls';
import { stripAnsiCodes } from './utils/ansiUtils';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [autoscroll, setAutoscroll] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [workers, setWorkers] = useState(new Set());
  const [hiddenWorkers, setHiddenWorkers] = useState(new Set());
  const wsRef = useRef(null);

  const connect = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setConnected(true);
      console.log('Connected to glog server');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Extract worker name if message follows 'worker | message' format
        const workerMatch = data.message.match(/^([^|]+)\s*\|\s*/);
        if (workerMatch) {
          const rawWorkerName = workerMatch[1].trim();
          const cleanWorkerName = stripAnsiCodes(rawWorkerName);
          setWorkers(prevWorkers => new Set([...prevWorkers, cleanWorkerName]));
        }

        setLogs(prevLogs => {
          const newLogs = [...prevLogs, data];
          // Keep only the 1000 most recent messages
          if (newLogs.length > 1000) {
            newLogs = newLogs.slice(-1000);
          }
          return newLogs;
        });
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    wsRef.current.onclose = () => {
      setConnected(false);
      console.log('Disconnected from glog server');

      // Attempt to reconnect after 2 seconds
      setTimeout(connect, 2000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
    setWorkers(new Set());
    setHiddenWorkers(new Set());
  };

  const toggleAutoscroll = () => {
    setAutoscroll(!autoscroll);
  };

  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp);
  };

  const toggleWorker = (workerName) => {
    setHiddenWorkers(prevHidden => {
      const newHidden = new Set(prevHidden);
      if (newHidden.has(workerName)) {
        newHidden.delete(workerName);
      } else {
        newHidden.add(workerName);
      }
      return newHidden;
    });
  };

  const filteredLogs = logs.filter(log => {
    // Filter out messages that have worker format but no content after the pipe
    const workerMatch = log.message.match(/^([^|]+)\s*\|\s*(.*)$/);
    if (workerMatch) {
      const content = workerMatch[2].trim();
      // Skip messages with no content after the worker name
      if (!content) {
        return false;
      }

      // Apply worker filter
      const rawWorkerName = workerMatch[1].trim();
      const cleanWorkerName = stripAnsiCodes(rawWorkerName);
      if (hiddenWorkers.has(cleanWorkerName)) {
        return false;
      }
    }

    // Apply regex filter
    if (filterText) {
      try {
        const regex = new RegExp(filterText, 'i');
        if (!regex.test(log.message)) {
          return false;
        }
      } catch (e) {
        // If regex is invalid, fall back to substring matching
        if (!log.message.toLowerCase().includes(filterText.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="app">
      <Header
        connected={connected}
        showTimestamp={showTimestamp}
        onToggleTimestamp={toggleTimestamp}
        filterText={filterText}
        onFilterChange={setFilterText}
        workers={workers}
        hiddenWorkers={hiddenWorkers}
        onToggleWorker={toggleWorker}
      />
      <LogContainer
        logs={filteredLogs}
        allLogs={logs}
        autoscroll={autoscroll}
        onAutoscrollChange={setAutoscroll}
        showTimestamp={showTimestamp}
      />
      <Controls
        onClearLogs={clearLogs}
        autoscroll={autoscroll}
        onToggleAutoscroll={toggleAutoscroll}
      />
    </div>
  );
}

export default App;
