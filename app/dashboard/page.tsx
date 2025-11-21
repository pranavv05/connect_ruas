"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatsGrid } from "@/components/stats-grid"
import { RoadmapsPreview } from "@/components/roadmaps-preview"
import { ProjectsPreview } from "@/components/projects-preview"
import { QuickActions } from "@/components/quick-actions"
import { ResumeStatus } from "@/components/resume-status"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader />

        <div className="mt-8">
          <StatsGrid />
        </div>

        <div className="mt-8">
          <QuickActions />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoadmapsPreview />
          <ProjectsPreview />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumeStatus />
        </div>
      </main>
    </div>
  )
}