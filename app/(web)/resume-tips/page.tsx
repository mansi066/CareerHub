import { FileText, CheckCircle, Sparkles } from "lucide-react"

export default function ResumeTipsPage() {
  return (
    <div className="bg-background">

      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white pt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Resume Tips That Get You Hired
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Learn how to create resumes that stand out and pass ATS filters.
          </p>
        </div>
      </section>

      {/* TIPS */}
      <section className="max-w-5xl mx-auto px-6 py-20 pt-16 pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          <TipCard text="Write a strong, concise professional summary" />
          <TipCard text="Quantify achievements with numbers" />
          <TipCard text="Customize resume for each job role" />
          <TipCard text="Use ATS-friendly formatting" />
          <TipCard text="Avoid spelling and grammar mistakes" />
          <TipCard text="Highlight skills relevant to the job" />
        </div>
      </section>
    </div>
  )
}

function TipCard({ text }: { text: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition">
      <CheckCircle className="text-primary w-6 h-6 mt-1" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  )
}
