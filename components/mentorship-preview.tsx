"use client";

import { Users, Calendar, MessageSquare, Award, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function MentorshipPreview() {
  const [mentorshipData, setMentorshipData] = useState({
    activeMentorships: 0,
    upcomingSessions: 0,
    totalHours: 0,
    mentors: [] as { id: string; name: string; role: string; company: string; avatar: string }[]
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch real mentorship data
    const fetchMentorshipData = async () => {
      try {
        const res = await fetch("/api/mentorship/stats");
        if (res.ok) {
          const stats = await res.json();
          
          // Fetch mentors data
          const mentorsRes = await fetch("/api/mentorship/mentors");
          let mentors = [];
          if (mentorsRes.ok) {
            const mentorsData = await mentorsRes.json();
            mentors = mentorsData.mentors.slice(0, 2); // Show only first 2 mentors
          } else {
            // Try to fetch mentors with a simpler query as fallback
            const mentorsRes = await fetch("/api/mentorship/search");
            if (mentorsRes.ok) {
              const mentorsData = await mentorsRes.json();
              mentors = mentorsData.slice(0, 2); // Show only first 2 mentors
            } else {
              // Fallback to mock data
              mentors = [
                {
                  id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
                  name: "Alice Johnson",
                  role: "Senior Developer",
                  company: "TechCorp",
                  avatar: "AJ",
                },
                {
                  id: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
                  name: "Bob Smith",
                  role: "Product Manager",
                  company: "InnovateX",
                  avatar: "BS",
                },
              ];
            }
          }
          
          setMentorshipData({
            activeMentorships: stats.activeMentors,
            upcomingSessions: stats.upcomingSessions,
            totalHours: stats.totalHours,
            mentors: mentors
          });
        } else {
          // Fallback to mock data if API fails
          setMentorshipData({
            activeMentorships: 2,
            upcomingSessions: 3,
            totalHours: 12,
            mentors: [
              {
                id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
                name: "Alice Johnson",
                role: "Senior Developer",
                company: "TechCorp",
                avatar: "AJ",
              },
              {
                id: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
                name: "Bob Smith",
                role: "Product Manager",
                company: "InnovateX",
                avatar: "BS",
              },
            ]
          });
        }
      } catch (error) {
        console.error("Failed to fetch mentorship data:", error);
        // Fallback to mock data if API fails
        setMentorshipData({
          activeMentorships: 2,
          upcomingSessions: 3,
          totalHours: 12,
          mentors: [
            {
              id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
              name: "Alice Johnson",
              role: "Senior Developer",
              company: "TechCorp",
              avatar: "AJ",
            },
            {
              id: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
              name: "Bob Smith",
              role: "Product Manager",
              company: "InnovateX",
              avatar: "BS",
            },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMentorshipData();
  }, []);

  const handleChatClick = (mentorId: string) => {
    // Navigate to the chat page with the mentor ID
    router.push(`/chat?user=${mentorId}`);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Mentorship</h2>
          <div className="h-4 w-16 bg-secondary rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="h-5 w-5 bg-secondary rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-3 w-12 bg-secondary rounded mx-auto mb-1 animate-pulse"></div>
              <div className="h-6 w-8 bg-secondary rounded mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-secondary rounded animate-pulse"></div>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-20 bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-3 w-16 bg-secondary rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Mentorship</h2>
        <Link 
          href="/mentorship" 
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-lg font-bold text-foreground">{mentorshipData.activeMentorships}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Sessions</p>
          <p className="text-lg font-bold text-foreground">{mentorshipData.upcomingSessions}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Hours</p>
          <p className="text-lg font-bold text-foreground">{mentorshipData.totalHours}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Your Mentors</h3>
        {mentorshipData.mentors.map((mentor) => (
          <div key={mentor.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              {mentor.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{mentor.name}</p>
              <p className="text-xs text-muted-foreground truncate">{mentor.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <Link 
                href={`/profile/${mentor.id}`}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </Link>
              <button 
                onClick={() => handleChatClick(mentor.id)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Link 
          href="/mentorship/find" 
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Users className="w-4 h-4" />
          Find a Mentor
        </Link>
      </div>
    </div>
  );
}