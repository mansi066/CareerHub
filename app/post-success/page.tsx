"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PostSuccess() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    title: "",
    content: "",
    avatar: "🎉",
  })

  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem("testimonials") || "[]")

    const newTestimonial = {
      id: Date.now(),
      rating: 5,
      ...form,
    }

    localStorage.setItem(
      "testimonials",
      JSON.stringify([newTestimonial, ...existing])
    )

    router.push("/") // or testimonials page route
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <Card className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">Post Your Success Story</h2>

        <Input
          placeholder="Your Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Your Title (e.g. Software Engineer at Amazon)"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Textarea
          placeholder="Your success story..."
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <Button className="w-full" onClick={handleSubmit}>
          Post
        </Button>
      </Card>
    </div>
  )
}
