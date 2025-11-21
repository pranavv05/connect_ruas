"use client"

import { RoadmapDisplay } from "@/components/roadmap-display"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { use } from "react"
import { formatRoadmapData, hasRoadmapContent } from "@/lib/roadmap-utils"
import { roadmapDetailMetadata } from './metadata'

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a Promise and must be unwrapped with React.use()
  const { id } = use(params);
  
  // Add extensive debugging
  console.log('=== RoadmapDetailPage Debug Info ===');
  console.log('RoadmapDetailPage: params object (before unwrapping):', params);
  console.log('RoadmapDetailPage: id parameter (after unwrapping):', id);
  console.log('RoadmapDetailPage: typeof id:', typeof id);
  console.log('RoadmapDetailPage: id truthiness:', !!id);
  console.log('RoadmapDetailPage: id length:', id ? id.length : 'N/A');
  console.log('RoadmapDetailPage: id trimmed:', id ? `"${id.trim()}"` : 'N/A');
  console.log('RoadmapDetailPage: is id valid UUID-like:', id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false);
  console.log('=====================================');
  
  const [roadmap, setRoadmap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('=== RoadmapDetailPage useEffect Debug Info ===');
    console.log('RoadmapDetailPage: useEffect called with id:', id);
    console.log('RoadmapDetailPage: useEffect typeof id:', typeof id);
    console.log('RoadmapDetailPage: useEffect id truthiness:', !!id);
    
    // Check if id is valid before proceeding
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('RoadmapDetailPage: Invalid ID, not fetching roadmap');
      setError('Invalid roadmap ID');
      setLoading(false);
      return;
    }
    
    const fetchRoadmap = async () => {
      try {
        console.log(`RoadmapDetailPage: Fetching roadmap with ID: ${id}`);
        console.log(`RoadmapDetailPage: typeof id: ${typeof id}`);
        console.log(`RoadmapDetailPage: id truthiness: ${!!id}`);
        
        // Validate the ID
        if (!id) {
          console.error('RoadmapDetailPage: ID is falsy, not fetching roadmap');
          setError('Invalid roadmap ID');
          setLoading(false);
          return;
        }
        
        // Check if id is a valid string
        if (typeof id !== 'string' || id.trim() === '') {
          console.error('RoadmapDetailPage: ID is not a valid string:', id);
          setError('Invalid roadmap ID');
          setLoading(false);
          return;
        }
        
        // Validate UUID format
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          console.error('RoadmapDetailPage: ID is not a valid UUID format:', id);
          setError('Invalid roadmap ID format');
          setLoading(false);
          return;
        }
        
        const url = `/api/roadmaps?id=${encodeURIComponent(id)}`;
        console.log(`RoadmapDetailPage: Full URL: ${url}`);
        
        // Add fetch options to avoid any caching issues
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        console.log(`RoadmapDetailPage: API response status: ${response.status}`);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`RoadmapDetailPage: Failed to fetch roadmap. Status: ${response.status}, Body: ${errorText}`);
          
          // Handle 404 specifically
          if (response.status === 404) {
            setError('Roadmap not found. It may have been deleted or never existed.');
          } else {
            setError(`Failed to load roadmap: ${response.status} ${response.statusText}`);
          }
          return;
        }
        
        const data = await response.json();
        console.log('RoadmapDetailPage: Fetched roadmap data:', JSON.stringify(data, null, 2));
        setRoadmap(data);
      } catch (err) {
        console.error('RoadmapDetailPage: Error fetching roadmap:', err);
        setError(`Failed to load roadmap: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    console.log('RoadmapDetailPage: Calling fetchRoadmap');
    fetchRoadmap();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background ml-64">
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading roadmap...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-background ml-64">
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-500">
              {error || 'Roadmap not found. Please check the URL or go back to the roadmaps page.'}
            </div>
            <div className="mt-6">
              <Link
                href="/roadmaps"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
              >
                Back to Roadmaps
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Enhanced handling of Prisma JSON serialization issues
  let phasesData = roadmap.phases || [];
  
  // Log debug information
  console.log('RoadmapDetailPage: Raw phases data:', roadmap.phases);
  console.log('RoadmapDetailPage: Phases data type:', typeof roadmap.phases);
  
  // Handle different data types that might be stored in the database
  if (typeof roadmap.phases === 'string') {
    try {
      phasesData = JSON.parse(roadmap.phases);
      console.log('RoadmapDetailPage: Parsed string phases data:', JSON.stringify(phasesData, null, 2));
    } catch (e) {
      console.error('RoadmapDetailPage: Failed to parse string phases JSON:', e);
      phasesData = [];
    }
  } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
    // Handle Prisma JSON objects that might be serialized differently in production
    console.log('RoadmapDetailPage: Object phases data keys:', Object.keys(roadmap.phases));
    
    if (!Array.isArray(roadmap.phases)) {
      // Check if it's a Prisma JSON object with numeric keys
      const keys = Object.keys(roadmap.phases);
      if (keys.length > 0) {
        // Check if all keys are numeric (0, 1, 2, ...)
        const numericKeys = keys.filter(key => !isNaN(Number(key)));
        console.log('RoadmapDetailPage: Numeric keys found:', numericKeys);
        
        if (numericKeys.length === keys.length) {
          // All keys are numeric, convert to array
          const array: any[] = [];
          for (let i = 0; i < numericKeys.length; i++) {
            if (roadmap.phases.hasOwnProperty(i)) {
              array.push(roadmap.phases[i]);
            }
          }
          phasesData = array as any[];
          console.log('RoadmapDetailPage: Converted Prisma JSON object with numeric keys to array:', JSON.stringify(phasesData, null, 2));
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
            console.log('RoadmapDetailPage: Converted nested object structure to array:', JSON.stringify(phasesData, null, 2));
          } else {
            // Try to wrap single object in array
            phasesData = [roadmap.phases];
            console.log('RoadmapDetailPage: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
          }
        }
      } else {
        // Try to wrap single object in array
        phasesData = [roadmap.phases];
        console.log('RoadmapDetailPage: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
      }
    } else {
      // Already an array
      phasesData = roadmap.phases;
      console.log('RoadmapDetailPage: Using array phases data:', JSON.stringify(phasesData, null, 2));
    }
  } else {
    // For any other type (undefined, null, etc.), default to empty array
    phasesData = [];
    console.log('RoadmapDetailPage: Defaulting to empty phases array');
  }
  
  const transformedRoadmap = {
    title: roadmap.title,
    field: "Personalized",
    skillLevel: "Custom",
    timeline: "Flexible",
    phases: Array.isArray(phasesData) ? phasesData : [],
    description: roadmap.description
  }

  // Log transformed data
  console.log('RoadmapDetailPage: Transformed roadmap:', JSON.stringify(transformedRoadmap, null, 2));

  // Check if the roadmap has content - more robust validation
  const hasContent = transformedRoadmap.phases && 
    transformedRoadmap.phases.length > 0 && 
    transformedRoadmap.phases.some((phase: any) => {
      // Check if phase is an object and has milestones
      if (!phase || typeof phase !== 'object') return false;
      
      // Check if milestones exists and is an array with items
      const milestones = phase.milestones || [];
      return Array.isArray(milestones) && milestones.length > 0;
    });

  if (!hasContent) {
    return (
      <div className="min-h-screen bg-background ml-64">
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-yellow-500 mb-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">Incomplete Roadmap</h2>
              <p>This roadmap appears to be incomplete or was not generated properly.</p>
              <p className="mt-2 text-sm text-muted-foreground">This can happen when the AI service times out during generation.</p>
              {/* Debug information for developers */}
              <div className="mt-4 text-left bg-muted p-4 rounded text-xs">
                <p className="font-bold">Debug Info:</p>
                <p>Roadmap ID: {roadmap.id}</p>
                <p>Phases type: {typeof roadmap.phases}</p>
                <p>Phases length: {Array.isArray(phasesData) ? phasesData.length : 'N/A'}</p>
                <p>Transformed phases length: {transformedRoadmap.phases.length}</p>
                <p>First phase: {JSON.stringify(phasesData[0] || 'None', null, 2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/roadmaps"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
              >
                Back to Roadmaps
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <RoadmapDisplay roadmap={transformedRoadmap} roadmapId={roadmap.id} autoSave={false} />
      </main>
    </div>
  )
}