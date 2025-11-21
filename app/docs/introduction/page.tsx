"use client"

import Link from "next/link"
import { BookOpen, Users, Map, FileText, Zap, Lightbulb, Target, Rocket } from "lucide-react"

export default function IntroductionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <span>/</span>
          <span className="text-foreground">Introduction</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-4">Introduction to ConnectRUAS</h1>
        <p className="text-xl text-muted-foreground">
          Your all-in-one platform for career development, project collaboration, and skill building.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">What is ConnectRUAS?</h2>
            <p className="text-muted-foreground">
              ConnectRUAS is a comprehensive career development platform designed specifically for college students and early professionals. 
              We provide the tools and community you need to plan your career, build meaningful projects, and create a standout portfolio.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower the next generation of professionals with the tools, resources, and community they need to succeed in their careers.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2">Our Vision</h3>
            <p className="text-muted-foreground">
              To become the go-to platform for career development, where students and early professionals can grow, collaborate, and thrive.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">How ConnectRUAS Can Help You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Career Roadmaps</h3>
            </div>
            <p className="text-muted-foreground">
              Create visual career roadmaps with milestones, skills, and goals. Our AI-powered suggestions help you plan the most effective path to your dream job.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Project Collaboration</h3>
            </div>
            <p className="text-muted-foreground">
              Work on real projects with peers from around the world. Build your portfolio, gain experience, and expand your professional network.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Resume Builder</h3>
            </div>
            <p className="text-muted-foreground">
              Optimize your resume with AI-powered suggestions. Track multiple versions and get feedback from the community.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Skill Tracking</h3>
            </div>
            <p className="text-muted-foreground">
              Monitor your skill development over time. Identify areas for improvement and celebrate your achievements.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Story Behind ConnectRUAS</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                ConnectRUAS was born out of a simple observation: students and early professionals were struggling to navigate their career paths 
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
                After months of research, user interviews, and prototyping, ConnectRUAS was born. We launched our beta with just 50 users, but 
                the response was overwhelming. Users were not only building better projects but also forming lasting professional relationships.
              </p>
              <p>
                Today, ConnectRUAS serves thousands of users worldwide, helping them land dream jobs, start companies, and build the careers 
                they've always wanted. And we're just getting started.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  We believe in the power of community to accelerate learning and career growth.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  We're committed to helping users develop skills throughout their careers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We make career development tools accessible to everyone, regardless of background.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly innovate to provide the best tools for career development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}