"use client";

import React from 'react';

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
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl shadow-sm mb-8 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => onFilterChange({ query: e.target.value })}
        />
      </div>
      <select 
        className="p-2.5 rounded-lg border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 outline-none cursor-pointer"
        onChange={(e) => onFilterChange({ type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Internship">Internship</option>
        <option value="Contract">Contract</option>
      </select>
      <label className="flex items-center gap-3 px-2 cursor-pointer group">
        <input 
          type="checkbox" 
          className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600"
          onChange={(e) => onFilterChange({ remote: e.target.checked })}
        />
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">
          Remote Only
        </span>
      </label>
    </div>
  );
};

export default JobSearchFilter;