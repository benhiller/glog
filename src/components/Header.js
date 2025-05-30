import React from 'react';

function Header({ connected }) {
  return (
    <div className="header">
      <div className="title">glog - Live Log Viewer</div>
      <div className="status">
        <div className={`status-dot ${connected ? 'connected' : ''}`}></div>
        <span>{connected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </div>
  );
}

export default Header;