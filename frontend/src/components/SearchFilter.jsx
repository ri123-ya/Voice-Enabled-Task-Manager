import React, { useState } from 'react';

const SearchFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, statusFilter, priorityFilter);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilters(searchTerm, value, priorityFilter);
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setPriorityFilter(value);
    applyFilters(searchTerm, statusFilter, value);
  };

  const applyFilters = (search, status, priority) => {
    onFilterChange({
      searchTerm: search,
      status: status === 'All' ? null : status,
      priority: priority === 'All' ? null : priority
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    onFilterChange({ searchTerm: '', status: null, priority: null });
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all duration-200"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Desktop Filter Dropdowns */}
        <div className="hidden sm:flex gap-3">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all duration-200 cursor-pointer"
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="High Priority">High Priority</option>
            <option value="Low Priority">Low Priority</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="hidden sm:flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Mobile Filter Dropdowns (Expandable) */}
      {isExpanded && (
        <div className="sm:hidden mt-3 space-y-3 animate-slide-down">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all duration-200"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={handlePriorityChange}
            className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 outline-none transition-all duration-200"
          >
            <option value="All">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="High Priority">High Priority</option>
            <option value="Low Priority">Low Priority</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
