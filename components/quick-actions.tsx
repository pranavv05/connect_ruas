"use client"

import { Target, Briefcase, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

const actions = [
  {
    label: "Create Roadmap",
    description: "Start a new career path",
    icon: Target,
    href: "/roadmaps", // Changed from "/roadmaps/create" to "/roadmaps"
  },
  {
    label: "New Project",
    description: "Collaborate with others",
    icon: Briefcase,
    href: "/projects/create",
  },
  {
    label: "Update Resume",
    description: "AI-powered optimization",
    icon: FileText,
    href: "/resume",
  },
]

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div
            key={action.label}
            onClick={() => router.push(action.href)}
            className="group bg-secondary border border-border rounded-lg p-5 hover:border-primary hover:bg-secondary/80 transition-all duration-200 hover:shadow-sm cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-foreground mb-1">{action.label}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
