import React, { useState } from 'react';

function Header({ connected, showTimestamp, onToggleTimestamp, filterText, onFilterChange, workers, hiddenWorkers, onToggleWorker }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="header">
      <div className="title">glog</div>
      <div className="header-center">
        <span className="filter-label">Filter:</span>
        <input 
          type="text" 
          className="filter-input" 
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Enter regex pattern to filter log messages..."
        />
      </div>
      <div className="header-controls">
        <div className="worker-filter">
          {workers.size > 0 && (
            <>
              <button 
                className="worker-filter-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Workers ({Array.from(workers).filter(worker => !hiddenWorkers.has(worker)).length}/{workers.size})
                <span className="dropdown-arrow">{showDropdown ? '▼' : '▶'}</span>
              </button>
              
              {showDropdown && (
                <div className="worker-dropdown">
                  {Array.from(workers).map(worker => (
                    <label key={worker} className="worker-checkbox">
                      <input
                        type="checkbox"
                        checked={!hiddenWorkers.has(worker)}
                        onChange={() => onToggleWorker(worker)}
                      />
                      <span className="worker-name">{worker}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
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
