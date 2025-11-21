"use client";

import { Users, Calendar, MessageSquare, Award, Clock, Search, Filter, UserPlus, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("my-mentors");
  const [searchQuery, setSearchQuery] = useState("");
  const [mentors, setMentors] = useState<any[]>([]);
  const [mentees, setMentees] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeMentors: 0,
    upcomingSessions: 0,
    totalHours: 0,
    skillsGained: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch mentorship data
  useEffect(() => {
    const fetchMentorshipData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsRes = await fetch("/api/mentorship/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        // Fetch mentors and mentees
        const mentorsRes = await fetch("/api/mentorship/mentors");
        if (mentorsRes.ok) {
          const mentorsData = await mentorsRes.json();
          setMentors(mentorsData.mentors);
          setMentees(mentorsData.mentees);
        }
        
        // Fetch sessions from API
        const sessionsRes = await fetch("/api/mentorship/sessions");
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          // Transform session data to match frontend expectations
          const transformedSessions = sessionsData.map((session: any) => ({
            id: session.id,
            mentorId: session.mentorship.mentor.id,
            mentorName: session.mentorship.mentor.fullName,
            date: new Date(session.scheduledAt).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            topic: session.topic,
            duration: `${session.duration} min`,
          }));
          setUpcomingSessions(transformedSessions);
        } else {
          // Fallback to mock data if API fails
          const mockSessions = [
            {
              id: "1",
              mentorId: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
              mentorName: "Alice Johnson",
              date: "Tomorrow, 3:00 PM",
              topic: "React Performance Optimization",
              duration: "60 min",
            },
            {
              id: "2",
              mentorId: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
              mentorName: "Bob Smith",
              date: "Nov 25, 10:00 AM",
              topic: "Product Roadmap Planning",
              duration: "45 min",
            },
          ];
          setUpcomingSessions(mockSessions);
        }
      } catch (error) {
        console.error("Failed to fetch mentorship data:", error);
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
      <div className="min-h-screen bg-background lg:ml-64">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-secondary rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-secondary rounded animate-pulse"></div>
          </div>
          
          <div className="mb-8">
            <div className="inline-flex bg-card border border-border rounded-lg p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-24 bg-secondary rounded animate-pulse mx-1"></div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 w-32 bg-secondary rounded mb-2"></div>
                <div className="h-8 w-12 bg-secondary rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-secondary rounded mb-2"></div>
                    <div className="h-3 w-24 bg-secondary rounded mb-1"></div>
                    <div className="h-3 w-20 bg-secondary rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-24 bg-secondary rounded mb-4"></div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="h-3 w-32 bg-secondary rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Mentorship</h1>
            <p className="text-lg text-muted-foreground">
              Connect with industry experts and accelerate your career growth
            </p>
          </div>
          <Link
            href="/mentorship/find"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Find a Mentor</span>
            <span className="sm:hidden">Find</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => setActiveTab("my-mentors")}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "my-mentors"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Mentors
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "sessions"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "discover"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Active Mentors</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.activeMentors}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Upcoming Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.upcomingSessions}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Hours</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalHours}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground">Skills Gained</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.skillsGained}</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "my-mentors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.role}</p>
                    <p className="text-xs text-primary">{mentor.company}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{mentor.rating}</span>
                    <span className="text-xs text-muted-foreground">({mentor.sessions} sessions)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 3).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">{mentor.availability}</span>
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/profile/${mentor.id}`}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleChatClick(mentor.id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-2">Upcoming Sessions</h2>
              <p className="text-muted-foreground">Schedule and manage your mentoring sessions</p>
            </div>
            
            <div className="divide-y divide-border">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{session.mentorName}</h3>
                    <p className="text-sm text-muted-foreground">{session.topic}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{session.date}</p>
                      <p className="text-muted-foreground">{session.duration}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link 
                        href={`/profile/${session.mentorId}`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                      >
                        <User className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleChatClick(session.mentorId)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-border text-center">
              <Link href="/mentorship/schedule" className="text-primary hover:text-primary/80 font-medium text-sm">
                Schedule a new session
              </Link>
            </div>
          </div>
        )}

        {activeTab === "discover" && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search mentors by name, expertise, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-primary" />
                <div className="flex flex-wrap gap-2">
                  {["Frontend", "Backend", "Product", "Data Science", "Design"].map((filter) => (
                    <button
                      key={filter}
                      className="text-xs px-3 py-1.5 rounded border bg-secondary border-border text-foreground hover:border-primary/50 transition-colors"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Suggested Mentors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    CB
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Charlie Brown</h3>
                    <p className="text-sm text-muted-foreground">Data Scientist</p>
                    <p className="text-xs text-primary">DataTech</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">4.9</span>
                    <span className="text-xs text-muted-foreground">(32 sessions)</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Machine Learning", "Python", "Statistics", "Data Visualization"].map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
                    Request Mentorship
                  </button>
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/profile/6d0fd9ff-52e6-4787-8347-db1c26ad3ff3`}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleChatClick("6d0fd9ff-52e6-4787-8347-db1c26ad3ff3")}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    MJ
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Michael Johnson</h3>
                    <p className="text-sm text-muted-foreground">Backend Engineer</p>
                    <p className="text-xs text-primary">CloudSystems</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">4.8</span>
                    <span className="text-xs text-muted-foreground">(28 sessions)</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "Databases", "Cloud", "API Design"].map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
                    Request Mentorship
                  </button>
                  <div className="flex items-center gap-1">
                    <Link 
                      href={`/profile/0341de5a-db1c-4275-a9e4-ccfd8cba80bf`}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleChatClick("0341de5a-db1c-4275-a9e4-ccfd8cba80bf")}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}