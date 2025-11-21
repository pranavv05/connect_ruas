/**
 * Utility functions for handling roadmap data
 */

/**
 * Parse roadmap phases data from various formats
 * @param phasesData - The phases data which could be a string, object, or array
 * @returns Parsed phases array or empty array if parsing fails
 */
export function parseRoadmapPhases(phasesData: any): any[] {
  console.log('RoadmapUtils: Parsing phases data:', typeof phasesData, phasesData);
  
  // Handle null/undefined cases
  if (!phasesData) {
    console.log('RoadmapUtils: Phases data is null/undefined, returning empty array');
    return [];
  }
  
  // Handle array case (already parsed)
  if (Array.isArray(phasesData)) {
    console.log('RoadmapUtils: Phases data is already an array');
    return phasesData;
  }
  
  // Handle string case (needs parsing)
  if (typeof phasesData === 'string') {
    try {
      const parsed = JSON.parse(phasesData);
      console.log('RoadmapUtils: Successfully parsed string phases data');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('RoadmapUtils: Failed to parse string phases data:', e);
      return [];
    }
  }
  
  // Handle object case (common in production environments)
  if (typeof phasesData === 'object') {
    console.log('RoadmapUtils: Phases data is an object');
    
    // If it's already an array-like object with length property, convert to array
    if (phasesData && typeof phasesData === 'object' && 'length' in phasesData) {
      try {
        // Convert array-like object to real array
        const array: any[] = Array.from(phasesData);
        console.log('RoadmapUtils: Converted array-like object to array');
        return array;
      } catch (e) {
        console.error('RoadmapUtils: Failed to convert array-like object:', e);
      }
    }
    
    // Handle Prisma JSON objects that might be serialized differently in production
    if (phasesData && !Array.isArray(phasesData)) {
      // Check if it's a Prisma JSON object with numeric keys
      const keys = Object.keys(phasesData);
      console.log('RoadmapUtils: Object keys:', keys);
      
      if (keys.length > 0) {
        // Check if all keys are numeric (0, 1, 2, ...)
        const numericKeys = keys.filter(key => !isNaN(Number(key)));
        console.log('RoadmapUtils: Numeric keys:', numericKeys);
        
        if (numericKeys.length === keys.length) {
          // All keys are numeric, convert to array
          const array: any[] = [];
          for (let i = 0; i < numericKeys.length; i++) {
            if (phasesData.hasOwnProperty(i)) {
              array.push(phasesData[i]);
            }
          }
          console.log('RoadmapUtils: Converted Prisma JSON object with numeric keys to array');
          return array;
        }
        
        // Check if it's a nested object structure that needs flattening
        // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
        if (keys.some(key => !isNaN(Number(key)))) {
          // Has some numeric keys, try to convert
          const array: any[] = [];
          keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
            if (!isNaN(Number(key))) {
              array.push(phasesData[key]);
            }
          });
          console.log('RoadmapUtils: Converted nested object structure to array');
          return array;
        }
      }
      
      // If it's a single phase object, wrap it in an array
      if (phasesData && typeof phasesData === 'object' && !Array.isArray(phasesData) && Object.keys(phasesData).length > 0) {
        console.log('RoadmapUtils: Wrapping single object in array');
        return [phasesData];
      }
    }
    
    // Fallback: return empty array if we can't parse the object
    console.log('RoadmapUtils: Unable to parse object, returning empty array');
    return [];
  }
  
  // Fallback for any other type
  console.log('RoadmapUtils: Unknown phases data type, returning empty array');
  return [];
}

/**
 * Format roadmap data for consistent structure
 * @param roadmap - The raw roadmap data from the database
 * @returns Formatted roadmap object
 */
export function formatRoadmapData(roadmap: any) {
  console.log('RoadmapUtils: Formatting roadmap data:', roadmap);
  
  // Parse phases data
  const phases = parseRoadmapPhases(roadmap.phases);
  console.log('RoadmapUtils: Parsed phases:', phases);
  
  // Return formatted roadmap
  return {
    ...roadmap,
    phases: phases,
    // Add default values for missing fields
    title: roadmap.title || 'Untitled Roadmap',
    description: roadmap.description || '',
    field: roadmap.field || 'Personalized',
    skillLevel: roadmap.skillLevel || 'Custom',
    timeline: roadmap.timeline || 'Flexible'
  };
}

/**
 * Check if a roadmap has valid content
 * @param roadmap - The roadmap object to check
 * @returns Boolean indicating if the roadmap has content
 */
export function hasRoadmapContent(roadmap: any): boolean {
  console.log('RoadmapUtils: Checking roadmap content:', roadmap);
  
  if (!roadmap || !Array.isArray(roadmap.phases)) {
    console.log('RoadmapUtils: Roadmap or phases is not an array');
    return false;
  }
  
  const hasContent = roadmap.phases.some((phase: any) => {
    // Check if phase is a valid object
    if (!phase || typeof phase !== 'object') {
      return false;
    }
    
    // Check if phase has milestones array with content
    const milestones = Array.isArray(phase.milestones) ? phase.milestones : [];
    return milestones.length > 0;
  });
  
  console.log('RoadmapUtils: Roadmap has content:', hasContent);
  return hasContent;
}