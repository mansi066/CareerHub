"use client"; // This is required for Next.js App Router components using state

import React from 'react';

// Defining the exact shape of the filters object
interface FilterOptions {
  query?: string;
  type?: string;
  remote?: boolean;
}

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const JobSearchFilter = ({ onFilterChange }: FilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100 rounded-lg shadow-sm mb-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Job Title or Company..."
        className="flex-1 p-2 border rounded-md text-black"
        onChange={(e) => onFilterChange({ query: e.target.value })}
      />

      {/* Category Filter */}
      <select 
        className="p-2 border rounded-md text-black"
        onChange={(e) => onFilterChange({ type: e.target.value })}
      >
        <option value="">All Job Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
      </select>

      {/* Location Toggle */}
      <label className="flex items-center gap-2 cursor-pointer text-black">
        <input 
          type="checkbox" 
          onChange={(e) => (onFilterChange({ remote: e.target.checked }))}
        />
        Remote Only
      </label>
    </div>
  );
};

export default JobSearchFilter;