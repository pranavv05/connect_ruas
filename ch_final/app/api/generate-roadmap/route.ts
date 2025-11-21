import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the desired structured output format for the AI roadmap
const jsonSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "A unique identifier for the roadmap, e.g., 'ai-roadmap-123'." },
    title: { type: "string", description: "The main title of the generated roadmap." },
    description: { type: "string", description: "A brief, engaging description of what the roadmap covers." },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", description: "A unique numeric ID for the phase, e.g., 1, 2, 3." },
          title: { type: "string", description: "The title of this phase, e.g., 'Phase 1: Foundational Core'." },
          description: { type: "string", description: "A short description of the phase's objectives." },
          milestones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number", description: "A unique numeric ID for the milestone, e.g., 101, 102." },
                title: { type: "string", description: "The specific goal for this milestone, e.g., 'Master JavaScript Fundamentals'." },
                resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "The title of the resource, e.g., 'MDN JavaScript Guide'." },
                      url: { type: "string", description: "The direct URL to the resource, e.g., 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'." },
                      type: { type: "string", description: "The type of resource, e.g., 'Documentation', 'Course', 'Project', 'Video'." }
                    },
                    required: ["title", "url", "type"]
                  },
                  description: "A list of 2-3 suggested learning resources with titles, direct URLs, and types."
                },
                completed: { type: "boolean", description: "The initial completion status, which should always be false." }
              },
              required: ["id", "title", "resources", "completed"]
            }
          }
        },
        required: ["id", "title", "description", "milestones"]
      }
    }
  },
  required: ["id", "title", "description", "phases"]
};

export async function POST(req: NextRequest) {
  try {
    const { roadmapTitle } = await req.json();

    if (!roadmapTitle) {
      return NextResponse.json({ 
        error: 'Roadmap title is required.',
        userMessage: 'Please provide a roadmap title to generate.'
      }, { status: 400 });
    }

    // Add a timeout to prevent hanging (increased to 55 seconds to stay under Netlify's 60-second limit)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI service timeout - this usually happens when the AI service is busy. Please try again in a few minutes.')), 55000)
    );

    // Get the Gemini model (using flash for faster response)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create the prompt
    const prompt = `Generate a detailed, personalized career roadmap for a user who wants to learn "${roadmapTitle}". The user is an intermediate, part-time learner with a 6-month timeline, focusing on hands-on projects. Create a roadmap with 3 distinct phases. Each phase should have 3-4 specific, actionable milestones. For each milestone, suggest 2-3 high-quality learning resources with direct URLs and resource types. Output the analysis strictly in the requested JSON schema with actual URLs for resources.`;
    
    // Generate content with timeout and retry logic
    let result;
    let lastError: any;
    
    // Try up to 2 times in case of transient failures
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const generationPromise = model.generateContent([
          prompt,
          "Output the response in JSON format only, following the specified schema."
        ]);
        
        // Race the AI call against the timeout
        result = await Promise.race([generationPromise, timeoutPromise]) as any;
        break; // Success, exit the loop
      } catch (error: any) {
        lastError = error;
        console.log(`Attempt ${attempt} failed:`, error.message);
        
        // Don't retry on timeout or quota errors
        if (error.message?.includes('timeout') || error.message?.includes('quota')) {
          throw error;
        }
        
        // Wait a bit before retrying (except on last attempt)
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // If we exhausted all attempts, throw the last error
    if (!result) {
      throw lastError;
    }
    
    // Extract the response text
    const response = await result.response;
    let responseText = response.text();

    // Parse and return the JSON response from the model
    if (!responseText) {
      throw new Error('No response text from AI model');
    }
    
    // Try to parse the JSON response
    let roadmapData;
    try {
      roadmapData = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      // Simple approach: find the first { and last } and try to parse that
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonString = responseText.substring(firstBrace, lastBrace + 1);
        roadmapData = JSON.parse(jsonString);
      } else {
        throw new Error('Could not parse JSON from AI response');
      }
    }
    
    // Validate that the generated roadmap has content
    if (!roadmapData || !roadmapData.phases || roadmapData.phases.length === 0) {
      throw new Error('Generated roadmap is empty or invalid');
    }
    
    // Validate that each phase has milestones
    const hasValidContent = roadmapData.phases.some((phase: any) => 
      phase.milestones && phase.milestones.length > 0
    );
    
    if (!hasValidContent) {
      throw new Error('Generated roadmap has no milestones');
    }

    return NextResponse.json(roadmapData);

  } catch (error: any) {
    console.error('AI Roadmap Generation Error:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Sorry, we couldn\'t generate your roadmap right now. Please try again in a few minutes.';
    let statusCode = 500;
    
    // Customize error message based on error type
    if (error.message?.includes('timeout')) {
      userMessage = 'The AI service is taking longer than expected. Roadmap generation is complex and can take up to a minute. Please try again, and consider being more specific with your request.';
      statusCode = 408; // Request Timeout
    } else if (error.message?.includes('API key')) {
      userMessage = 'There\'s an issue with our AI service configuration. Our team has been notified.';
    } else if (error.message?.includes('quota')) {
      userMessage = 'We\'ve reached our AI service limits. Please try again later or contact support.';
    } else if (error.message?.includes('empty') || error.message?.includes('invalid')) {
      userMessage = 'The AI service returned an incomplete roadmap. Please try again with a different topic or be more specific.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AI roadmap.',
      userMessage: userMessage
    }, { status: statusCode });
  }
}