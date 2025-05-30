import React, { useState } from 'react';

function WorkerFilter({ workers, hiddenWorkers, onToggleWorker }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  if (workers.size === 0) {
    return null;
  }

  const visibleWorkers = Array.from(workers).filter(worker => !hiddenWorkers.has(worker));
  const hiddenCount = hiddenWorkers.size;

  return (
    <div className="worker-filter">
      <button 
        className="worker-filter-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Workers ({visibleWorkers.length}/{workers.size})
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
    </div>
  );
}

export default WorkerFilter;