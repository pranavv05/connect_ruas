"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Upload, FileText, Sparkles, Download, Clock, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { ResumeAnalysis, SuggestionCategory } from "@/components/resume-analysis"

export default function ResumePage() {
  const { userId } = useAuth();
  const [resumeVersions, setResumeVersions] = useState<any[]>([]);
  const [currentResume, setCurrentResume] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Fetch resumes from the database
  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        const response = await fetch('/api/resumes');
        
        if (!response.ok) {
          // Try to parse error response
          let errorMessage = 'Failed to fetch resumes';
          try {
            const errorData = await response.json();
            errorMessage = errorData.userMessage || errorData.error || errorMessage;
          } catch (parseError) {
            // If we can't parse the error, use the status text
            errorMessage = `Failed to fetch resumes: ${response.statusText || 'Server error'}`;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        setResumeVersions(data.resumes);
        
        // Set the first resume as current if available
        if (data.resumes.length > 0) {
          setCurrentResume(data.resumes[0]);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading your resumes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchResumes();
    }
  }, [userId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    setIsAnalyzing(true);
    setError(null); // Clear any previous errors

    try {
      // 1. Prepare form data for API upload
      const formData = new FormData();
      formData.append('resume', file);

      // 2. Call the Next.js API route for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'AI analysis failed on the server.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.userMessage || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error, use the status text
          errorMessage = `Failed to analyze resume: ${response.statusText || 'Server error'}`;
        }
        
        // Handle specific error cases
        if (response.status === 503) {
          // Service unavailable - show a more specific error message
          throw new Error('The AI service is currently overloaded. Please wait a few minutes and try again.');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const aiAnalysis: SuggestionCategory[] = result.analysis || []; // Default to empty array
    
      // 3. Create a new resume entry in the database
      const newScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      const resumeData = {
        templateName: file.name,
        content: {
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          analysisData: aiAnalysis,
          score: newScore
        },
        analysisData: aiAnalysis,
        score: newScore
      };

      const createResponse = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!createResponse.ok) {
        // Try to parse error response
        let errorMessage = 'Failed to save resume';
        try {
          const errorData = await createResponse.json();
          errorMessage = errorData.userMessage || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error, use the status text
          errorMessage = `Failed to save resume: ${createResponse.statusText || 'Server error'}`;
        }
        throw new Error(errorMessage);
      }

      const createResult = await createResponse.json();
    
      // 4. Update state with the new resume
      const newResume = {
        id: createResult.resume.id,
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        analyzed: true,
        score: newScore,
        content: resumeData.content
      };
    
      setResumeVersions(prev => [newResume, ...prev]);
      setCurrentResume(newResume);

    } catch (error: any) {
      console.error('Frontend upload/analysis error:', error);
      const userMessage = error.message || 'An unexpected error occurred while analyzing your resume. Please try again.';
      setError(userMessage);
    } finally {
      setIsAnalyzing(false);
      e.target.value = ''; // Reset file input
    }
  }

  // NOTE: This function is simplified as upload handles analysis
  const handleAnalyze = () => {
    if (isAnalyzing) return;
    alert("Use the 'Upload New Version & Analyze with AI' box to submit a file for AI processing.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background ml-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-foreground">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background ml-64 flex items-center justify-center">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Resumes</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
            >
              Try Again
            </button>
            <button 
              onClick={() => setError(null)}
              className="border border-border bg-background text-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-muted"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showAnalysis = currentResume?.content?.analysisData && currentResume.content.analysisData.length > 0;

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Resume Builder</h1>
          <p className="text-lg text-muted-foreground">Optimize your resume with AI-powered suggestions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Resume Versions</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{resumeVersions.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="text-sm font-medium text-muted-foreground">Current Score</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {currentResume?.content?.score ? `${currentResume.content.score}/100` : 'N/A'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
            </div>
            <p className="text-lg font-bold text-foreground">
              {currentResume?.uploadedAt ? new Date(currentResume.uploadedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Resume & Analysis Section */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Current Resume</h2>

              {/* Current Resume Info */}
              {currentResume ? (
                <div className="bg-secondary border border-border rounded-xl p-4 sm:p-6 mb-6 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{currentResume.name}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full w-fit">
                          Current Version
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-foreground">Resume Quality Score</span>
                          <span className="text-sm font-bold text-primary">
                            {currentResume.content?.score || 0}/100
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${currentResume.content?.score || 0}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary border border-border rounded-xl p-6 sm:p-8 mb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Resume Selected</h3>
                  <p className="text-muted-foreground mb-4">Upload a resume to get started</p>
                </div>
              )}

              {/* Upload New Version (triggers upload and AI analysis) */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors mb-6">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base text-foreground mb-1 font-medium">Upload New Version & Analyze with AI</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX (max 5MB)</p>
                </label>
              </div>

              {/* Analyze Button (Hidden, as upload does the analysis now) */}
              {!showAnalysis && !isAnalyzing && currentResume && (
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Re-Analyze with AI
                </button>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-destructive" />
                    Resume Analysis Failed
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setError(null)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => {
                        setError(null);
                        // Reset file input
                        const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="border border-border bg-background text-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-muted"
                    >
                      Choose Different File
                    </button>
                  </div>
                </div>
              )}

              {/* Analyzing State */}
              {isAnalyzing && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-6 text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">Analyzing Your Resume</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our AI is reviewing your resume and generating personalized suggestions...
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p>This usually takes 10-30 seconds</p>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {showAnalysis && !isAnalyzing && currentResume?.content?.analysisData && (
                <ResumeAnalysis 
                  analysisData={currentResume.content.analysisData} 
                  mockScore={currentResume.content.score || 0} 
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Version History */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Version History</h3>
              <div className="space-y-3">
                {resumeVersions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setCurrentResume(version)}
                    className={`w-full text-left bg-secondary border rounded-lg p-3 transition-all ${
                      currentResume?.id === version.id ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground truncate flex-1">{version.name}</p>
                      {version.content?.analysisData?.length > 0 && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 ml-2" />}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{version.uploadedAt ? new Date(version.uploadedAt).toLocaleDateString() : 'N/A'}</span>
                      <span className="text-primary font-medium">
                        {version.content?.score ? `${version.content.score}/100` : 'N/A'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resume Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Use Action Verbs</p>
                    <p className="text-xs text-muted-foreground">
                      Start bullet points with strong action verbs like "Led", "Developed", "Achieved"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Quantify Achievements</p>
                    <p className="text-xs text-muted-foreground">Include numbers and metrics to demonstrate impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Tailor to Job</p>
                    <p className="text-xs text-muted-foreground">
                      Customize your resume for each position you apply to
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}