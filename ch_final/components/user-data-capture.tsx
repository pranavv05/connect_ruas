"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserDataCapture() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // When user data is loaded, ensure it's captured in our database
      const captureUserData = async () => {
        try {
          console.log('Capturing user data for:', user.id);
          
          // Get the user's primary email and full name
          const primaryEmail = user.primaryEmailAddress?.emailAddress || `${user.id}@example.com`;
          const fullName = user.fullName || 
            (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) || 
            'User';
          
          // Send user data to our API to ensure it's captured in the database
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.error('Failed to capture user data:', response.status);
            return;
          }
          
          console.log('User data captured successfully for:', user.id);
        } catch (error) {
          console.error('Error capturing user data:', error);
        }
      };
      
      // Capture user data
      captureUserData();
    }
  }, [isLoaded, user]);

  return null; // This component doesn't render anything
}