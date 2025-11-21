"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Send, User, Search, MoreVertical } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isCurrentUser: boolean;
};

export default function ChatPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if there's a user ID in the query params to open a conversation with
  const userIdToOpen = searchParams.get("user");

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          
          // If there's a user ID to open, find or create a conversation with that user
          if (userIdToOpen) {
            const conversation = data.find((conv: Conversation) => 
              conv.id === userIdToOpen || conv.name.includes(userIdToOpen)
            );
            if (conversation) {
              setActiveConversation(conversation);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userIdToOpen]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      // In a real implementation, we would fetch messages for the active conversation
      // For now, we'll use mock data
      setMessages([
        {
          id: "1",
          content: "Hi there! How can I help you today?",
          senderId: activeConversation.id,
          timestamp: "10:30 AM",
          isCurrentUser: false,
        },
        {
          id: "2",
          content: "I was wondering if you could review my project proposal?",
          senderId: "current",
          timestamp: "10:32 AM",
          isCurrentUser: true,
        },
        {
          id: "3",
          content: "Of course! Please share the document and I'll take a look.",
          senderId: activeConversation.id,
          timestamp: "10:33 AM",
          isCurrentUser: false,
        },
      ]);
    }
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage,
        }),
      });
      
      if (res.ok) {
        const savedMessage = await res.json();
        const message: Message = {
          id: savedMessage.id,
          content: newMessage,
          senderId: "current",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: true,
        };
        
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Fallback to local state update if API fails
      const message: Message = {
        id: (messages.length + 1).toString(),
        content: newMessage,
        senderId: "current",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background lg:ml-64 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col h-[calc(100vh-120px)] bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold text-foreground mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-4 border-b border-border cursor-pointer hover:bg-accent ${
                        activeConversation?.id === conversation.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {conversation.avatar}
                        </div>
                        {conversation.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-medium">{conversation.unread}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground truncate">{conversation.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Start a conversation with your mentors or peers.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col hidden md:flex">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {activeConversation.avatar}
                      </div>
                      <div>
                        <h2 className="font-medium text-foreground">{activeConversation.name}</h2>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-end gap-2">
                      <div className="flex-1 bg-secondary border border-border rounded-lg">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-foreground placeholder:text-muted-foreground max-h-32"
                          rows={1}
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select a conversation from the sidebar to start chatting, or start a new conversation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}