import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import LogEntry from './LogEntry';

function LogContainer({ logs, allLogs, autoscroll, onAutoscrollChange, showTimestamp }) {
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    if (autoscroll && logs.length > 0 && listRef.current) {
      // Always scroll to bottom when autoscroll is enabled and new logs arrive
      listRef.current.scrollToItem(logs.length - 1, 'end');
    }
  }, [logs, autoscroll]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        setContainerHeight(height - 32); // Account for padding
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      onAutoscrollChange(false);
    } else {
      // Check if we're at the bottom
      const list = listRef.current;
      if (list) {
        const { scrollTop, scrollHeight, clientHeight } = list._outerRef;
        const isAtBottom = scrollTop >= scrollHeight - clientHeight - 5;
        if (isAtBottom) {
          onAutoscrollChange(true);
        }
      }
    }
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <LogEntry log={logs[index]} showTimestamp={showTimestamp} />
    </div>
  );

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

    return (
      <List
        ref={listRef}
        height={containerHeight}
        itemCount={logs.length}
        itemSize={35} // Approximate height of each log entry
        onWheel={handleWheel}
      >
        {Row}
      </List>
    );
  };

  return (
    <div
      className="log-container"
      ref={containerRef}
    >
      {renderContent()}
    </div>
  );
}

export default LogContainer;
