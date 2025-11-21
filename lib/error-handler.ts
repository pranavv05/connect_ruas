/**
 * Utility functions for handling API errors consistently across the application
 */

interface ApiError {
  error: string;
  userMessage?: string;
  details?: any;
}

/**
 * Handles errors from API responses and returns user-friendly messages
 */
export async function handleApiError(response: Response): Promise<string> {
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  try {
    const errorData: ApiError = await response.json();
    
    // Use the userMessage if provided, otherwise fallback to error or statusText
    if (errorData.userMessage) {
      errorMessage = errorData.userMessage;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else {
      errorMessage = response.statusText || errorMessage;
    }
  } catch (parseError) {
    // If we can't parse the error response, use the status text
    errorMessage = response.statusText || errorMessage;
  }
  
  return errorMessage;
}

/**
 * Creates a standardized error response for API routes
 */
export function createErrorResponse(error: any, defaultUserMessage: string = 'An unexpected error occurred.'): Response {
  console.error('API Error:', error);
  
  // Default user-friendly message
  let userMessage = defaultUserMessage;
  
  // Customize message based on error type
  if (error.message?.includes('timeout')) {
    userMessage = 'The service is taking longer than expected. Please try again in a few minutes.';
  } else if (error.message?.includes('API key')) {
    userMessage = 'There\'s an issue with our service configuration. Our team has been notified.';
  } else if (error.message?.includes('quota')) {
    userMessage = 'We\'ve reached our service limits. Please try again later or contact support.';
  } else if (error.message?.includes('Unauthorized')) {
    userMessage = 'You don\'t have permission to perform this action. Please check your authentication.';
  }
  
  return new Response(
    JSON.stringify({
      error: error.message || 'Internal server error',
      userMessage: userMessage
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Wraps an API route handler with standardized error handling
 */
export function withErrorHandling(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      return createErrorResponse(error);
    }
  };
}