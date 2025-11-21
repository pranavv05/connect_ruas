"use client"

import Link from "next/link"
import { Map, Users, FileText, Zap, TrendingUp, MessageCircle, Github, Figma, Chrome, ArrowRight } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: <Map className="w-8 h-8" />,
      title: "AI-Powered Career Roadmaps",
      description: "Create personalized career paths with milestones, skills, and goals powered by our AI assistant.",
      highlights: [
        "Personalized recommendations based on your goals",
        "Progress tracking with milestone completion",
        "Exportable roadmaps for sharing with mentors"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Project Collaboration",
      description: "Work on real projects with peers to build your portfolio and gain experience.",
      highlights: [
        "Real-time collaboration tools",
        "Integrated chat and file sharing",
        "Project management with task tracking"
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Resume Builder",
      description: "Optimize your resume with AI-powered suggestions and track multiple versions.",
      highlights: [
        "ATS-friendly formatting",
        "Keyword optimization suggestions",
        "Multiple template options"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Skill Tracking",
      description: "Monitor your skill development and identify areas for improvement.",
      highlights: [
        "Skill proficiency tracking",
        "Learning path recommendations",
        "Progress visualization"
      ]
    }
  ]

  const integrations = [
    { name: "GitHub", icon: <Github className="w-6 h-6" /> },
    { name: "Figma", icon: <Figma className="w-6 h-6" /> },
    { name: "Slack", icon: <MessageCircle className="w-6 h-6" /> },
    { name: "Google Drive", icon: <Chrome className="w-6 h-6" /> }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Features</span>
        </nav>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Powerful Features for Your Career Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to plan, collaborate, and accelerate your career development.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h2>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Seamless Integrations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with the tools you already use to streamline your workflow.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {integrations.map((integration, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center">
                {integration.icon}
              </div>
              <span className="font-medium text-foreground">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of students and professionals already using Baby Collab to accelerate their careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/demo" 
            className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Schedule a Demo
          </Link>
        </div>
      </div>
    </div>
  )
}