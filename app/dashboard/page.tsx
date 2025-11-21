"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatsGrid } from "@/components/stats-grid"
import { RoadmapsPreview } from "@/components/roadmaps-preview"
import { ProjectsPreview } from "@/components/projects-preview"
import { QuickActions } from "@/components/quick-actions"
import { ResumeStatus } from "@/components/resume-status"
import { MentorshipPreview } from "@/components/mentorship-preview"
import { useState } from "react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader />
        
        {/* Tabs */}
        <div className="mt-8">
          <div className="inline-flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("mentorship")}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "mentorship"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mentorship
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
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
          </>
        )}

        {activeTab === "mentorship" && (
          <div className="mt-8">
            <MentorshipPreview />
          </div>
        )}
      </main>
    </div>
  )
}