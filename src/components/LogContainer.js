import React, { useEffect, useRef } from 'react';
import LogEntry from './LogEntry';

function LogContainer({ logs, allLogs, autoscroll, onAutoscrollChange, showTimestamp }) {
  const containerRef = useRef(null);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (autoscroll && logs.length > 0 && containerRef.current) {
      // Always scroll to bottom when autoscroll is enabled and new logs arrive
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'instant'
      });
    }
  }, [logs, autoscroll]);

  const handleWheel = (e) => {
    const scrollableEl = containerRef.current;
    if (!scrollableEl) {
      return;
    }
    const maxScrollHeight =
      scrollableEl.scrollHeight - scrollableEl.clientHeight;
    if (e.deltaY < 0) {
      onAutoscrollChange(false);
    } else if (scrollableEl.scrollTop === maxScrollHeight) {
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
      onWheel={handleWheel}
    >
      {renderContent()}
    </div>
  );
}

export default LogContainer;
