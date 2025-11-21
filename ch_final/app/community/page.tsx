"use client"

import Link from "next/link"
import { Users, MessageCircle, Trophy, Calendar, Search, ArrowRight, Hash, UserPlus, FileText } from "lucide-react"

export default function CommunityPage() {
  const communityStats = [
    {
      value: "10,000+",
      label: "Active Members"
    },
    {
      value: "500+",
      label: "Projects Created"
    },
    {
      value: "50+",
      label: "Discussion Topics"
    },
    {
      value: "24/7",
      label: "Community Support"
    }
  ]

  const popularTopics = [
    {
      title: "Career Advice",
      posts: "1,240",
      icon: <Hash className="w-4 h-4" />
    },
    {
      title: "Project Collaboration",
      posts: "890",
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Skill Development",
      posts: "756",
      icon: <Trophy className="w-4 h-4" />
    },
    {
      title: "Job Opportunities",
      posts: "632",
      icon: <Calendar className="w-4 h-4" />
    },
    {
      title: "Resume Review",
      posts: "421",
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: "Interview Prep",
      posts: "387",
      icon: <MessageCircle className="w-4 h-4" />
    }
  ]

  const recentDiscussions = [
    {
      title: "Best resources for learning React in 2023?",
      author: "Alex Johnson",
      replies: 24,
      likes: 42,
      time: "2 hours ago"
    },
    {
      title: "How to transition from QA to Software Development?",
      author: "Sarah Chen",
      replies: 18,
      likes: 35,
      time: "5 hours ago"
    },
    {
      title: "Remote work opportunities for junior developers",
      author: "Michael Rodriguez",
      replies: 31,
      likes: 56,
      time: "1 day ago"
    },
    {
      title: "Portfolio review - Frontend Developer",
      author: "Emma Wilson",
      replies: 15,
      likes: 28,
      time: "1 day ago"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Community</span>
        </nav>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with peers, share knowledge, and grow together in our vibrant community.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {communityStats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Discussions</h2>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {recentDiscussions.map((discussion, index) => (
                <div key={index} className="bg-muted rounded-lg p-4 hover:bg-primary/5 transition-colors">
                  <h3 className="font-bold text-foreground mb-2">{discussion.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>By {discussion.author}</span>
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.likes} likes</span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                View All Discussions
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Start a Discussion</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-foreground mb-2">Topic Title</label>
                <input
                  type="text"
                  id="topic"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="What would you like to discuss?"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">Content</label>
                <textarea
                  id="content"
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="notify" className="rounded border-border text-primary focus:ring-primary" />
                  <label htmlFor="notify" className="text-sm text-foreground">Notify me of replies</label>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Popular Topics</h2>
              <Link href="#" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-3">
              {popularTopics.map((topic, index) => (
                <Link 
                  key={index} 
                  href="#"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-primary group-hover:text-primary/80 transition-colors">
                      {topic.icon}
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-4">
              Connect with thousands of students and professionals who are shaping their careers together.
            </p>
            <Link 
              href="/sign-up" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full justify-center"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}