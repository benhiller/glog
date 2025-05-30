import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FilterContainer from './components/FilterContainer';
import LogContainer from './components/LogContainer';
import Controls from './components/Controls';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [autoscroll, setAutoscroll] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
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
        setLogs(prevLogs => [...prevLogs, data]);
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
  };

  const toggleAutoscroll = () => {
    setAutoscroll(!autoscroll);
  };

  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp);
  };

  const filteredLogs = filterText 
    ? logs.filter(log => 
        log.message.toLowerCase().includes(filterText.toLowerCase())
      )
    : logs;

  return (
    <div className="app">
      <Header 
        connected={connected} 
        showTimestamp={showTimestamp}
        onToggleTimestamp={toggleTimestamp}
      />
      <FilterContainer 
        filterText={filterText} 
        onFilterChange={setFilterText} 
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