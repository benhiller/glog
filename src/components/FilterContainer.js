import React from 'react';
import WorkerFilter from './WorkerFilter';

function FilterContainer({ filterText, onFilterChange, workers, hiddenWorkers, onToggleWorker }) {
  return (
    <div className="filter-container">
      <span className="filter-label">Filter:</span>
      <input 
        type="text" 
        className="filter-input" 
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Type to filter log messages..."
      />
      <WorkerFilter 
        workers={workers}
        hiddenWorkers={hiddenWorkers}
        onToggleWorker={onToggleWorker}
      />
    </div>
  );
}

export default FilterContainer;