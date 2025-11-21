"use client"

import Link from "next/link"
import { Search, BookOpen, MessageCircle, Users, Mail, FileText, Zap, ArrowRight } from "lucide-react"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Getting Started",
      description: "Learn the basics of Baby Collab and how to set up your account.",
      articles: 12
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Career Roadmaps",
      description: "Everything you need to know about creating and managing roadmaps.",
      articles: 8
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Project Collaboration",
      description: "How to join, create, and manage projects with your peers.",
      articles: 15
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Builder",
      description: "Tips and tricks for creating the perfect resume with our tools.",
      articles: 10
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Community & Networking",
      description: "How to connect with other users and build your professional network.",
      articles: 7
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Account & Billing",
      description: "Manage your account settings, subscription, and payment information.",
      articles: 9
    }
  ]

  const faqs = [
    {
      question: "How do I create my first career roadmap?",
      answer: "After signing up, go to the Roadmaps section in your dashboard and click 'Create New Roadmap'. Follow the step-by-step guide to set up your personalized career path."
    },
    {
      question: "Can I collaborate on projects with users in different time zones?",
      answer: "Yes! Our platform is designed for global collaboration. You can communicate asynchronously through our messaging system and coordinate meetings using our scheduling tool."
    },
    {
      question: "How does the AI-powered resume builder work?",
      answer: "Our AI analyzes your profile information and suggests improvements to your resume content, structure, and keyword optimization to help you pass applicant tracking systems."
    },
    {
      question: "What file formats can I upload for my portfolio?",
      answer: "You can upload images (JPEG, PNG), documents (PDF, DOCX), and code files (ZIP). Video files can be linked from external platforms like YouTube or Vimeo."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Help Center</span>
        </nav>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-6">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions and learn how to get the most out of Baby Collab.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {helpCategories.map((category, index) => (
          <Link 
            key={index} 
            href="#" 
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {category.icon}
              </div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h2>
            </div>
            <p className="text-muted-foreground mb-3">{category.description}</p>
            <div className="flex items-center text-sm text-primary font-medium">
              <span>{category.articles} articles</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-bold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Community Support</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Connect with other Baby Collab users in our community forums. Get help from experienced members 
            and share your knowledge with newcomers.
          </p>
          <Link 
            href="https://www.linkedin.com/company/babyycollabb/?viewAsMember=true" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Visit Community
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Contact Support</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help you with any questions 
            or issues you might have.
          </p>
          <a 
            href="mailto:contactbabycollab@gmail.com" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}