"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Send, Sparkles, Bot, TrendingUp, Users, Clock, Target, CheckCircle, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import { formatRoadmapData } from "@/lib/roadmap-utils"
import { roadmapsMetadata } from './metadata'

// Define types for the new structure
type Milestone = {
  id: number
  title: string
  resources: (string | { title: string; url: string; type: string })[]
  completed: boolean
}

type Phase = {
  id: number
  title: string
  description: string
  milestones: Milestone[]
}

type GeneratedRoadmap = {
  id: string
  title: string
  description: string
  phases: Phase[]
}

// NEW: Define the type for a saved roadmap summary
type RoadmapSummary = {
  id: string;
  title: string;
  field: string;
  progress: number;
  phase: string;
  timeline: string;
  createdAt: string;
  milestones: { completed: number; total: number };
};

// Mock data for suggested roadmaps (unchanged)
const suggestedRoadmaps = [
  {
    id: "s1",
    title: "Full Stack Developer",
    description: "Master both frontend and backend development to build complete web applications",
    difficulty: "Intermediate",
    timeline: "6-8 months",
    milestones: 15,
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "REST APIs"],
    followers: 2847,
    popular: true,
  },
  {
    id: "s2",
    title: "Frontend Developer",
    description: "Specialize in creating beautiful, responsive user interfaces and experiences",
    difficulty: "Beginner",
    timeline: "4-6 months",
    milestones: 12,
    skills: ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
    followers: 3521,
    popular: true,
  },
  {
    id: "s3",
    title: "Data Scientist",
    description: "Learn to analyze data, build models, and extract insights using Python and ML",
    difficulty: "Advanced",
    timeline: "8-12 months",
    milestones: 18,
    skills: ["Python", "Pandas", "Machine Learning", "SQL", "Statistics"],
    followers: 2156,
    popular: true,
  },
]

// NEW: Define the questions for the AI assessment
const assessmentQuestions = [
  "First, what field or industry are you most interested in? (e.g., web development, data science, mobile apps, cybersecurity)",
  "Great! What's your current experience level in this field? (e.g., complete beginner, some experience, advanced)",
  "How much time can you realistically commit to learning each week? (e.g., 2-4 hours, 5-10 hours, 10+ hours)",
  "What's your preferred way to learn? (e.g., reading articles, watching video courses, hands-on projects)",
  "Finally, what is your ultimate career goal? (e.g., get a job as a junior developer, build my own startup, become a freelancer)"
];

type Message = {
  role: "user" | "assistant"
  content: string
}

// Function to generate a mock AI roadmap structure
// In a real application, this would be the payload from your AI API call
const generateMockRoadmap = (title: string): GeneratedRoadmap => ({
  id: "ai-12345",
  title: `Personalized ${title} Roadmap`,
  description: `An AI-optimized learning path for ${title}, tailored for an intermediate, part-time learner on a 6-month timeline, focusing on hands-on projects.`,
  phases: [
    {
      id: 1,
      title: "Phase 1: Foundational Core",
      description: "Establish a strong base in essential technologies and concepts.",
      milestones: [
        { id: 101, title: "Master JavaScript Fundamentals", resources: [
          { title: "MDN Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "Documentation" },
          { title: "Course: JS Complete Guide", url: "https://example.com/js-course", type: "Course" }
        ], completed: false },
        { id: 102, title: "Learn Git and GitHub Basics", resources: [
          { title: "Pro Git Book", url: "https://git-scm.com/book/en/v2", type: "Book" },
          { title: "GitHub Docs", url: "https://docs.github.com", type: "Documentation" }
        ], completed: false },
        { id: 103, title: "Build a Simple Static Website (HTML/CSS)", resources: [
          { title: "FreeCodeCamp HTML/CSS", url: "https://freecodecamp.org", type: "Course" },
          { title: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs", type: "Documentation" }
        ], completed: false },
      ],
    },
    {
      id: 2,
      title: "Phase 2: Frontend Specialization (React)",
      description: "Dive deep into modern frontend framework development with React.",
      milestones: [
        { id: 201, title: "Understand React Hooks and State Management", resources: [
          { title: "React Official Docs", url: "https://reactjs.org/docs/hooks-intro.html", type: "Documentation" },
          { title: "Project: Todo App", url: "https://example.com/todo-project", type: "Project" }
        ], completed: false },
        { id: 202, title: "Implement Routing with React Router", resources: [
          { title: "React Router Docs", url: "https://reactrouter.com", type: "Documentation" },
          { title: "Video Tutorial: Basic Routing", url: "https://example.com/routing-tutorial", type: "Video" }
        ], completed: false },
        { id: 203, title: "Create a Reusable Component Library", resources: [
          { title: "Article: Design Systems", url: "https://example.com/design-systems", type: "Article" },
          { title: "Figma Design Example", url: "https://figma.com/example", type: "Tool" }
        ], completed: false },
      ],
    },
    {
      id: 3,
      title: "Phase 3: Backend & Full Stack Integration",
      description: "Build a robust server, connect a database, and integrate the frontend.",
      milestones: [
        { id: 301, title: "Learn Node.js and Express.js", resources: [
          { title: "Node.js Docs", url: "https://nodejs.org/en/docs/", type: "Documentation" },
          { title: "Course: Express.js API", url: "https://example.com/express-course", type: "Course" }
        ], completed: false },
        { id: 302, title: "Design and Implement a REST API", resources: [
          { title: "Article: REST Best Practices", url: "https://example.com/rest-best-practices", type: "Article" },
          { title: "Project: Simple Blog API", url: "https://example.com/blog-api-project", type: "Project" }
        ], completed: false },
        { id: 303, title: "Connect to a PostgreSQL Database (CRUD)", resources: [
          { title: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/", type: "Documentation" },
          { title: "Video: Database Setup", url: "https://example.com/database-setup", type: "Video" }
        ], completed: false },
        { id: 304, title: "Deploy the Full Stack Application", resources: [
          { title: "Vercel/Netlify Docs", url: "https://vercel.com/docs", type: "Documentation" },
          { title: "AWS EC2 Tutorial", url: "https://example.com/aws-ec2-tutorial", type: "Tutorial" }
        ], completed: false },
      ],
    },
  ],
});

export default function RoadmapsPage() {
  const { user } = useUser();
  const [activeTab, _setActiveTab] = useState<"suggested-roadmaps" | "my-roadmaps" | "create-new">("create-new")
  
  // Helper function to get user initials
  const getUserInitials = () => {
    if (!user) return "U";
    
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    } else if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    
    return "U";
  };
  
  const setActiveTab = (tab: "suggested-roadmaps" | "my-roadmaps" | "create-new") => {
    _setActiveTab(tab);
    // Refresh roadmaps data when switching to "my-roadmaps" tab
    if (tab === "my-roadmaps") {
      fetchRoadmaps();
    }
  };
  
  // UPDATED: Chat state to manage the conversation flow
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your AI career advisor. I'm here to help you create a personalized roadmap for your career journey!" },
    { role: "assistant", content: "To get started, I'd love to learn a bit about you. What field or industry are you most interested in? (e.g., web development, data science, mobile apps, cybersecurity)" }
  ]);
  const [conversationStep, setConversationStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showInitialGreeting, setShowInitialGreeting] = useState(true);

  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  // NEW STATE: To hold the list of suggested roadmaps
  const [displayedSuggestedRoadmaps, setDisplayedSuggestedRoadmaps] = useState(suggestedRoadmaps);
  
  // UPDATED: "My Roadmaps" now starts as an empty array
  const [myRoadmaps, setMyRoadmaps] = useState<any[]>([]);

  // NEW STATE: For the generated roadmap view
  const [generatedRoadmap, setGeneratedRoadmap] = useState<GeneratedRoadmap | null>(null)
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch("/api/roadmaps");
      if (response.ok) {
        const roadmaps = await response.json();
        // Format each roadmap using our utility function
        const formattedRoadmaps = roadmaps.map((roadmap: any) => formatRoadmapData(roadmap));
        setMyRoadmaps(formattedRoadmaps);
      }
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
    }
  };


  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userAnswer = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userAnswer }]);
  
    // Check if this is a greeting and we're at the beginning of the conversation
    if (showInitialGreeting && isGreeting(userAnswer)) {
      setShowInitialGreeting(false);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Hello! I'm excited to help you create a personalized career roadmap. To get started, could you tell me what field or industry you're most interested in? (e.g., web development, data science, mobile apps, cybersecurity)" 
        }]);
      }, 500);
      return;
    }
    
    // Reset the initial greeting flag after the first non-greeting message
    if (showInitialGreeting) {
      setShowInitialGreeting(false);
    }
    
    const newAnswers = [...userAnswers, userAnswer];
    setUserAnswers(newAnswers);

    const nextStep = conversationStep + 1;

    if (nextStep < assessmentQuestions.length) {
      // Ask the next question
      setConversationStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: assessmentQuestions[nextStep] }]);
      }, 500);
    } else {
      // All questions answered, now generate suggestions
      setIsGenerating(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: "Excellent! Thank you for your answers. I'm now creating personalized roadmaps with full detailed content and adding them to your collection. This will take just a moment..." }]);
      }, 500);

      try {
        const userProfile = {
          interest: newAnswers[0],
          experience: newAnswers[1],
          time: newAnswers[2],
          style: newAnswers[3],
          goal: newAnswers[4],
        };

        // Add timeout to the fetch request
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
        );
        
        const fetchPromise = fetch('/api/suggest-roadmaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile }),
        });
        
        const response = await Promise.race([fetchPromise, timeout]) as Response;

        if (!response.ok) {
          let errorMessage = 'Failed to get suggestions from the AI.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.userMessage || errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = `Failed to get suggestions: ${response.statusText || 'Server error'}`;
          }
          throw new Error(errorMessage);
        }

        const newSuggestions = await response.json();

        // Generate full content for each suggested roadmap and save to database
        const savedRoadmaps = [];
        let generationErrors = 0;
        let timeoutErrors = 0;

        for (const suggestion of newSuggestions) {
          try {
            console.log(`Generating full content for roadmap: ${suggestion.title}`);
          
            // Generate full detailed content for the roadmap
            const generateResponse = await fetch('/api/generate-roadmap', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ roadmapTitle: suggestion.title }),
            });

            console.log(`Generate response status: ${generateResponse.status}`);

            if (generateResponse.ok) {
              const fullRoadmap = await generateResponse.json();
              console.log('Generated full roadmap:', JSON.stringify(fullRoadmap, null, 2));
            
              // Only save the roadmap if it has actual content (phases and milestones)
              if (fullRoadmap.phases && fullRoadmap.phases.length > 0) {
                // Check if any phase has milestones
                const hasMilestones = fullRoadmap.phases.some((phase: any) => 
                  phase.milestones && phase.milestones.length > 0
                );
                
                if (hasMilestones) {
                  // Save the full roadmap with detailed content to the database
                  const roadmapToSave = {
                    title: fullRoadmap.title,
                    description: fullRoadmap.description || suggestion.description || `A personalized roadmap for ${fullRoadmap.title}`,
                    phases: fullRoadmap.phases || [] // Include the full phases and milestones
                  };

                  console.log('Saving roadmap to database:', JSON.stringify(roadmapToSave, null, 2));

                  const saveResponse = await fetch("/api/roadmaps", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(roadmapToSave),
                  });

                  console.log(`Save response status: ${saveResponse.status}`);

                  if (saveResponse.ok) {
                    const savedRoadmap = await saveResponse.json();
                    console.log('Saved roadmap:', JSON.stringify(savedRoadmap, null, 2));
                    savedRoadmaps.push(savedRoadmap);
                  } else {
                    const errorText = await saveResponse.text();
                    console.error("Failed to save roadmap:", suggestion.title, "Status:", saveResponse.status, "Error:", errorText);
                    generationErrors++;
                  }
                } else {
                  console.warn("Skipping roadmap save - no milestones found:", suggestion.title);
                  generationErrors++;
                }
              } else {
                console.warn("Skipping roadmap save - no phases found:", suggestion.title);
                generationErrors++;
              }
            } else {
              const errorText = await generateResponse.text();
              console.error("Failed to generate full content for roadmap:", suggestion.title, "Status:", generateResponse.status, "Error:", errorText);
              
              // Count timeout errors separately
              if (generateResponse.status === 504) {
                console.log("Timeout error for roadmap:", suggestion.title);
                timeoutErrors++;
              } else {
                generationErrors++;
              }
            }
          } catch (generateError) {
            console.error("Error generating/saving roadmap:", generateError);
            // Count timeout errors separately
            if (generateError instanceof Error && generateError.message.includes('timeout')) {
              console.log("Timeout error caught for roadmap:", suggestion.title);
              timeoutErrors++;
            } else {
              generationErrors++;
            }
          }
        }

        // Fetch updated roadmaps from the database
        await fetchRoadmaps();

        // Provide feedback to the user about the results
        let assistantMessage = "🎉 I've created your new roadmaps with full detailed content and saved them! You can see them now in the 'My Roadmaps' tab.";

        // If we had timeout errors, provide specific feedback
        if (timeoutErrors > 0) {
          if (savedRoadmaps.length > 0) {
            assistantMessage = `✅ I've created ${savedRoadmaps.length} roadmap${savedRoadmaps.length > 1 ? 's' : ''} with detailed content. ${timeoutErrors} roadmap${timeoutErrors > 1 ? 's' : ''} couldn't be generated due to AI service timeouts, but the completed ones have been saved. You can see them now in the 'My Roadmaps' tab.`;
          } else {
            assistantMessage = "⚠️ I encountered timeouts while generating roadmaps. This usually happens when the AI service is busy. Please try again in a few minutes when the service is less busy. You can also try creating a custom roadmap manually.";
            // Don't switch to the My Roadmaps tab if no roadmaps were saved
            setActiveTab("create-new");
          }
        } else if (generationErrors > 0) {
          if (savedRoadmaps.length > 0) {
            assistantMessage = `✅ I've created ${savedRoadmaps.length} roadmap${savedRoadmaps.length > 1 ? 's' : ''} with detailed content. Some roadmaps couldn't be generated due to errors, but the ones that completed successfully have been saved. You can see them now in the 'My Roadmaps' tab.`;
          } else {
            assistantMessage = "⚠️ I encountered issues generating detailed roadmaps. Please try again in a few minutes when the AI service is less busy. You can also try creating a custom roadmap manually.";
            // Don't switch to the My Roadmaps tab if no roadmaps were saved
            setActiveTab("create-new");
          }
        } else if (savedRoadmaps.length === 0) {
          assistantMessage = "⚠️ I couldn't generate any detailed roadmaps at this time. Please try again in a few minutes when the AI service is less busy. You can also try creating a custom roadmap manually.";
          // Don't switch to the My Roadmaps tab if no roadmaps were saved
          setActiveTab("create-new");
        }

        setMessages(prev => [...prev, { role: "assistant", content: assistantMessage }]);

        // Only switch to My Roadmaps tab if we actually saved some roadmaps
        if (savedRoadmaps.length > 0) {
          setActiveTab("my-roadmaps");
        }

      } catch (error) {
        console.error("Failed to generate suggestions:", error);
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Sorry, I'm having trouble generating suggestions right now. Please try again in a few minutes." 
        }]);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // NEW FUNCTION: Handles starting a suggested roadmap
  const handleStartRoadmap = async (roadmapTitle: string) => {
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    setGeneratedRoadmap(null); // Clear previous roadmap

    try {
      console.log(`Generating roadmap for: ${roadmapTitle}`);
      
      // Create a timeout promise (increased to 50 seconds to match Netlify config)
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - please try again')), 50000)
      );
      
      // Create the fetch promise
      const fetchPromise = fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roadmapTitle }),
      });
      
      // Race the fetch against the timeout
      const response = await Promise.race([fetchPromise, timeout]) as Response;

      console.log(`Generate roadmap response status: ${response.status}`);

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'Failed to generate roadmap. Please try again later.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.userMessage || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error, use the status text
          errorMessage = `Failed to generate roadmap: ${response.statusText || 'Server error'}`;
        }
        throw new Error(errorMessage);
      }

      const newRoadmap: GeneratedRoadmap = await response.json();
      console.log('Generated roadmap:', JSON.stringify(newRoadmap, null, 2));
      
      // Check if the generated roadmap has content
      const hasContent = newRoadmap.phases && 
        newRoadmap.phases.length > 0 && 
        newRoadmap.phases.some((phase: any) => 
          phase.milestones && phase.milestones.length > 0
        );

      if (!hasContent) {
        throw new Error('The generated roadmap is empty. Please try again in a few minutes when the AI service is less busy.');
      }

      setGeneratedRoadmap(newRoadmap);

      // Automatically save the generated roadmap
      const savedRoadmap = await autoSaveRoadmap(newRoadmap);
      if (savedRoadmap) {
        console.log('Roadmap successfully auto-saved with ID:', savedRoadmap.id);
      } else {
        console.error('Failed to auto-save roadmap');
        setRoadmapError('Failed to save the generated roadmap. Please try again.');
      }
    } catch (error: any) {
      console.error("Roadmap generation failed:", error);
      // Provide a user-friendly error message
      const userMessage = error.message || "We're having trouble generating your roadmap right now. Please try again in a few minutes.";
      setRoadmapError(userMessage);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  }

  // NEW FUNCTION: Automatically saves a generated roadmap
  const autoSaveRoadmap = async (roadmap: GeneratedRoadmap) => {
    try {
      console.log('Auto-saving roadmap:', JSON.stringify(roadmap, null, 2));
  
    // Check if the roadmap has content before saving
    const hasContent = roadmap.phases && 
      roadmap.phases.length > 0 && 
      roadmap.phases.some((phase: any) => 
        phase.milestones && phase.milestones.length > 0
      );

    if (!hasContent) {
      console.warn('Skipping auto-save - roadmap has no content');
      return null;
    }
  
    // Prepare the roadmap data for saving
    const roadmapToSave = {
      title: roadmap.title,
      description: roadmap.description || `A personalized roadmap with ${roadmap.phases.length} phases`,
      phases: roadmap.phases, // This should be an array of phases
    };

    console.log('Sending roadmap data to API:', JSON.stringify(roadmapToSave, null, 2));

    const response = await fetch("/api/roadmaps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roadmapToSave),
    });

    console.log('Auto-save API response status:', response.status);

    if (response.ok) {
      const newRoadmap = await response.json();
      console.log('Auto-saved roadmap response:', JSON.stringify(newRoadmap, null, 2));
      setMyRoadmaps(prev => [newRoadmap, ...prev]);
      // Don't redirect automatically, let the user decide
      return newRoadmap; // Return the saved roadmap
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to auto-save roadmap. Status:", response.status, "Data:", errorData);
      // Show error to user
      alert(`Failed to auto-save roadmap: ${response.status} - ${errorData.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.error("Failed to auto-save roadmap:", error);
    // Show error to user
    alert(`Failed to auto-save roadmap: ${(error as Error).message}`);
    return null;
  }
};

  // NEW FUNCTION: Saves the generated roadmap to "My Roadmaps"
  const handleSaveRoadmap = async () => {
    if (!generatedRoadmap) return;

    try {
      // Check if the roadmap has content before saving
      const hasContent = generatedRoadmap.phases && 
        generatedRoadmap.phases.length > 0 && 
        generatedRoadmap.phases.some((phase: any) => 
          phase.milestones && phase.milestones.length > 0
        );

      if (!hasContent) {
        alert('This roadmap is empty and cannot be saved. Please try generating a new roadmap.');
        return;
      }

      // Prepare the roadmap data for saving
      const roadmapToSave = {
        title: generatedRoadmap.title,
        description: generatedRoadmap.description || `A personalized roadmap with ${generatedRoadmap.phases.length} phases`,
        phases: generatedRoadmap.phases, // This should be an array of phases
      };

      const response = await fetch("/api/roadmaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roadmapToSave),
      });

      if (response.ok) {
        const newRoadmap = await response.json();
        setMyRoadmaps(prev => [newRoadmap, ...prev]);
        setGeneratedRoadmap(null);
        setActiveTab("my-roadmaps");
      } else {
        const errorData = await response.json();
        console.error("Failed to save roadmap:", errorData);
        alert(`Failed to save roadmap: ${errorData.error} - ${errorData.details || ''}`);
      }
    } catch (error) {
      console.error("Failed to save roadmap:", error);
      alert(`Failed to save roadmap: ${(error as Error).message}`);
    }
  };

  // NEW FUNCTION: Toggles the completion status of a milestone
  const handleToggleMilestone = (phaseId: number, milestoneId: number) => {
    if (!generatedRoadmap) return;

    setGeneratedRoadmap(prevRoadmap => {
      if (!prevRoadmap) return prevRoadmap;

      const updatedPhases = prevRoadmap.phases.map(phase => {
        if (phase.id === phaseId) {
          const updatedMilestones = phase.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              return { ...milestone, completed: !milestone.completed };
            }
            return milestone;
          });
          return { ...phase, milestones: updatedMilestones };
        }
        return phase;
      });

      return { ...prevRoadmap, phases: updatedPhases };
    });
  };

  // NEW COMPONENT: Renders the interactive AI-generated roadmap
  const GeneratedRoadmapView = ({ roadmap, onBack }: { roadmap: GeneratedRoadmap, onBack: () => void }) => {
    const totalMilestones = roadmap.phases.flatMap(p => p.milestones).length;
    const completedMilestones = roadmap.phases.flatMap(p => p.milestones).filter(m => m.completed).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    
    return (
      <div className="space-y-8">
        <button onClick={onBack} className="flex items-center text-primary hover:text-primary/80 transition-colors mb-4">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Suggested Roadmaps
        </button>
        
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              {roadmap.title}
            </h2>
            <p className="text-lg text-muted-foreground mt-1">{roadmap.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{progress}%</p>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Phases and Milestones */}
        <div className="space-y-10">
          {roadmap.phases.map(phase => (
            <div key={phase.id} className="border-l-4 border-primary/50 pl-6 space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">{phase.id}. {phase.title}</h3>
              <p className="text-muted-foreground">{phase.description}</p>
              
              <div className="space-y-3">
                {phase.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      milestone.completed 
                        ? 'bg-green-500/10 border-green-500/50' 
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleToggleMilestone(phase.id, milestone.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground/50 rounded-full flex-shrink-0" />
                        )}
                        <span className={`font-medium ${milestone.completed ? 'text-green-500 line-through' : 'text-foreground'}`}>
                          {milestone.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {/* Fix: Handle both string and object resources */}
                        {Array.isArray(milestone.resources) 
                          ? `${milestone.resources.length} resource${milestone.resources.length !== 1 ? 's' : ''}`
                          : '0 resources'}
                      </span>
                    </div>
                    {milestone.completed && (
                      <p className="text-xs text-green-600 mt-2 italic">Milestone Achieved! Great job.</p>
                    )}
                    {!milestone.completed && Array.isArray(milestone.resources) && milestone.resources.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Suggested Resources:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.resources.map((resource, idx) => (
                            // Fix: Handle both string and object resources
                            <span key={idx} className="text-xs bg-muted border border-border px-2 py-1 rounded-full text-foreground/80">
                              {typeof resource === 'string' 
                                ? resource 
                                : typeof resource === 'object' && resource !== null
                                  ? resource.title || 'Resource'
                                  : 'Resource'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-8">
          <button 
            onClick={handleSaveRoadmap} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Finish & Save Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Helper function to detect greetings
  const isGreeting = (message: string) => {
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    const lowerMessage = message.toLowerCase();
    return greetings.some(greeting => lowerMessage.includes(greeting));
  };

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Career Roadmaps</h1>
          <p className="text-lg text-muted-foreground">Plan and track your career journey with AI-powered guidance</p>
        </div>

        {/* Render the generated roadmap view if it exists */}
        {isGeneratingRoadmap ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your Roadmap</h2>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Our AI is analyzing your request and creating a personalized career path...
            </p>
            <div className="text-sm text-muted-foreground">
              <p>This usually takes 10-30 seconds</p>
            </div>
          </div>
        ) : roadmapError ? (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-2">Generation Failed</h3>
              <p className="text-muted-foreground mb-4">
                {roadmapError}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => setRoadmapError(null)} 
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => setActiveTab("create-new")} 
                  className="border border-border bg-background text-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-muted"
                >
                  Create Custom Roadmap
                </button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>If the problem persists, you can also try:</p>
                <ul className="list-disc list-inside mt-2 text-left">
                  <li>Refreshing the page</li>
                  <li>Checking your internet connection</li>
                  <li>Contacting support if the issue continues</li>
                </ul>
              </div>
            </div>
          </div>
        ) : generatedRoadmap ? (
            <GeneratedRoadmapView 
                roadmap={generatedRoadmap} 
                onBack={() => setGeneratedRoadmap(null)} // Reset state to show tabs again
            />
        ) : (
            <>
                {/* Tab Navigation (only visible if no roadmap is being viewed) */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
                  <button
                    onClick={() => setActiveTab("suggested-roadmaps")}
                    className={`px-4 sm:px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                      activeTab === "suggested-roadmaps" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Suggested Roadmaps</span>
                    <span className="sm:hidden">Suggested</span>
                    {activeTab === "suggested-roadmaps" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("my-roadmaps")}
                    className={`px-4 sm:px-6 py-3 font-medium transition-colors relative ${
                      activeTab === "my-roadmaps" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="hidden sm:inline">My Roadmaps</span>
                    <span className="sm:hidden">My</span>
                    {activeTab === "my-roadmaps" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                  <button
                    onClick={() => setActiveTab("create-new")}
                    className={`px-4 sm:px-6 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                      activeTab === "create-new" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Create New</span>
                    <span className="sm:hidden">Create</span>
                    {activeTab === "create-new" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "suggested-roadmaps" && (
                  <>
                    <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Suggested Career Paths
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your interests, here are some curated roadmaps. Start your journey today!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedSuggestedRoadmaps.map((roadmap) => (
                        <div
                          key={roadmap.id}
                          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group relative"
                        >
                          {roadmap.popular && (
                            <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Popular
                            </div>
                          )}

                          <div className="mb-4">
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {roadmap.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{roadmap.description}</p>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                Difficulty
                              </span>
                              <span
                                className={`font-medium px-2 py-0.5 rounded text-xs ${
                                  roadmap.difficulty === "Beginner"
                                    ? "bg-green-500/10 text-green-500"
                                    : roadmap.difficulty === "Intermediate"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : "bg-red-500/10 text-red-500"
                                }`}
                              >
                                {roadmap.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Timeline
                              </span>
                              <span className="text-foreground font-medium">{roadmap.timeline}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Milestones</span>
                              <span className="text-foreground font-medium">{roadmap.milestones} steps</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Followers
                              </span>
                              <span className="text-foreground font-medium">{roadmap.followers.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Key Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {roadmap.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {roadmap.skills.length > 3 && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                  +{roadmap.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CHANGED: onClick handler added here */}
                          <button 
                            onClick={() => handleStartRoadmap(roadmap.title)}
                            disabled={isGeneratingRoadmap}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingRoadmap ? 'Generating...' : 'Start This Roadmap'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "my-roadmaps" && (
                  <>
                    {myRoadmaps.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-border rounded-lg">
                            <h3 className="text-xl font-semibold text-foreground">No Roadmaps Yet</h3>
                            <p className="text-muted-foreground mt-2">
                                {isGenerating ? 
                                  "Your AI-generated roadmaps are being created. This may take a few moments..." :
                                  "Use the AI chat to create a personalized roadmap and save it here, or try creating one manually."
                                }
                            </p>
                            <button
                                onClick={() => setActiveTab("create-new")}
                                className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90 flex items-center gap-2 mx-auto"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create a New Roadmap
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRoadmaps.map((roadmap) => (
                            <Link
                                key={roadmap.id}
                                href={`/roadmaps/${roadmap.id}`} // This should be the database ID
                                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {roadmap.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{roadmap.field}</p>
                                </div>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{roadmap.progress}%</span>
                                </div>

                                <div className="w-full bg-muted rounded-full h-2 mb-4">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${roadmap.progress}%` }}
                                />
                                </div>

                                <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Phase</span>
                                    <span className="text-foreground font-medium">{roadmap.phase}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Timeline</span>
                                    <span className="text-foreground font-medium">{roadmap.timeline}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Milestones</span>
                                    <span className="text-foreground font-medium">
                                    {roadmap.milestones?.completed || 0}/{roadmap.milestones?.total || 0}
                                    </span>
                                </div>
                                </div>

                                <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Created {roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleDateString() : 'Unknown'}
                                </p>
                                </div>
                            </Link>
                            ))}
                        </div>
                    )}
                </>
                )}

                {activeTab === "create-new" && (
                  // ... (Create New/Chat content is unchanged)
                   <div className="max-w-4xl mx-auto">
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                            {/* Chat Header */}
                            <div className="bg-primary/5 border-b border-border px-4 sm:px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">AI Career Advisor</h3>
                                        <p className="text-sm text-muted-foreground">Let's create your personalized roadmap</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        {message.role === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">
                                                {getUserInitials()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isGenerating && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-muted rounded-lg px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-100" />
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-200" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="border-t border-border p-4">
                                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={conversationStep < assessmentQuestions.length || showInitialGreeting ? "Type your answer..." : "All questions answered!"}
                        className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={isGenerating || (conversationStep >= assessmentQuestions.length && !showInitialGreeting)}
                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!input.trim() || isGenerating || (conversationStep >= assessmentQuestions.length && !showInitialGreeting)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="hidden sm:inline">Send</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Helper Tips */}
                        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Tips for better roadmaps
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Answer each question to help the AI understand your goals.</li>
                                <li>• Be specific about your career interests and current skill level.</li>
                                <li>• Your answers will be used to generate highly personalized roadmaps.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  )
}