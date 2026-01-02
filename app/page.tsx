"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import Pricing from "@/components/pricing"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
// Import your new component
import JobSearchFilter from "@/components/JobSearchFilter"

// Mock data - replace this with your actual jobs data or API fetch
const allJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", type: "Full-time", location: "Remote" },
  { id: 2, title: "Backend Intern", company: "DataSync", type: "Internship", location: "On-site" },
  { id: 3, title: "UX Designer", company: "CreativeFlow", type: "Contract", location: "Remote" },
  { id: 4, title: "Full Stack Engineer", company: "WebWorks", type: "Full-time", location: "On-site" },
];

export default function Home() {
  // 1. State for filters
  const [filters, setFilters] = useState({
    query: '',
    type: '',
    remote: false,
  });

  // 2. Handle filter changes from the child component
  const handleFilterChange = (newFilter: any) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  // 3. Logic to filter the job list
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(filters.query.toLowerCase()) || 
      job.company.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesType = filters.type ? job.type === filters.type : true;
    const matchesRemote = filters.remote ? job.location === "Remote" : true;

    return matchesSearch && matchesType && matchesRemote;
  });

  return (
    <main className="bg-background">
      <Header />
      <Hero />
      
      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto p-6" id="jobs">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Your Next Role</h2>
        
        {/* New Filter Component */}
        <JobSearchFilter onFilterChange={handleFilterChange} />

        {/* Display Filtered Results */}
        <div className="grid gap-4 mt-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white text-black">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {job.type}
                  </span>
                </div>
                <p className="mt-2 text-gray-500 text-sm">{job.location}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
              No jobs match your current filters.
            </div>
          )}
        </div>
      </section>

      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}