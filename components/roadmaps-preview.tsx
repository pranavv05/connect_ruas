"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fetchWithCache } from "@/lib/data-fetching"

interface Roadmap {
  id: string
  title: string
  phase: string
  progress: number
  milestones: {
    completed: number
    total: number
  }
  // Add full content fields for preloading
  phases?: any[]
  description?: string
  createdAt?: string
}

export function RoadmapsPreview() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoadmaps = useCallback(async () => {
    try {
      // Fetch full roadmap data for preloading
      const data = await fetchWithCache('/api/roadmaps?limit=3', {}, 5 * 60 * 1000) // 5 minute cache
      setRoadmaps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true;
    
    const loadRoadmaps = async () => {
      await fetchRoadmaps()
    }

    loadRoadmaps()
    
    // Refresh roadmaps every 5 minutes
    const interval = setInterval(() => {
      if (isMounted) {
        fetchRoadmaps()
      }
    }, 5 * 60 * 1000)

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      clearInterval(interval)
    };
  }, [fetchRoadmaps])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
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
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Active Roadmaps</h3>
        <Link href="/roadmaps" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <span className="hidden sm:inline">View all</span>
          <span className="sm:hidden">View</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {roadmaps.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">No active roadmaps found.</div>
        ) : (
          roadmaps.map((r) => (
            <Link 
              key={r.id} 
              href={`/roadmaps/${r.id}`}
              className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{r.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {r.phase || 'Unknown'} • {r.milestones?.completed || 0}/{r.milestones?.total || 0} steps
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="font-semibold text-foreground">{r.progress || 0}%</div>
                </div>
              </div>
              {/* Preloaded content indicator */}
              {r.phases && r.phases.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {r.phases.length} phases with {r.milestones?.total || 0} milestones
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}