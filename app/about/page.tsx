"use client"

import Link from "next/link"
import { Users, Lightbulb, Target, Heart, ArrowRight } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community First",
      description: "We believe in the power of community to accelerate learning and career growth."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Continuous Learning",
      description: "We're committed to helping users develop skills throughout their careers."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Accessibility",
      description: "We make career development tools accessible to everyone, regardless of background."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Innovation",
      description: "We constantly innovate to provide the best tools for career development."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">About</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">About Baby Collab</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering the next generation of professionals with the tools, resources, and community they need to succeed.
          </p>
        </div>

        <div className="flex items-start gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Baby Collab was born out of a simple observation: students and early professionals were struggling to navigate their career paths 
                in an increasingly complex job market. We noticed that talented individuals were wasting time juggling multiple tools and platforms, 
                often working in isolation without proper guidance or community support.
              </p>
              <p>
                Our founders, all former college students who had successfully transitioned into tech careers, realized that there was a gap in 
                the market for a platform that could bring together career planning, project collaboration, and skill development in one place.
              </p>
              <p>
                The idea crystallized during a hackathon where our team was working on separate projects but struggling to coordinate and share 
                resources. We thought, "What if there was a platform where we could do all of this together, with proper tools and guidance?"
              </p>
              <p>
                After months of research, user interviews, and prototyping, Baby Collab was born. We launched our beta with just 50 users, but 
                the response was overwhelming. Users were not only building better projects but also forming lasting professional relationships.
              </p>
              <p>
                Today, Baby Collab serves thousands of users worldwide, helping them land dream jobs, start companies, and build the careers 
                they've always wanted. And we're just getting started.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                </div>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Be part of a growing community of students and professionals who are shaping the future of career development.
        </p>
        <Link 
          href="/sign-up" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Get Started Today
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}