"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Check, X } from "lucide-react";

interface JoinRequest {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  createdAt: string;
}

export function JoinRequestsPreview() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        setLoading(true);
        
        // Fetch real join requests from the API
        const res = await fetch('/api/join-requests', {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch join requests');
        }
        
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching join requests:', err);
        setError("Failed to fetch join requests");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, []);

  const handleRequestAction = async (requestId: string, action: "accept" | "reject") => {
    try {
      // In a real implementation, you would call the API endpoint
      // Find the request to get the project ID
      const request = requests.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      
      // Call the API to accept or reject the join request
      const res = await fetch(`/api/projects/${request.projectId}/join-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${action} join request`);
      }
      
      // Remove the request from the list
      setRequests(requests.filter(request => request.id !== requestId));
      
      // Show a success message
      alert(`Join request ${action}ed successfully`);
    } catch (err) {
      console.error(`Failed to ${action} join request:`, err);
      alert(`Failed to ${action} join request: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-5">Pending Join Requests</h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded"></div>
                </div>
              </div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-5">Pending Join Requests</h3>
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Pending Join Requests</h3>
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pending join requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-medium">
                    {request.userAvatar}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{request.userName}</h4>
                    <p className="text-xs text-muted-foreground">For project: {request.projectName}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestAction(request.id, "accept")}
                    className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success hover:bg-success/20 transition-colors"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, "reject")}
                    className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {request.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}