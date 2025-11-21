"use client"

import Link from "next/link"
import { User, Map, Users, FileText, CheckCircle, ArrowRight } from "lucide-react"

export default function GettingStartedPage() {
  const steps = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Create Your Profile",
      description: "Set up your profile with your skills, experience, and career goals.",
      steps: [
        "Sign up for a free ConnectRUAS account",
        "Complete your profile with your background and interests",
        "Add your current skills and areas of expertise",
        "Set your career goals and aspirations"
      ]
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Build Your Roadmap",
      description: "Create a personalized career roadmap with milestones and actionable steps.",
      steps: [
        "Use our AI-powered roadmap generator",
        "Customize your roadmap based on your goals",
        "Set timelines and milestones for each phase",
        "Track your progress as you complete milestones"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Join Projects",
      description: "Collaborate with peers on real projects to build your portfolio.",
      steps: [
        "Browse available projects in your areas of interest",
        "Apply to join projects that match your skills",
        "Create your own projects to lead and collaborate",
        "Contribute to project discussions and deliverables"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Optimize Your Resume",
      description: "Use our tools to create and improve your professional resume.",
      steps: [
        "Import your existing resume or create one from scratch",
        "Get AI-powered suggestions for improvement",
        "Track multiple versions for different job applications",
        "Download optimized versions for your job search"
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <span>/</span>
          <span className="text-foreground">Getting Started</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started with ConnectRUAS</h1>
        <p className="text-xl text-muted-foreground">
          Your step-by-step guide to setting up your ConnectRUAS account and beginning your career journey.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Quick Start Checklist</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-foreground mb-3">Before You Begin</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">1</span>
                <span className="text-muted-foreground">A computer or mobile device with internet access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">2</span>
                <span className="text-muted-foreground">Your educational background and work experience details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">3</span>
                <span className="text-muted-foreground">A list of skills you want to develop</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-3">What You'll Accomplish</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">1</span>
                <span className="text-muted-foreground">Complete profile setup in under 10 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">2</span>
                <span className="text-muted-foreground">Create your first career roadmap</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5">3</span>
                <span className="text-muted-foreground">Join or create your first project</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-12 mb-12">
        {steps.map((step, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Step {index + 1}: {step.title}
                </h2>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            
            <div className="pl-16">
              <ol className="space-y-4">
                {step.steps.map((substep, subindex) => (
                  <li key={subindex} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-muted-foreground">{subindex + 1}</span>
                    </div>
                    <span className="text-foreground">{substep}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of students and professionals already using ConnectRUAS to accelerate their careers.
        </p>
        <Link 
          href="/sign-up" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Create Your Free Account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}