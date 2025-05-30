import React from 'react';

function Header({ connected, showTimestamp, onToggleTimestamp }) {
  return (
    <div className="header">
      <div className="title">glog</div>
      <div className="header-controls">
        <label className="timestamp-toggle">
          <input
            type="checkbox"
            checked={showTimestamp}
            onChange={onToggleTimestamp}
          />
          Show timestamps
        </label>
        <div className="status">
          <div className={`status-dot ${connected ? 'connected' : ''}`}></div>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
