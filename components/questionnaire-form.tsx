"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface QuestionnaireFormProps {
  onSubmit: (data: any) => void
}

export function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [formData, setFormData] = useState({
    field: "",
    skillLevel: "",
    timeCommitment: "",
    learningStyle: "",
    timeline: "",
    specificSkills: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid = formData.field && formData.skillLevel && formData.timeCommitment && formData.timeline

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
      <div className="space-y-6">
        {/* Career Field */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What's your target career field? <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a field</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Product Management">Product Management</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="DevOps">DevOps</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Mobile Development">Mobile Development</option>
          </select>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Current skill level? <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, skillLevel: level })}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  formData.skillLevel === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-foreground hover:border-primary/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Time Commitment */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Time commitment? <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Part-time (10-15 hrs/week)", "Full-time (30+ hrs/week)"].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setFormData({ ...formData, timeCommitment: time })}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  formData.timeCommitment === time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-foreground hover:border-primary/50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Style */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Preferred learning style?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Hands-on Projects", "Online Courses", "Reading/Docs", "Mentorship"].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setFormData({ ...formData, learningStyle: style })}
                className={`px-4 py-3 rounded-lg border transition-all text-sm ${
                  formData.learningStyle === style
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-foreground hover:border-primary/50"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Goal */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Timeline goal? <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["3 months", "6 months", "1 year", "2+ years"].map((timeline) => (
              <button
                key={timeline}
                type="button"
                onClick={() => setFormData({ ...formData, timeline })}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  formData.timeline === timeline
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-foreground hover:border-primary/50"
                }`}
              >
                {timeline}
              </button>
            ))}
          </div>
        </div>

        {/* Specific Skills */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Any specific technologies or skills you want to learn?
          </label>
          <textarea
            value={formData.specificSkills}
            onChange={(e) => setFormData({ ...formData, specificSkills: e.target.value })}
            placeholder="e.g., React, Python, Machine Learning, AWS..."
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          Generate My Roadmap
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
