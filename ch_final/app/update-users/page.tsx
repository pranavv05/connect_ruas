'use client';

import { useState } from 'react';

export default function UpdateUsersPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUsers = async () => {
    setIsUpdating(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch('/api/update-users');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to update users');
      }
    } catch (err) {
      setError('Failed to connect to the update service');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Update User Data</h1>
      <p>Update users with placeholder data to have more realistic information</p>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={handleUpdateUsers} 
          disabled={isUpdating}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            opacity: isUpdating ? 0.7 : 1
          }}
        >
          {isUpdating ? 'Updating Users...' : 'Update Users with Placeholder Data'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c33',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#efe', 
          color: '#363',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: 0 }}>Update Summary:</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Total users found with placeholder data: {result.totalUsersFound}</li>
            <li>Successfully updated: {result.successfullyUpdated}</li>
            <li>Skipped: {result.skipped}</li>
          </ul>
        </div>
      )}
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <p><strong>Note:</strong> This will update all users who currently have placeholder data like:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Emails ending with @example.com</li>
          <li>Names like "User", "User-XXXX", "user_XXXX"</li>
          <li>Names like "Project Creator", "Project Member"</li>
        </ul>
      </div>
    </div>
  );
}