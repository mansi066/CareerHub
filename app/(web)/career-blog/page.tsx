import { BookOpen, Calendar, ArrowRight, Sparkles } from "lucide-react"

export default function CareerBlogPage() {
  return (
    <div className="bg-background">

      {/* HERO */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white pt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Career Growth Blog
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Expert insights, trends, and guidance to help you grow faster in your career.
          </p>
        </div>
      </section>

      {/* BLOG LIST */}
      <section className="max-w-6xl mx-auto px-6 py-20 pt-16 pb-32">
        <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BlogCard
            title="How to Build a Strong Career Roadmap"
            date="Jan 2026"
          />
          <BlogCard
            title="Top Skills Employers Look for in 2026"
            date="Feb 2026"
          />
          <BlogCard
            title="Mistakes Students Make While Job Hunting"
            date="Mar 2026"
          />
        </div>
      </section>
    </div>
  )
}

function BlogCard({ title, date }: { title: string; date: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition">
      <BookOpen className="w-8 h-8 text-primary mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {date}
        </span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  )
}
