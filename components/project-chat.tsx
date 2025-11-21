"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  type: "text" | "file";
  fileName?: string;
  fileSize?: string;
}

export function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // Fetch real messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/messages`, { 
          credentials: 'include' 
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await res.json();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    // Prevent default form submission behavior
    if (e && 'preventDefault' in e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && 'stopPropagation' in e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (newMessage.trim() && !isSending) {
      setIsSending(true);
      
      // Optimistic update - add message to UI immediately
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        userId: 'current-user',
        userName: 'You',
        userAvatar: 'YOU',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      const messageToSend = newMessage.trim();
      setNewMessage("");
      
      try {
        const res = await fetch(`/api/projects/${projectId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            message: messageToSend,
            type: 'text'
          })
        });
        
        if (!res.ok) {
          // Remove optimistic message on error
          setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
          throw new Error('Failed to send message');
        }
        
        const message = await res.json();
        // Replace optimistic message with actual message from server
        setMessages(prev => [
          ...prev.filter(msg => msg.id !== optimisticMessage.id),
          message
        ]);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setNewMessage(messageToSend); // Restore message to input
        alert("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19 7-7 3 3-7 7-3-3z" />
              <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="m2 2 7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
              <path d="m13 13 6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Team Chat</h3>
        </div>
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-muted rounded-lg h-10"></div>
          <div className="w-10 h-10 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
            <path d="m13 13 6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Team Chat</h3>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium flex-shrink-0">
              {msg.userAvatar && typeof msg.userAvatar === 'string' && msg.userAvatar.startsWith('data:image') ? (
                <img 
                  src={msg.userAvatar} 
                  alt={msg.userName} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                msg.userAvatar
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{msg.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {msg.type === "text" ? (
                <p className="text-sm text-muted-foreground">{msg.message}</p>
              ) : (
                <div className="bg-secondary border border-border rounded-lg p-3 inline-block">
                  <p className="text-sm text-foreground font-medium">📎 {msg.fileName}</p>
                  <p className="text-xs text-muted-foreground">{msg.fileSize}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Changed from form to div to prevent page refresh */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
              sendMessage(e);
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSending}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            sendMessage(e);
          }}
          disabled={!newMessage.trim() || isSending}
          className={`px-4 py-2 rounded-lg transition-colors ${newMessage.trim() && !isSending ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}