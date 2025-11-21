"use client"

import Link from "next/link"
import { FileText, Plus, Upload, Download, Eye, Zap, Target, CheckCircle } from "lucide-react"

export default function ResumeBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <span>/</span>
          <span className="text-foreground">Resume Builder</span>
        </nav>
        <h1 className="text-4xl font-bold text-foreground mb-4">Resume Builder</h1>
        <p className="text-xl text-muted-foreground">
          Create and optimize your professional resume with AI-powered suggestions.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Why Use Our Resume Builder?</h2>
            <p className="text-muted-foreground">
              Our AI-powered resume builder helps you create professional, optimized resumes that stand out to employers 
              and pass through applicant tracking systems (ATS).
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Optimization
            </h3>
            <p className="text-muted-foreground text-sm">
              Get suggestions to improve content, structure, and keyword optimization.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              ATS Friendly
            </h3>
            <p className="text-muted-foreground text-sm">
              Ensure your resume passes through applicant tracking systems successfully.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Professional Templates
            </h3>
            <p className="text-muted-foreground text-sm">
              Choose from professionally designed templates that make a great impression.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">Creating Your Resume</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">1. Start from Scratch</h3>
            </div>
            <p className="text-muted-foreground">
              Use our guided process to build your resume from the ground up. We'll help you include all 
              the essential sections and information.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">2. Import Existing Resume</h3>
            </div>
            <p className="text-muted-foreground">
              Upload your existing resume in PDF or Word format. Our system will parse the content and 
              help you improve it.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">3. Get AI Suggestions</h3>
            </div>
            <p className="text-muted-foreground">
              Receive personalized suggestions to improve your content, structure, and keyword optimization 
              based on your target roles.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">4. Preview and Download</h3>
            </div>
            <p className="text-muted-foreground">
              Preview your resume in real-time and download it in multiple formats including PDF and Word.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Resume Sections</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Contact Information</h3>
            <p className="text-muted-foreground mb-3">
              Your name, phone number, email, and LinkedIn profile.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Tip: Use a professional email address and ensure all links work correctly.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Professional Summary</h3>
            <p className="text-muted-foreground mb-3">
              A brief 2-3 sentence overview of your experience, skills, and career goals.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Tip: Customize this section for each job application to match the role requirements.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Work Experience</h3>
            <p className="text-muted-foreground mb-3">
              Detailed descriptions of your previous roles with achievements and responsibilities.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Tip: Use action verbs and quantify your achievements with numbers and percentages.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Education</h3>
            <p className="text-muted-foreground mb-3">
              Your academic background including degrees, institutions, and graduation dates.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Tip: Include relevant coursework, honors, and academic projects for recent graduates.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Skills</h3>
            <p className="text-muted-foreground mb-3">
              Technical and soft skills relevant to your target roles.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground">
                Tip: Organize skills into categories and indicate proficiency levels where appropriate.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">AI Optimization Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-foreground mb-2">Keyword Optimization</h3>
            <p className="text-muted-foreground">
              Our AI analyzes job descriptions and suggests relevant keywords to include in your resume.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Content Enhancement</h3>
            <p className="text-muted-foreground">
              Receive suggestions to improve sentence structure, eliminate redundancies, and enhance clarity.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Format Optimization</h3>
            <p className="text-muted-foreground">
              Ensure your resume has proper spacing, consistent formatting, and professional layout.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">ATS Compatibility</h3>
            <p className="text-muted-foreground">
              Check that your resume will be parsed correctly by applicant tracking systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}