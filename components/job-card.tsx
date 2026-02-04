"use client"

import { useBookmarks } from "@/hooks/useBookmarks"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Building2, DollarSign } from "lucide-react"

interface JobCardProps {
  job: {
    _id: string
    title: string
    description: string
    location: string
    type: string
    remote: boolean
    salary?: {
      min?: number
      max?: number
      currency: string
    }
    skills: string[]
    experience: string
    companyId: {
      name: string
      logo?: string
    }
    createdAt: string
  }
}

export function JobCard({ job }: JobCardProps) {

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  const bookmarked = isBookmarked(job._id)

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(job._id)
    } else {
      addBookmark({
        id: job._id,
        title: job.title,
        type: "job",
        createdAt: new Date().toISOString(),
      })
    }
  }

  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return null
    
    const { min, max, currency } = job.salary
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    }
    if (min) {
      return `${currency} ${min.toLocaleString()}+`
    }
    if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`
    }
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{job.title}</h3>
              <p className="text-muted-foreground text-sm">{job.companyId.name}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {new Date(job.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
            {job.remote && <Badge variant="secondary" className="ml-1 text-xs">Remote</Badge>}
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{job.type}</span>
          </div>
          
          {formatSalary() && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 ml-auto">
          <Button
           size="sm"
           variant={bookmarked ? "secondary" : "outline"}
           onClick={handleBookmarkToggle}
           >
          {bookmarked ? "Saved" : "Save"}
          </Button>

         <Button size="sm">
           Apply Now
         </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}