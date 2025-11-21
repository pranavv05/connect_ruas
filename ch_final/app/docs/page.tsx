"use client"

import Link from "next/link"
import { BookOpen, Map, Users, FileText, Zap, Play, Download, HelpCircle, Star } from "lucide-react"

export default function DocsPage() {
  const docsSections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Introduction",
      description: "Learn what Baby Collab is and how it can help you advance your career.",
      href: "/docs/introduction"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Getting Started",
      description: "Quick start guide to set up your profile and begin your journey.",
      href: "/docs/getting-started"
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Career Roadmaps",
      description: "Create and manage your personalized career development roadmaps.",
      href: "/docs/roadmaps"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Project Collaboration",
      description: "Work on projects with peers and build your portfolio.",
      href: "/docs/projects"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Builder",
      description: "Optimize your resume with AI-powered suggestions.",
      href: "/docs/resume-builder"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Skill Tracking",
      description: "Monitor and develop your professional skills over time.",
      href: "/docs/skill-tracking"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Baby Collab Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about using Baby Collab to accelerate your career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {docsSections.map((section, index) => (
          <Link 
            key={index} 
            href={section.href}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {section.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {section.title}
                </h2>
                <p className="text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/help" 
            className="bg-muted rounded-lg p-6 text-center hover:bg-primary/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Help Center</h3>
            <p className="text-sm text-muted-foreground">
              Browse our knowledge base for answers to common questions.
            </p>
          </Link>
          
          <Link 
            href="/community" 
            className="bg-muted rounded-lg p-6 text-center hover:bg-primary/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with other users and get help from the community.
            </p>
          </Link>
          
          <Link 
            href="/contact" 
            className="bg-muted rounded-lg p-6 text-center hover:bg-primary/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground">
              Reach out to our support team for personalized assistance.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}