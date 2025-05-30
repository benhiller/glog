import React from 'react';

function FilterContainer({ filterText, onFilterChange }) {
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
    </div>
  );
}

export default FilterContainer;