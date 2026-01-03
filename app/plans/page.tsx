"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Crown, Shield } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
    limit?: string;
  }[];
  cta: string;
  color: string;
}

const PlansPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "month",
      description: "Perfect for getting started with job searching and basic assessments",
      icon: <Shield className="w-6 h-6" />,
      color: "border-gray-200 dark:border-gray-700",
      cta: "Get Started Free",
      features: [
        { name: "Browse job listings", included: true },
        { name: "Basic skill assessments", included: true, limit: "3 per month" },
        { name: "Application tracking", included: true, limit: "10 applications" },
        { name: "Email notifications", included: true },
        { name: "Community access", included: true },
        { name: "Priority support", included: false },
        { name: "Advanced assessments", included: false },
        { name: "Personalized recommendations", included: false },
        { name: "Resume review", included: false },
        { name: "Interview coaching", included: false }
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: billingPeriod === "monthly" ? 19 : 190,
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "Ideal for serious job seekers who want advanced features and support",
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      color: "border-blue-500 dark:border-blue-400",
      cta: "Start Pro Trial",
      features: [
        { name: "Browse job listings", included: true },
        { name: "Unlimited skill assessments", included: true },
        { name: "Unlimited application tracking", included: true },
        { name: "Email & SMS notifications", included: true },
        { name: "Community access", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced assessments", included: true },
        { name: "AI-powered recommendations", included: true },
        { name: "Resume review", included: true, limit: "2 per month" },
        { name: "Interview coaching", included: false }
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: billingPeriod === "monthly" ? 49 : 490,
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "Complete career transformation package with 1-on-1 coaching",
      icon: <Crown className="w-6 h-6" />,
      color: "border-purple-500 dark:border-purple-400",
      cta: "Go Premium",
      features: [
        { name: "Browse job listings", included: true },
        { name: "Unlimited skill assessments", included: true },
        { name: "Unlimited application tracking", included: true },
        { name: "Email & SMS notifications", included: true },
        { name: "Community access", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced assessments", included: true },
        { name: "AI-powered recommendations", included: true },
        { name: "Unlimited resume reviews", included: true },
        { name: "1-on-1 interview coaching", included: true }
      ]
    }
  ];

  const getDiscountPercentage = () => {
    return Math.round(((12 - 10) / 12) * 100);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Unlock your career potential with the right plan for your goals. 
            From free job searching to premium career coaching.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingPeriod === 'yearly' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Save {getDiscountPercentage()}%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`glassmorphic hover-card relative ${plan.color} ${
                  plan.popular ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.id === 'free' ? 'bg-gray-100 dark:bg-gray-800' :
                      plan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-purple-100 dark:bg-purple-900'
                    }`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Features List */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${
                              feature.included ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {feature.name}
                            </span>
                            {feature.limit && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({feature.limit})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href={plan.id === 'free' ? '/signup' : '/signup'} className="block">
                      <Button 
                        className={`w-full ${
                          plan.popular ? 'glassmorphic-button-primary' : 'glassmorphic-button'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>

                    {plan.id !== 'free' && (
                      <p className="text-xs text-muted-foreground text-center">
                        14-day free trial • Cancel anytime
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glassmorphic p-6 rounded-2xl">
              <h3 className="font-semibold text-foreground mb-3">
                Can I change plans anytime?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="glassmorphic p-6 rounded-2xl">
              <h3 className="font-semibold text-foreground mb-3">
                What's included in the free trial?
              </h3>
              <p className="text-muted-foreground text-sm">
                All paid plans include a 14-day free trial with full access to premium features. 
                No credit card required to start.
              </p>
            </div>
            
            <div className="glassmorphic p-6 rounded-2xl">
              <h3 className="font-semibold text-foreground mb-3">
                How does the money-back guarantee work?
              </h3>
              <p className="text-muted-foreground text-sm">
                If you're not satisfied within the first 30 days, we'll refund your payment in full. 
                No questions asked.
              </p>
            </div>
            
            <div className="glassmorphic p-6 rounded-2xl">
              <h3 className="font-semibold text-foreground mb-3">
                Do you offer student discounts?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes! Students get 50% off all paid plans with a valid .edu email address. 
                Contact support to apply your discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphic p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Our team is here to help you choose the perfect plan for your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="glassmorphic-button-primary">
                Contact Sales
              </Button>
              <Button variant="outline" className="glassmorphic-button">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PlansPage;