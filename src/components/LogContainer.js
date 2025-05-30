import React, { useEffect, useRef } from 'react';
import LogEntry from './LogEntry';

function LogContainer({ logs, allLogs, autoscroll, onAutoscrollChange, showTimestamp }) {
  const containerRef = useRef(null);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (autoscroll && logs.length > 0) {
      const container = containerRef.current;
      const wasAtBottom = container.scrollTop >= container.scrollHeight - container.clientHeight - 5;
      
      // Only scroll if we were already at the bottom or this is the first message
      if (wasAtBottom || logs.length === 1) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [logs, autoscroll]);

  const handleScroll = () => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Mark that user has scrolled
    userScrolledRef.current = true;

    // Set a timeout to reset the user scroll flag after a brief delay
    scrollTimeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
    }, 100);

    const container = containerRef.current;
    const isAtBottom = container.scrollTop >= container.scrollHeight - container.clientHeight - 5;
    
    // Only disable autoscroll if user explicitly scrolled up and we're not at bottom
    if (autoscroll && !isAtBottom && userScrolledRef.current) {
      onAutoscrollChange(false);
    } else if (!autoscroll && isAtBottom) {
      onAutoscrollChange(true);
    }
  };

  const renderContent = () => {
    if (logs.length === 0 && allLogs.length > 0) {
      return (
        <div className="log-entry">
          <div className="timestamp">--:--:--</div>
          <div className="message">No messages match the current filter</div>
        </div>
      );
    } else if (allLogs.length === 0) {
      return (
        <div className="log-entry">
          <div className="timestamp">--:--:--</div>
          <div className="message">Waiting for log data...</div>
        </div>
      );
    }

    return logs.map((log, index) => (
      <LogEntry key={index} log={log} showTimestamp={showTimestamp} />
    ));
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="log-container" 
      ref={containerRef}
      onScroll={handleScroll}
    >
      {renderContent()}
    </div>
  );
}

export default LogContainer;