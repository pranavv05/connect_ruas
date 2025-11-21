import getPrismaClient from "@/lib/db"
import { GoogleGenAI } from '@google/genai'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the prisma client
    const prismaClient = await getPrismaClient();
    
    // Test database connection
    await prismaClient.$queryRaw`SELECT 1`
    
    // Test if we can query the user table (if it exists)
    let userCount = 0;
    try {
      userCount = await prismaClient.user.count();
    } catch (e) {
      // Table might not exist yet, which is fine
      console.log("User table not found or empty");
    }
    
    // Test Gemini API connectivity
    let geminiStatus = "unknown";
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        // Simple test to check if the API key works
        await ai.models.list();
        geminiStatus = "connected";
      } else {
        geminiStatus = "missing_api_key";
      }
    } catch (geminiError) {
      geminiStatus = "disconnected";
      console.error("Gemini API test failed:", geminiError);
    }
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      gemini: geminiStatus,
      userCount: userCount
    })
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      gemini: "unknown",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}