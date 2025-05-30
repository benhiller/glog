import React from 'react';

function Controls({ onClearLogs, autoscroll, onToggleAutoscroll }) {
  return (
    <div className="controls">
      <button className="btn secondary" onClick={onClearLogs}>
        Clear
      </button>
      <button className="btn secondary" onClick={onToggleAutoscroll}>
        Autoscroll: {autoscroll ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

export default Controls;