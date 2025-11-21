"use client"

import Link from "next/link"
import { Users, Plus, Search, MessageSquare, FileText, CheckCircle, UserPlus, Zap } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <span>/</span>
          <span className="text-foreground">Project Collaboration</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-4">Project Collaboration</h1>
        <p className="text-xl text-muted-foreground">
          Work on real projects with peers to build your portfolio and gain experience.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Why Collaborate on Projects?</h2>
            <p className="text-muted-foreground">
              Working on projects with peers helps you gain real-world experience, build a diverse portfolio, 
              and develop essential collaboration skills that employers value.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Real Experience
            </h3>
            <p className="text-muted-foreground text-sm">
              Work on projects that simulate real-world challenges and scenarios.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Networking
            </h3>
            <p className="text-muted-foreground text-sm">
              Connect with peers who share your interests and career goals.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Portfolio Building
            </h3>
            <p className="text-muted-foreground text-sm">
              Create a diverse portfolio that showcases your skills to employers.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Skill Development
            </h3>
            <p className="text-muted-foreground text-sm">
              Develop both technical and soft skills through collaborative work.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Getting Started with Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">1. Discover Projects</h3>
            </div>
            <p className="text-muted-foreground">
              Browse the Discover Projects section to find projects that match your interests and skills. 
              Filter by technology, difficulty level, and team size.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">2. Request to Join</h3>
            </div>
            <p className="text-muted-foreground">
              Submit a join request to projects you're interested in. Project admins will review your 
              request and either accept or decline it.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">3. Create Your Own</h3>
            </div>
            <p className="text-muted-foreground">
              Start your own project to lead a team and bring your ideas to life. Define the scope, 
              recruit team members, and manage the development process.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">4. Collaborate</h3>
            </div>
            <p className="text-muted-foreground">
              Use our integrated chat, file sharing, and task management tools to collaborate effectively 
              with your team members.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Project Management Features</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Team Communication</h3>
            <p className="text-muted-foreground mb-3">
              Real-time chat and discussion boards to keep everyone on the same page.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Features: Instant messaging, file sharing, @mentions, and conversation threading
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Task Management</h3>
            <p className="text-muted-foreground mb-3">
              Create, assign, and track tasks with due dates and progress indicators.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Features: Kanban boards, task priorities, progress tracking, and deadline reminders
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">File Sharing</h3>
            <p className="text-muted-foreground mb-3">
              Share documents, code, designs, and other project assets with your team.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Features: Version control, commenting, download tracking, and access permissions
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground mb-3">
              Monitor project milestones and overall completion status.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Features: Milestone tracking, progress charts, time logging, and completion reports
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices for Project Success</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Define Clear Goals:</span> Establish specific, measurable objectives at the start of each project.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Communicate Regularly:</span> Schedule regular check-ins and maintain open communication channels.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Document Everything:</span> Keep detailed records of decisions, changes, and progress for future reference.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0">4</div>
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Review and Reflect:</span> Conduct retrospectives to identify what worked well and areas for improvement.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}