"use client"

import { useBookmarks } from "@/hooks/useBookmarks"
import { JobCard } from "@/components/job-card"

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks()

  if (bookmarks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No bookmarks yet. Save jobs to see them here.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Bookmarks</h1>

      <div className="grid gap-4">
        {bookmarks.map((job) => (
          <JobCard
            key={job.id}
            job={{
              _id: job.id,
              title: job.title,
              description: "",
              location: "",
              type: "job",
              remote: false,
              skills: [],
              experience: "",
              companyId: { name: "" },
              createdAt: job.createdAt,
            }}
          />
        ))}
      </div>
    </div>
  )
}