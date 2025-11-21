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
          <h1 className="text-4xl font-bold text-foreground mb-6">About  ConnectRUAS</h1>
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
                ConnectRUAS was created to solve a challenge we’ve all seen on campus: students, alumni, and mentors 
                were disconnected, even though everyone had something valuable to offer. Students needed guidance, 
                alumni wanted ways to give back, and mentors were open to helping — but there was no single place 
                where these connections could naturally happen.
              </p>

              <p>
                Many RUAS students were trying to grow their skills using scattered tools, group chats, and random 
                resources. Collaboration was happening, but it was fragmented. Finding alumni for career advice, 
                project partners within departments, or mentors in specific industries was harder than it should have 
                been.
              </p>

              <p>
                ConnectRUAS started as a simple idea during a university project discussion: 
                <strong>“What if RUAS had its own platform where students, alumni, and mentors could find each other, 
                collaborate, and grow together?”</strong>  
                A unified ecosystem — built for the RUAS community, by the RUAS community.
              </p>

              <p>
                After months of validation with students, faculty, alumni, and club leaders, the platform took shape: 
                a place where you can explore career paths, join collaborations, discover mentors, and build meaningful 
                networks that last beyond graduation.
              </p>

              <p>
                Today, ConnectRUAS brings together learners, innovators, and professionals across multiple batches and 
                disciplines — creating opportunities for academic growth, real-world projects, and career advancement 
                in one integrated space. And this is only the beginning.
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