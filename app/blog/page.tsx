"use client"

import Link from "next/link"
import { Calendar, User, Tag, ArrowRight, BookOpen } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      title: "How to Create an Effective Career Roadmap",
      excerpt: "Learn the key steps to building a career roadmap that actually helps you achieve your goals.",
      date: "May 15, 2023",
      author: "Alex Johnson",
      tags: ["Career Planning", "Productivity"],
      readTime: "5 min read"
    },
    {
      title: "The Power of Collaborative Learning in Professional Development",
      excerpt: "Discover why working with peers can accelerate your skill development and career growth.",
      date: "April 28, 2023",
      author: "Sarah Chen",
      tags: ["Collaboration", "Learning"],
      readTime: "7 min read"
    },
    {
      title: "Resume Optimization Tips for Tech Professionals",
      excerpt: "Expert advice on crafting a resume that stands out to recruiters and passes ATS systems.",
      date: "April 12, 2023",
      author: "Michael Rodriguez",
      tags: ["Resume", "Job Search"],
      readTime: "6 min read"
    },
    {
      title: "Building a Standout Portfolio as a Recent Graduate",
      excerpt: "Practical tips for creating a portfolio that showcases your skills and potential to employers.",
      date: "March 30, 2023",
      author: "Emma Wilson",
      tags: ["Portfolio", "Career Start"],
      readTime: "8 min read"
    }
  ]

  const categories = [
    "Career Planning",
    "Skill Development",
    "Job Search",
    "Collaboration",
    "Productivity",
    "Industry Insights"
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Blog</span>
        </nav>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">ConnectRUAS Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Insights, tips, and stories to help you accelerate your career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-foreground mb-3">{post.title}</h2>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href="#" 
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-primary text-primary-foreground font-medium">1</button>
              <button className="w-10 h-10 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-muted">2</button>
              <button className="w-10 h-10 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-muted">3</button>
              <button className="w-10 h-10 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-muted">Next</button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link href="#" className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors">
                    <span>{category}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">12</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Featured Post</h2>
            <article className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Editor's Pick</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">The Future of Remote Work in Tech</h3>
              <p className="text-sm text-muted-foreground mb-3">
                How remote work is reshaping the tech industry and what it means for your career.
              </p>
              <Link href="#" className="text-primary text-sm font-medium hover:underline">
                Read full story
              </Link>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}