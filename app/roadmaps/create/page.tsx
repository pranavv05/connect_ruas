"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { RoadmapDisplay } from "@/components/roadmap-display"

export default function CreateRoadmapPage() {
  const [step, setStep] = useState<"questionnaire" | "generating" | "result">("questionnaire")
  const [roadmapData, setRoadmapData] = useState<any>(null)

  const handleQuestionnaireSubmit = async (formData: any) => {
    setStep("generating")

    // Simulate AI generation
    setTimeout(() => {
      const generatedRoadmap = {
        title: `${formData.field} Career Path`,
        field: formData.field,
        skillLevel: formData.skillLevel,
        timeline: formData.timeline,
        phases: [
          {
            name: "Foundation",
            duration: "2-3 months",
            milestones: [
              {
                title: "Learn Core Fundamentals",
                description: "Master the basics of your chosen field",
                skills: ["HTML", "CSS", "JavaScript Basics"],
                resources: [
                  { title: "MDN Web Docs", type: "Documentation" },
                  { title: "freeCodeCamp", type: "Course" },
                ],
                completed: false,
              },
              {
                title: "Build First Projects",
                description: "Apply your knowledge with hands-on projects",
                skills: ["Project Planning", "Git Basics", "Problem Solving"],
                resources: [
                  { title: "GitHub", type: "Platform" },
                  { title: "Frontend Mentor", type: "Practice" },
                ],
                completed: false,
              },
            ],
          },
          {
            name: "Intermediate",
            duration: "3-4 months",
            milestones: [
              {
                title: "Advanced Concepts",
                description: "Dive deeper into advanced topics",
                skills: ["React", "TypeScript", "State Management"],
                resources: [
                  { title: "React Documentation", type: "Documentation" },
                  { title: "TypeScript Handbook", type: "Documentation" },
                ],
                completed: false,
              },
              {
                title: "Real-world Applications",
                description: "Build production-ready applications",
                skills: ["API Integration", "Testing", "Deployment"],
                resources: [
                  { title: "Vercel", type: "Platform" },
                  { title: "Jest Documentation", type: "Documentation" },
                ],
                completed: false,
              },
            ],
          },
          {
            name: "Advanced",
            duration: "2-3 months",
            milestones: [
              {
                title: "System Design",
                description: "Learn to architect scalable systems",
                skills: ["Architecture", "Performance", "Security"],
                resources: [
                  { title: "System Design Primer", type: "Course" },
                  { title: "Web.dev", type: "Documentation" },
                ],
                completed: false,
              },
              {
                title: "Portfolio & Networking",
                description: "Build your professional presence",
                skills: ["Portfolio Development", "LinkedIn", "Open Source"],
                resources: [
                  { title: "GitHub Profile", type: "Platform" },
                  { title: "LinkedIn Learning", type: "Course" },
                ],
                completed: false,
              },
            ],
          },
        ],
      }

      setRoadmapData(generatedRoadmap)
      setStep("result")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              ConnectRUAS
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/roadmaps"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {step === "questionnaire" && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Career Roadmap</h1>
              <p className="text-lg text-muted-foreground">
                Answer a few questions to get a personalized AI-powered career path
              </p>
            </div>
            <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
          </>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your Roadmap</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Our AI is analyzing your responses and creating a personalized career path tailored to your goals...
            </p>
          </div>
        )}

        {step === "result" && roadmapData && <RoadmapDisplay roadmap={roadmapData} />}
      </main>
    </div>
  )
}
