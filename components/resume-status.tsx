"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, Sparkles, Download } from "lucide-react"

interface ResumeData {
  id: string | null
  fileName: string
  lastUpdated: string
  suggestionsCount: number
}

export function ResumeStatus() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/dashboard/resume', {
          credentials: 'include'
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch resume data')
        }
        
        const data = await res.json()
        setResumeData(data)
      } catch (err) {
        console.error('Error fetching resume data:', err)
        setError("Failed to load resume data")
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [])

  const handleDownload = async () => {
    // In a real implementation, this would download the actual resume
    alert('Resume download functionality would be implemented here')
  }

  const handleAnalyze = () => {
    // Redirect to the Resume page
    router.push('/resume')
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="bg-secondary border border-border rounded-lg p-5 animate-pulse">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted"></div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded w-48 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </div>
          </div>
          <div className="bg-muted/10 border border-border rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted rounded"></div>
              <div>
                <div className="h-3 bg-muted rounded w-32 mb-2"></div>
                <div className="h-3 bg-muted rounded w-48"></div>
              </div>
            </div>
          </div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Resume</h3>
          <button 
            className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="bg-secondary border border-border rounded-lg p-5">
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Resume</h3>
        <button 
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
      <div className="bg-secondary border border-border rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-1">{resumeData?.fileName || 'My_Resume.pdf'}</h4>
            <p className="text-sm text-muted-foreground">Last updated {resumeData?.lastUpdated || 'Never'}</p>
          </div>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <Sparkles className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {resumeData?.suggestionsCount || 0} AI Suggestions Available
              </p>
              <p className="text-xs text-muted-foreground">Improve your resume with AI-powered recommendations</p>
            </div>
          </div>
        </div>
        <button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2.5 text-sm font-medium transition-colors"
          onClick={handleAnalyze}
        >
          Analyze with AI
        </button>
      </div>
    </div>
  )
}