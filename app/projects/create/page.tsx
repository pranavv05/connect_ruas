"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, X, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    teamSize: "",
    dueDate: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (loading || success) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Convert files to data URLs (base64) with a size guard
      const readFileAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

      const filesData = await Promise.all(
        files.map(async (f) => ({ name: f.name, type: f.type, size: f.size, dataUrl: await readFileAsDataUrl(f) }))
      )

      const body = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        files: filesData,
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error("Failed to create project", err)
        // Provide a more user-friendly error message for username conflicts
        if (err.error && err.error.includes('username')) {
          throw new Error("There was an issue with your account. Please try logging out and back in again.");
        }
        throw new Error(err.error || res.statusText)
      }
      
      const created = await res.json()
      setSuccess(true)
      
      // Show success message and then redirect after 2 seconds
      setRedirecting(true)
      setTimeout(() => {
        // Navigate to the My Projects section
        router.push('/projects?tab=my-projects')
        // Remove router.refresh() to prevent full page refresh
        // The redirect will naturally update the projects list
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Unexpected error creating project")
      setLoading(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.teamSize

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
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create New Project</h1>
          <p className="text-lg text-muted-foreground">Start collaborating with others on your next big idea</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-success/10 border border-success/20 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Project Created Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              {redirecting 
                ? "Redirecting to your projects page..." 
                : "You will be redirected shortly..."}
            </p>
            {redirecting ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
            ) : (
              <div className="flex justify-center">
                <div className="w-6 h-6 rounded-full bg-primary/20 animate-pulse"></div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project, goals, and what you're building..."
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
                  required
                />
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Required Skills</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., React, Node.js, UI Design (comma separated)"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  List the skills needed for this project to help find the right collaborators
                </p>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Team Size <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select team size</option>
                  <option value="2-3">2-3 members</option>
                  <option value="4-5">4-5 members</option>
                  <option value="6-10">6-10 members</option>
                  <option value="10+">10+ members</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Project Files</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground mb-1">Click to upload files</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, Images, ZIP (max 10MB each)</p>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2">
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}