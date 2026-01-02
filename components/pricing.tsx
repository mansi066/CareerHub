"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      id: 1,
      name: "Explorer",
      price: "Free",
      description: "Get started with basic job search",
      features: [
        "Browse all jobs & scholarships",
        "5 saved searches",
        "Basic alerts",
        "Resume tips",
        "Community access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      id: 2,
      name: "Career Accelerator",
      price: "$9.99",
      description: "Enhanced job search and career tools",
      features: [
        "Unlimited saved searches",
        "Priority job alerts",
        "Resume builder & review",
        "Interview prep courses",
        "Salary negotiation guide",
        "LinkedIn optimization tips",
        "1-on-1 career coaching (monthly)",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      id: 3,
      name: "Scholarship Master",
      price: "$14.99",
      description: "Maximize scholarship opportunities",
      features: [
        "Everything in Career Accelerator",
        "Exclusive scholarship database",
        "Application essay review",
        "Scholarship match algorithm",
        "Deadline reminders",
        "Personalized recommendations",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ]

  return (
    <section
      id="pricing"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plans for every career stage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your goals. All paid plans include a 7-day
            free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-visible p-8 pt-12 flex flex-col spotlight-card hover-card scale-in ${
                plan.popular
                  ? "bg-primary text-primary-foreground border-primary md:scale-105 shadow-2xl"
                  : "bg-background border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-accent text-black dark:text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={
                    plan.popular
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Free" && (
                  <span
                    className={
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }
                  >
                    {" "}
                    /month
                  </span>
                )}
              </div>

              <Button
                className={`w-full mb-8 ${
                  plan.popular
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span
                      className={
                        plan.popular
                          ? "text-primary-foreground/90"
                          : "text-foreground"
                      }
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
