"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, BookOpen, ExternalLink, Save, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatRoadmapData, hasRoadmapContent } from "@/lib/roadmap-utils"

interface RoadmapDisplayProps {
  roadmap: any
  autoSave?: boolean // New prop to control auto-saving
  roadmapId?: string // New prop for existing roadmaps
}

export function RoadmapDisplay({ roadmap, autoSave = false, roadmapId }: RoadmapDisplayProps) {
  console.log('RoadmapDisplay: Received roadmap data:', roadmap);
  
  // Enhanced handling of roadmap data
  let phasesData = roadmap.phases || [];
  
  // Handle different data types that might be passed in
  if (typeof roadmap.phases === 'string') {
    try {
      phasesData = JSON.parse(roadmap.phases);
      console.log('RoadmapDisplay: Parsed string phases data:', JSON.stringify(phasesData, null, 2));
    } catch (e) {
      console.error('RoadmapDisplay: Failed to parse string phases JSON:', e);
      phasesData = [];
    }
  } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
    // Handle Prisma JSON objects that might be serialized differently in production
    console.log('RoadmapDisplay: Object phases data keys:', Object.keys(roadmap.phases));
    
    if (!Array.isArray(roadmap.phases)) {
      // Check if it's a Prisma JSON object with numeric keys
      const keys = Object.keys(roadmap.phases);
      if (keys.length > 0) {
        // Check if all keys are numeric (0, 1, 2, ...)
        const numericKeys = keys.filter(key => !isNaN(Number(key)));
        console.log('RoadmapDisplay: Numeric keys found:', numericKeys);
        
        if (numericKeys.length === keys.length) {
          // All keys are numeric, convert to array
          const array: any[] = [];
          for (let i = 0; i < numericKeys.length; i++) {
            if (roadmap.phases.hasOwnProperty(i)) {
              array.push(roadmap.phases[i]);
            }
          }
          phasesData = array as any[];
          console.log('RoadmapDisplay: Converted Prisma JSON object with numeric keys to array:', JSON.stringify(phasesData, null, 2));
        } else {
          // Check if it's a nested object structure that needs flattening
          // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
          if (keys.some(key => !isNaN(Number(key)))) {
            // Has some numeric keys, try to convert
            const array: any[] = [];
            keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
              if (!isNaN(Number(key))) {
                array.push(roadmap.phases[key]);
              }
            });
            phasesData = array as any[];
            console.log('RoadmapDisplay: Converted nested object structure to array:', JSON.stringify(phasesData, null, 2));
          } else {
            // Try to wrap single object in array
            phasesData = [roadmap.phases];
            console.log('RoadmapDisplay: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
          }
        }
      } else {
        // Try to wrap single object in array
        phasesData = [roadmap.phases];
        console.log('RoadmapDisplay: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
      }
    } else {
      // Already an array
      phasesData = roadmap.phases;
      console.log('RoadmapDisplay: Using array phases data:', JSON.stringify(phasesData, null, 2));
    }
  } else {
    // For any other type (undefined, null, etc.), default to empty array
    phasesData = [];
    console.log('RoadmapDisplay: Defaulting to empty phases array');
  }
  
  // Create a properly formatted roadmap object
  const formattedRoadmap = {
    ...roadmap,
    phases: Array.isArray(phasesData) ? phasesData : []
  };
  
  console.log('RoadmapDisplay: Formatted roadmap:', JSON.stringify(formattedRoadmap, null, 2));

  // Check if the roadmap has content - more robust validation
  const contentExists = formattedRoadmap.phases && 
    formattedRoadmap.phases.length > 0 && 
    formattedRoadmap.phases.some((phase: any) => {
      // Check if phase is a valid object
      if (!phase || typeof phase !== 'object') {
        return false;
      }
      
      // Check if phase has milestones array with content
      const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];
      return milestones.length > 0;
    });

  console.log('RoadmapDisplay: Content exists:', contentExists);

  // More robust milestone processing
  const processMilestones = () => {
    if (!contentExists) return [];
    
    try {
      return formattedRoadmap.phases.flatMap((phase: any) => {
        if (!phase || !phase.milestones || !Array.isArray(phase.milestones)) return [];
        return phase.milestones.map((m: any) => ({ 
          ...m, 
          completed: m.completed || false 
        }));
      });
    } catch (e) {
      console.error('Error processing milestones:', e);
      return [];
    }
  };

  const router = useRouter()
  const [milestones, setMilestones] = useState(processMilestones())
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasAutoSaved, setHasAutoSaved] = useState(false)

  // Show a message if the roadmap is empty
  if (!contentExists) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{formattedRoadmap.title}</h1>
              <p className="text-muted-foreground">
                {formattedRoadmap.skillLevel} • {formattedRoadmap.timeline} timeline
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              This roadmap appears to be incomplete or was not generated properly. This can happen when the AI service times out during generation.
            </p>
          </div>
          {/* Back button */}
          <div className="mt-4">
            <button
              onClick={() => router.push("/roadmaps")}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Roadmaps
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auto-save when component mounts if autoSave is true
  useEffect(() => {
    if (autoSave && !roadmapId && !hasAutoSaved) {
      handleSave(true)
      setHasAutoSaved(true)
    }
  }, [autoSave, roadmapId, hasAutoSaved])

  const toggleMilestone = async (index: number, milestoneId: number) => {
    const updated = [...milestones];
    const newCompletedStatus = !updated[index].completed;
    updated[index].completed = newCompletedStatus;
    setMilestones(updated);
    
    // If this is an existing roadmap, save the progress to the database
    if (roadmapId) {
      try {
        const response = await fetch(`/api/roadmaps/${roadmapId}/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            milestoneId: milestoneId,
            completed: newCompletedStatus
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update progress:', errorData);
          // Revert the UI change if the API call fails
          const reverted = [...milestones];
          reverted[index].completed = !newCompletedStatus;
          setMilestones(reverted);
          alert(`Failed to update progress: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
        // Revert the UI change if the API call fails
        const reverted = [...milestones];
        reverted[index].completed = !newCompletedStatus;
        setMilestones(reverted);
        alert(`Failed to update progress: ${(error as Error).message}`);
      }
    }
  }

  const handleSave = async (isAutoSave = false) => {
    // If this is an existing roadmap, don't save again
    if (roadmapId) return

    try {
      setIsSaving(true)
      
      // Prepare the roadmap data for saving
      const roadmapToSave = {
        title: formattedRoadmap.title,
        description: formattedRoadmap.description || `A ${formattedRoadmap.skillLevel || 'personalized'} roadmap in ${formattedRoadmap.field || 'your field'} with ${formattedRoadmap.timeline || 'flexible'} timeline`,
        phases: formattedRoadmap.phases, // This should be an array of phases
      };

      console.log('Sending roadmap data:', JSON.stringify(roadmapToSave, null, 2));

      // Save to database
      const response = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save roadmap: ${errorData.error} - ${errorData.details || ''}`);
      }

      const savedRoadmap = await response.json();
      console.log("[v0] Roadmap saved successfully:", savedRoadmap);
      
      // Only redirect if this is not an auto-save
      if (!isAutoSave) {
        router.push("/roadmaps");
      }
    } catch (error) {
      console.error("Error saving roadmap:", error);
      // Show error to user
      alert(`Failed to save roadmap: ${(error as Error).message}`);
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!roadmapId) return

    if (!confirm("Are you sure you want to delete this roadmap? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/roadmaps?id=${roadmapId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete roadmap: ${errorData.error} - ${errorData.details || ''}`);
      }

      console.log("[v0] Roadmap deleted successfully");
      // Redirect to roadmaps page after deleting
      router.push("/roadmaps");
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      // Show error to user
      alert(`Failed to delete roadmap: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{formattedRoadmap.title}</h1>
            {formattedRoadmap.description && (
              <p className="text-muted-foreground mb-3">{formattedRoadmap.description}</p>
            )}
            <p className="text-muted-foreground">
              {formattedRoadmap.skillLevel} • {formattedRoadmap.timeline} timeline
            </p>
          </div>
          <div className="flex gap-2">
            {roadmapId ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? 'Deleting...' : 'Delete Roadmap'}
              </button>
            ) : (
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Roadmap'}
              </button>
            )}
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            This personalized roadmap was generated based on your goals and preferences. You can customize it anytime
            and track your progress as you complete each milestone.
          </p>
        </div>
        {/* Back button */}
        <div className="mt-4">
          <button
            onClick={() => router.push("/roadmaps")}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Roadmaps
          </button>
        </div>
      </div>

      {/* Phases */}
      {formattedRoadmap.phases.map((phase: any, phaseIndex: number) => {
        // Ensure phase is valid
        if (!phase || typeof phase !== 'object') return null;
        
        // Ensure milestones is valid
        const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];
        
        // Skip phases without milestones
        if (milestones.length === 0) return null;
        
        return (
          <div key={phaseIndex} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">{phase.name || phase.title} Phase</h2>
                <p className="text-sm text-muted-foreground">Duration: {phase.duration || phase.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {milestones.filter((m: any) => m.completed).length}/{milestones.length} completed
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone: any, milestoneIndex: number) => {
                const globalIndex =
                  formattedRoadmap.phases.slice(0, phaseIndex).reduce((acc: number, p: any) => {
                    const pMilestones = Array.isArray(p.milestones) ? p.milestones : [];
                    return acc + pMilestones.length;
                  }, 0) +
                  milestoneIndex

                return (
                  <div
                    key={milestoneIndex}
                    className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleMilestone(globalIndex, milestone.id)}
                        className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                      >
                        {milestones[globalIndex]?.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>

                        {/* Skills */}
                        {milestone.skills && Array.isArray(milestone.skills) && milestone.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Skills to learn:</p>
                            <div className="flex flex-wrap gap-2">
                              {milestone.skills.map((skill: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        {milestone.resources && Array.isArray(milestone.resources) && milestone.resources.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Recommended resources:</p>
                            <div className="space-y-2">
                              {milestone.resources.map((resource: any, idx: number) => {
                                // Handle both string resources and object resources with URLs
                                let resourceTitle, resourceUrl, resourceType;
                                
                                if (typeof resource === 'string') {
                                  // String resource - create a search URL
                                  resourceTitle = resource;
                                  resourceUrl = `https://www.google.com/search?q=${encodeURIComponent(resource)}`;
                                  resourceType = 'Resource';
                                } else if (typeof resource === 'object' && resource.url) {
                                  // Object resource with URL - use the direct URL
                                  resourceTitle = resource.title || 'Untitled Resource';
                                  resourceUrl = resource.url;
                                  resourceType = resource.type || 'Resource';
                                } else {
                                  // Fallback for unexpected resource format
                                  resourceTitle = 'Unknown Resource';
                                  resourceUrl = '#';
                                  resourceType = 'Resource';
                                }
                                
                                return (
                                  <a
                                    key={idx}
                                    href={resourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between bg-muted/50 border border-border rounded-lg px-4 py-2 hover:border-primary/50 transition-colors group"
                                  >
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-foreground">{resourceTitle}</span>
                                      <span className="text-xs text-muted-foreground">• {resourceType}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );
      })}
    </div>
  )
}