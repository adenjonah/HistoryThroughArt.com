import React from 'react';

/**
 * Component for filtering session data
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.setFilters - Function to update filters
 * @param {Array} props.pagePaths - Available page paths for filtering
 */
const FilterControls = ({ filters, setFilters, pagePaths }) => {
  // Handle date filter changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle page path filter change
  const handlePathChange = (e) => {
    setFilters(prev => ({ ...prev, pagePath: e.target.value }));
  };

  // Handle minimum session length change
  const handleMinSessionChange = (e) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setFilters(prev => ({ ...prev, minSessionLength: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      pagePath: '',
      minSessionLength: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Sessions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date range filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.startDate}
            onChange={handleDateChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.endDate}
            onChange={handleDateChange}
          />
        </div>
        
        {/* Page path filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Path
          </label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.pagePath}
            onChange={handlePathChange}
          >
            <option value="">All Pages</option>
            {pagePaths.map(path => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </div>
        
        {/* Minimum session length filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min. Session Length (sec)
          </label>
          <input
            type="number"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            min="0"
            value={filters.minSessionLength}
            onChange={handleMinSessionChange}
          />
        </div>
      </div>
      
      {/* Clear filters button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterControls; 