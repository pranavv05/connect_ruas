"use client";

import { Users, Search, Filter, Award, MessageSquare, UserPlus, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FindMentorPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch potential mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        
        // Fetch mentors from API
        const res = await fetch(`/api/mentorship/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setMentors(data);
        } else {
          // Fallback to mock data if API fails
          const mockMentors = [
            {
              id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
              name: "Alice Johnson",
              role: "Senior Frontend Developer",
              company: "TechCorp",
              avatar: "AJ",
              expertise: ["React", "JavaScript", "UI/UX", "Performance"],
              rating: 4.9,
              sessions: 24,
              about: "Passionate about helping developers build scalable and performant web applications. 8+ years of experience in the industry.",
            },
            {
              id: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
              name: "Bob Smith",
              role: "Product Manager",
              company: "InnovateX",
              avatar: "BS",
              expertise: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
              rating: 4.8,
              sessions: 18,
              about: "Experienced product leader focused on building products that solve real user problems. Former startup founder.",
            },
            {
              id: "6d0fd9ff-52e6-4787-8347-db1c26ad3ff3",
              name: "Charlie Brown",
              role: "Data Scientist",
              company: "DataTech",
              avatar: "CB",
              expertise: ["Machine Learning", "Python", "Statistics", "Data Visualization"],
              rating: 4.9,
              sessions: 32,
              about: "Data science expert with a focus on practical applications. Helped companies derive insights from complex datasets.",
            },
          ];
          setMentors(mockMentors);
        }
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
        // Fallback to mock data if API fails
        const mockMentors = [
          {
            id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf",
            name: "Alice Johnson",
            role: "Senior Frontend Developer",
            company: "TechCorp",
            avatar: "AJ",
            expertise: ["React", "JavaScript", "UI/UX", "Performance"],
            rating: 4.9,
            sessions: 24,
            about: "Passionate about helping developers build scalable and performant web applications. 8+ years of experience in the industry.",
          },
          {
            id: "8e6a2689-f73b-4809-9c88-8f1554903e0f",
            name: "Bob Smith",
            role: "Product Manager",
            company: "InnovateX",
            avatar: "BS",
            expertise: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
            rating: 4.8,
            sessions: 18,
            about: "Experienced product leader focused on building products that solve real user problems. Former startup founder.",
          },
          {
            id: "6d0fd9ff-52e6-4787-8347-db1c26ad3ff3",
            name: "Charlie Brown",
            role: "Data Scientist",
            company: "DataTech",
            avatar: "CB",
            expertise: ["Machine Learning", "Python", "Statistics", "Data Visualization"],
            rating: 4.9,
            sessions: 32,
            about: "Data science expert with a focus on practical applications. Helped companies derive insights from complex datasets.",
          },
        ];
        setMentors(mockMentors);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [searchQuery]);

  const handleChatClick = (mentorId: string) => {
    // Navigate to the chat page with the mentor ID
    router.push(`/chat?user=${mentorId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background lg:ml-64">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-secondary rounded animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-secondary rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="mb-8 space-y-6">
            <div className="relative max-w-2xl">
              <div className="h-10 w-full bg-secondary rounded-lg animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 bg-secondary rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-6 w-20 bg-secondary rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-48 bg-secondary rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-secondary rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-secondary animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 w-32 bg-secondary rounded mb-2"></div>
                    <div className="h-4 w-40 bg-secondary rounded mb-1"></div>
                    <div className="h-3 w-24 bg-secondary rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-full bg-secondary rounded mb-4"></div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="h-4 w-32 bg-secondary rounded"></div>
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
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/mentorship" 
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Find a Mentor</h1>
            <p className="text-lg text-muted-foreground">
              Connect with industry experts who can guide your career journey
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search mentors by name, expertise, or company..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Frontend", "Backend", "Product", "Data Science", "Design", "Career Growth"].map((filter) => (
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

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recommended Mentors</h2>
          <p className="text-sm text-muted-foreground">Showing {mentors.length} mentors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg">
                  {mentor.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <p className="text-xs text-primary">{mentor.company}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{mentor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{mentor.about}</p>

              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill: string, index: number) => (
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
                <span className="text-sm text-muted-foreground">{mentor.sessions} sessions completed</span>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/profile/${mentor.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleChatClick(mentor.id)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-12 bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">How Mentorship Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Find Your Match</h3>
              <p className="text-muted-foreground">
                Browse our curated list of industry experts and find a mentor that aligns with your goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Connect & Request</h3>
              <p className="text-muted-foreground">
                Send a connection request with a personalized message explaining your goals and expectations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Start Learning</h3>
              <p className="text-muted-foreground">
                Once accepted, schedule sessions and start your mentorship journey to accelerate your career.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}