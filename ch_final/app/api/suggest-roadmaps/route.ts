import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the desired structured output format for the AI
const jsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string", description: "A unique slug-like ID, e.g., 'ai-engineer-pro'." },
      title: { type: "string", description: "The title of the career roadmap." },
      description: { type: "string", description: "A brief, engaging description of the roadmap." },
      difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"], description: "The skill level required." },
      timeline: { type: "string", description: "An estimated time to complete, e.g., '6-8 months'." },
      milestones: { type: "number", description: "The total number of milestones in the roadmap." },
      skills: { type: "array", items: { type: "string" }, description: "A list of 3-5 key skills covered." },
      followers: { type: "number", description: "A fictional but realistic number of followers, e.g., between 500 and 3000." },
      popular: { type: "boolean", description: "Set to true if it's a very common or trending path." }
    },
    required: ["id", "title", "description", "difficulty", "timeline", "milestones", "skills", "followers", "popular"]
  }
};

export async function POST(req: NextRequest) {
  try {
    const { userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json({ 
        error: 'User profile is required.',
        userMessage: 'Please provide your profile information to generate suggestions.'
      }, { status: 400 });
    }

    // Add a timeout to prevent hanging (increased to 55 seconds to stay under Netlify's 60-second limit)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI service timeout - this usually happens when the AI service is busy. Please try again in a few minutes.')), 55000)
    );

    // Get the Gemini model (using flash for faster response)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a more detailed prompt using the user's answers
    const prompt = `
      Based on the following user profile, generate a list of 3 diverse and relevant career roadmap suggestions. The suggestions should be actionable and highly tailored to the user's preferences.

      User Profile:
      - Field of Interest: ${userProfile.interest}
      - Current Experience: ${userProfile.experience}
      - Weekly Time Commitment: ${userProfile.time}
      - Preferred Learning Style: ${userProfile.style}
      - Ultimate Goal: ${userProfile.goal}

      Output the list strictly in the requested JSON schema.
    `;

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

    // Try to parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      // Simple approach: find the first [ and last ] and try to parse that
      const firstBracket = responseText.indexOf('[');
      const lastBracket = responseText.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        const jsonString = responseText.substring(firstBracket, lastBracket + 1);
        suggestions = JSON.parse(jsonString);
      } else {
        throw new Error('Could not parse JSON from AI response');
      }
    }
    
    // Validate that we got suggestions
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('No roadmap suggestions generated');
    }
    
    return NextResponse.json(suggestions);

  } catch (error: any) {
    console.error('AI Suggestion Generation Error:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Sorry, we couldn\'t generate suggestions right now. Please try again in a few minutes.';
    let statusCode = 500;
    
    // Customize error message based on error type
    if (error.message?.includes('timeout')) {
      userMessage = 'The AI service is taking longer than expected. Roadmap suggestion generation is complex and can take up to a minute. Please try again, and consider being more specific with your profile information.';
      statusCode = 408; // Request Timeout
    } else if (error.message?.includes('API key')) {
      userMessage = 'There\'s an issue with our AI service configuration. Our team has been notified.';
    } else if (error.message?.includes('quota')) {
      userMessage = 'We\'ve reached our AI service limits. Please try again later or contact support.';
    } else if (error.message?.includes('suggestions')) {
      userMessage = 'The AI service couldn\'t generate roadmap suggestions. Please try again with different input.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AI suggestions.',
      userMessage: userMessage
    }, { status: statusCode });
  }
}