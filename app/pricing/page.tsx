"use client"

import Link from "next/link"
import { Check, ArrowRight, Users, Zap, FileText, Map, TrendingUp } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals getting started with career planning.",
      features: [
        "Basic career roadmaps",
        "Up to 2 active projects",
        "Basic resume builder",
        "Community access",
        "Email support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      description: "Ideal for serious career development and collaboration.",
      features: [
        "AI-powered career roadmaps",
        "Unlimited projects",
        "Advanced resume builder",
        "Portfolio builder",
        "Skill tracking",
        "Priority support",
        "Export features"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$29",
      period: "per month",
      description: "For teams and organizations managing multiple careers.",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Admin dashboard",
        "Team analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately."
    },
    {
      question: "Do you offer discounts for students?",
      answer: "Yes, we offer a 50% discount for verified students. Contact our support team with your student ID to apply."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, our Professional plan includes a 14-day free trial with full access to all features."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Pricing</span>
        </nav>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for your career development journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`bg-card border rounded-xl p-8 relative ${
              plan.popular 
                ? "border-primary shadow-lg ring-2 ring-primary/20" 
                : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              href={plan.name === "Team" ? "/contact" : "/sign-up"}
              className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-foreground hover:bg-border"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-muted rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Need a Custom Solution?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          For educational institutions, enterprises, or custom requirements, we offer tailored solutions.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Our Sales Team
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}