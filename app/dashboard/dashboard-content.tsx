"use client"

import { useState } from "react"
import JobSearchFilter from "@/components/JobSearchFilter"

// This is where your jobs come from
const allJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", type: "Full-time", location: "Remote" },
  { id: 2, title: "Backend Intern", company: "DataSync", type: "Internship", location: "On-site" },
  { id: 3, title: "UX Designer", company: "CreativeFlow", type: "Contract", location: "Remote" },
  { id: 4, title: "Full Stack Engineer", company: "WebWorks", type: "Full-time", location: "On-site" },
];

export default function DashboardContent() {
  const [filters, setFilters] = useState({
    query: '',
    type: '',
    remote: false,
  });

  const handleFilterChange = (newFilter: any) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(filters.query.toLowerCase()) || 
      job.company.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesType = filters.type ? job.type === filters.type : true;
    const matchesRemote = filters.remote ? job.location === "Remote" : true;

    return matchesSearch && matchesType && matchesRemote;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Job Dashboard</h1>
        <p className="text-muted-foreground">Manage and find your next opportunities.</p>
      </div>

      <JobSearchFilter onFilterChange={handleFilterChange} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-primary font-medium">{job.company}</p>
                  <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                  {job.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            No jobs match your current search criteria.
          </div>
        )}
      </div>
    </div>
  )
}