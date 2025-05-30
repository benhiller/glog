import React, { useEffect, useRef } from 'react';
import LogEntry from './LogEntry';

function LogContainer({ logs, allLogs, autoscroll, onAutoscrollChange }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (autoscroll && logs.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoscroll]);

  const handleScroll = () => {
    const container = containerRef.current;
    const isAtBottom = container.scrollTop >= container.scrollHeight - container.clientHeight - 5;
    
    if (autoscroll && !isAtBottom) {
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
      <LogEntry key={index} log={log} />
    ));
  };

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