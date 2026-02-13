import { Mic, Code, User, Sparkles } from "lucide-react"

export default function InterviewPrepPage() {
  return (
    <div className="bg-background">

      {/* HERO */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ace Your Interviews with Confidence
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Prepare smartly for HR, technical, and behavioral interviews.
          </p>
        </div>
      </section>

      {/* PREP SECTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-20 pt-16 pb-32">
        <div className="grid gap-6 md:grid-cols-3">
          <PrepCard
            icon={<User />}
            title="HR Interviews"
            desc="Common HR questions and best answering techniques."
          />
          <PrepCard
            icon={<Code />}
            title="Technical Rounds"
            desc="Coding, core concepts, and problem-solving practice."
          />
          <PrepCard
            icon={<Mic />}
            title="Mock Interviews"
            desc="Practice interviews to boost confidence."
          />
        </div>
      </section>
    </div>
  )
}

function PrepCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition">
      <div className="text-primary mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
