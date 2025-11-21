"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { fetchWithCache } from "@/lib/data-fetching"

interface Project {
  id: string
  title: string
  status: string
  statusColor: string
  members: {
    name: string;
    avatar: string;
  }[]
  dueDate: string
  createdAt: string
  skills: string[]
  description: string
}

export function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      // Explicitly request member projects only
      const data = await fetchWithCache('/api/projects?limit=3&type=member', { credentials: 'include' }, 5 * 60 * 1000) // 5 minute cache
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true;
    
    const loadProjects = async () => {
      await fetchProjects()
    }

    loadProjects()
    
    // Refresh projects every 5 minutes
    const interval = setInterval(() => {
      if (isMounted) {
        fetchProjects()
      }
    }, 5 * 60 * 1000)

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearInterval(interval)
    };
  }, [fetchProjects])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
          <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
          <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h3>
        <Link href="/projects" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <span className="hidden sm:inline">View all</span>
          <span className="sm:hidden">View</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-sm cursor-pointer block"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">{project.title}</h4>
                <span className={`text-sm font-medium ${project.statusColor}`}>{project.status}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground mb-3 gap-2">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.members.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  +{project.skills.length - 3} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}