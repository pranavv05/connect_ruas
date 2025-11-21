import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Validate that the API key is present
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini with the server-side environment variable
const ai = new GoogleGenAI({ apiKey });

// The structure for the AI's response (must match the frontend)
interface SuggestionItem {
  original: string;
  improved: string;
  reason: string;
}

interface SuggestionCategory {
  category: string;
  severity: 'high' | 'medium' | 'low';
  items: SuggestionItem[];
}

export async function POST(req: NextRequest) {
  try {
    // 1. Get the file data (multipart form data)
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ 
        error: 'No resume file uploaded.',
        userMessage: 'Please select a resume file to upload and analyze.'
      }, { status: 400 });
    }

    // Validate API key is present
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Server configuration error.',
        userMessage: 'The resume analysis service is currently unavailable. Please try again later.'
      }, { status: 500 });
    }

    // Add a more reasonable timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI service timeout - this usually happens when the AI service is busy. Please try again in a few minutes.')), 45000)
    );

    // 2. Convert File to base64 for Gemini API
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const mimeType = file.type;

    // Validate file size (limit to 5MB)
    if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large.',
        userMessage: 'Please upload a resume file smaller than 5MB.'
      }, { status: 400 });
    }

    // 3. Define the desired structured output format for the AI
    const jsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", description: "e.g., 'Impact and Metrics', 'ATS Keywords', 'Clarity and Formatting'" },
          severity: { type: "string", enum: ["high", "medium", "low"], description: "Priority of the suggestion." },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                original: { type: "string", description: "The original problematic text chunk from the resume." },
                improved: { type: "string", description: "The AI-suggested improvement for the text." },
                reason: { type: "string", description: "A brief, actionable reason for the suggestion." },
              },
              required: ["original", "improved", "reason"]
            }
          }
        },
        required: ["category", "severity", "items"]
      }
    };

    // 4. Prompt the Gemini Model with better error handling
    try {
      const modelResponsePromise = ai.models.generateContent({
        model: "gemini-2.0-flash", // Use a stable model like in generate-roadmap
        contents: [
          // File part (the resume)
          { inlineData: { data: fileBase64, mimeType } },
          // Text part (the instructions)
          { text: `Analyze the provided resume file for common errors related to action verbs, quantifiable metrics, and ATS optimization. Provide at least 5 distinct suggestions. Output the analysis strictly in the requested JSON schema.` }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: jsonSchema,
        }
      });

      // Race the AI call against the timeout
      const modelResponse = await Promise.race([modelResponsePromise, timeoutPromise]) as any;

      // 5. Parse and return the JSON response from the model
      const analysisData: SuggestionCategory[] = JSON.parse(modelResponse.text);

      return NextResponse.json({ success: true, analysis: analysisData });
    } catch (modelError: any) {
      console.error('Gemini Model Error:', modelError);
      
      // Handle specific model errors
      let userMessage = 'Sorry, we couldn\'t analyze your resume right now. Please try again in a few minutes.';
      
      if (modelError.message?.includes('API_KEY_INVALID')) {
        userMessage = 'There\'s an issue with our AI service configuration. Our team has been notified.';
      } else if (modelError.message?.includes('QUOTA_EXCEEDED')) {
        userMessage = 'We\'ve reached our AI service limits. Please try again later or contact support.';
      } else if (modelError.message?.includes('unsupported')) {
        userMessage = 'The file format is not supported. Please upload a PDF, DOC, or DOCX file.';
      } else if (modelError.message?.includes('SERVICE_DISABLED')) {
        userMessage = 'Our AI service is temporarily unavailable. Please try again later.';
      } else if (modelError.message?.includes('overloaded') || modelError.message?.includes('UNAVAILABLE')) {
        userMessage = 'The AI service is currently overloaded. Please try again in a few minutes or contact support if the issue persists.';
      }
      
      return NextResponse.json({ 
        error: modelError.message || 'Failed to process resume analysis.',
        userMessage: userMessage
      }, { status: 503 }); // 503 Service Unavailable for better HTTP semantics
    }

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Sorry, we couldn\'t analyze your resume right now. Please try again in a few minutes.';
    
    // Customize error message based on error type
    if (error.message?.includes('timeout')) {
      userMessage = 'The AI service is taking longer than expected. Please try again in a few minutes.';
    } else if (error.message?.includes('API key')) {
      userMessage = 'There\'s an issue with our AI service configuration. Our team has been notified.';
    } else if (error.message?.includes('quota')) {
      userMessage = 'We\'ve reached our AI service limits. Please try again later or contact support.';
    } else if (error.message?.includes('base64')) {
      userMessage = 'There was an issue processing your file. Please make sure it\'s a valid PDF, DOC, or DOCX file.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to process resume analysis.',
      userMessage: userMessage
    }, { status: 500 });
  }
}