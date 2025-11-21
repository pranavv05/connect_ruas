"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react"

export default function StatusPage() {
  const [status, setStatus] = useState({
    gemini: 'loading',
    database: 'loading',
    api: 'loading'
  });
  
  const [details, setDetails] = useState({
    gemini: '',
    database: '',
    api: ''
  });

  useEffect(() => {
    const checkStatus = async () => {
      // Check Gemini API
      try {
        const geminiResponse = await fetch('/api/health');
        if (geminiResponse.ok) {
          setStatus(prev => ({ ...prev, gemini: 'operational' }));
          setDetails(prev => ({ ...prev, gemini: 'Gemini API is responding' }));
        } else {
          setStatus(prev => ({ ...prev, gemini: 'down' }));
          setDetails(prev => ({ ...prev, gemini: `Gemini API error: ${geminiResponse.status}` }));
        }
      } catch (error: any) {
        setStatus(prev => ({ ...prev, gemini: 'down' }));
        setDetails(prev => ({ ...prev, gemini: `Gemini API error: ${error.message || 'Unknown error'}` }));
      }

      // Check Database
      try {
        const dbResponse = await fetch('/api/dashboard/stats');
        if (dbResponse.ok) {
          setStatus(prev => ({ ...prev, database: 'operational' }));
          setDetails(prev => ({ ...prev, database: 'Database is responding' }));
        } else {
          setStatus(prev => ({ ...prev, database: 'down' }));
          setDetails(prev => ({ ...prev, database: `Database error: ${dbResponse.status}` }));
        }
      } catch (error: any) {
        setStatus(prev => ({ ...prev, database: 'down' }));
        setDetails(prev => ({ ...prev, database: `Database error: ${error.message || 'Unknown error'}` }));
      }

      // Check API
      try {
        const apiResponse = await fetch('/api/health');
        if (apiResponse.ok) {
          setStatus(prev => ({ ...prev, api: 'operational' }));
          setDetails(prev => ({ ...prev, api: 'API routes are responding' }));
        } else {
          setStatus(prev => ({ ...prev, api: 'down' }));
          setDetails(prev => ({ ...prev, api: `API error: ${apiResponse.status}` }));
        }
      } catch (error: any) {
        setStatus(prev => ({ ...prev, api: 'down' }));
        setDetails(prev => ({ ...prev, api: `API error: ${error.message || 'Unknown error'}` }));
      }
    };

    checkStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'down':
        return 'Down';
      case 'loading':
        return 'Checking...';
      default:
        return 'Degraded';
    }
  };

  return (
    <div className="min-h-screen bg-background ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Status</h1>
        <p className="text-muted-foreground mb-8">Current status of BabyCollab services</p>
        
        <div className="grid gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Service Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.gemini)}
                  <span className="font-medium text-foreground">Gemini AI Service</span>
                </div>
                <span className="text-sm font-medium">{getStatusText(status.gemini)}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.database)}
                  <span className="font-medium text-foreground">Database</span>
                </div>
                <span className="text-sm font-medium">{getStatusText(status.database)}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.api)}
                  <span className="font-medium text-foreground">API Routes</span>
                </div>
                <span className="text-sm font-medium">{getStatusText(status.api)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-1">Gemini AI Service</h3>
                <p className="text-sm text-muted-foreground">{details.gemini || 'Checking status...'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-1">Database</h3>
                <p className="text-sm text-muted-foreground">{details.database || 'Checking status...'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-1">API Routes</h3>
                <p className="text-sm text-muted-foreground">{details.api || 'Checking status...'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Troubleshooting</h2>
            <p className="text-blue-800 mb-4">
              If you're experiencing issues with resume analysis, here are some things to try:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Wait a few minutes and try again (service may be temporarily overloaded)</li>
              <li>Ensure your resume file is under 5MB and in PDF, DOC, or DOCX format</li>
              <li>Check that you have a stable internet connection</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}