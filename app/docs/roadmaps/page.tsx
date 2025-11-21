"use client"

import Link from "next/link"
import { Map, Plus, Edit, Eye, Download, Zap, Target, Clock } from "lucide-react"

export default function RoadmapsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <span>/</span>
          <span className="text-foreground">Career Roadmaps</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-4">Career Roadmaps</h1>
        <p className="text-xl text-muted-foreground">
          Create visual career development plans with milestones, skills, and goals.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Map className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">What are Career Roadmaps?</h2>
            <p className="text-muted-foreground">
              Career roadmaps are visual representations of your career journey, broken down into phases with specific milestones, 
              skills to develop, and goals to achieve. They provide a clear path from your current situation to your desired career destination.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Goal-Oriented
            </h3>
            <p className="text-muted-foreground text-sm">
              Each roadmap is designed to help you achieve specific career objectives.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI-Powered
            </h3>
            <p className="text-muted-foreground text-sm">
              Our AI suggests optimal paths based on your goals and current skills.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time-Bound
            </h3>
            <p className="text-muted-foreground text-sm">
              Set realistic timelines for each phase of your career journey.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Creating Your First Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">1. Start with AI Assistant</h3>
            </div>
            <p className="text-muted-foreground">
              Answer a few questions about your background, interests, and goals. Our AI will generate a personalized roadmap suggestion.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Edit className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">2. Customize Your Roadmap</h3>
            </div>
            <p className="text-muted-foreground">
              Adjust the phases, milestones, and timelines to match your specific situation and preferences.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">3. Track Your Progress</h3>
            </div>
            <p className="text-muted-foreground">
              Mark milestones as complete and monitor your advancement through each phase of your roadmap.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">4. Export and Share</h3>
            </div>
            <p className="text-muted-foreground">
              Download your roadmap as a PDF or share it with mentors, peers, or potential employers.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Roadmap Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Phases</h3>
            <p className="text-muted-foreground mb-3">
              Major sections of your career journey, such as "Foundation Building," "Skill Development," or "Job Search."
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Example: "Phase 1: Foundation (Months 1-3) - Learn basics of HTML, CSS, and JavaScript"
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Milestones</h3>
            <p className="text-muted-foreground mb-3">
              Specific achievements within each phase that mark your progress.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Example: "Milestone: Complete 3 frontend projects and deploy them to GitHub"
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Skills</h3>
            <p className="text-muted-foreground mb-3">
              Technical and soft skills you need to develop during each phase.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Example: "Skills: React, Node.js, Database Design, Team Collaboration"
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Resources</h3>
            <p className="text-muted-foreground mb-3">
              Learning materials, courses, and tools recommended for each milestone.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Example: "Resources: FreeCodeCamp, MDN Web Docs, 'JavaScript: The Good Parts' book"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Tips for Success</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Be Realistic:</span> Set achievable timelines and milestones to maintain motivation.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Stay Flexible:</span> Adjust your roadmap as your goals and circumstances change.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Track Regularly:</span> Update your progress weekly to maintain momentum.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">4</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Seek Feedback:</span> Share your roadmap with mentors and peers for valuable insights.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}