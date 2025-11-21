"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import {
  ArrowRight,
  Users,
  Map,
  FileText,
  Zap,
  CheckCircle,
  Github,
  MessageCircle,
  File,
  Rocket,
  TrendingUp,
  Award,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: <Map className="w-8 h-8 text-primary" />,
      title: "AI-Guided Career Roadmaps",
      description:
        "Visual, structured pathways tailored to your goals — built with AI and aligned with your academic and professional journey.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Collaboration Hub",
      description:
        "Find peers, form teams, and work on real projects from RUAS students, alumni, and internal clubs.",
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Smart Resume Builder",
      description:
        "Generate polished, industry-ready resumes with AI-powered suggestions and formatting.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Skill Tracking & Profiles",
      description:
        "Showcase your skills, track growth, and build a profile that recruiters and alumni can trust.",
    },
  ]

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, url: "https://x.com" },
    { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com" },
    { icon: <Instagram className="w-5 h-5" />, url: "https://instagram.com" },
  ]

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Connect. Collaborate. Grow with
              <br />
              <span className="text-primary">ConnectRUAS</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10">
              The official networking and collaboration platform for RUAS students and alumni —
              built to help you discover mentors, join collaborations, and accelerate your career
              journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Go to Dashboard
                    <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Join ConnectRUAS
                      <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                  </Link>

                  <Link href="/sign-in">
                    <button className="px-8 py-4 text-lg font-medium bg-card text-foreground border border-border rounded-lg hover:bg-accent transition-all">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Free for all RUAS students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Verified RUAS community</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Secure & private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for the RUAS Community</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ConnectRUAS brings together students, alumni, mentors, and professionals in one
              modern ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How ConnectRUAS Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start building meaningful academic and professional connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8 text-primary" />,
                step: "01",
                title: "Create Your Profile",
                description:
                  "Add your skills, department, interests, and goals so mentors and collaborators can find you.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                step: "02",
                title: "Explore Roadmaps",
                description:
                  "Discover AI-curated learning paths tailored for engineering, design, research, and more.",
              },
              {
                icon: <Rocket className="w-8 h-8 text-primary" />,
                step: "03",
                title: "Join Collaborations",
                description:
                  "Work with peers, alumni, and mentors on real-world projects in your domain.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center bg-card border border-border rounded-xl p-8"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Connecting?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Build your network. Join collaborations. Learn from mentors. All in one RUAS-powered
            platform.
          </p>

          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Go to Dashboard
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <button className="px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Join ConnectRUAS
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">CR</span>
                </div>
                <span className="text-2xl font-bold text-foreground">ConnectRUAS</span>
              </Link>

              <p className="text-muted-foreground mb-6 max-w-xs">
                Connecting RUAS students, alumni, and mentors to build stronger academic and
                professional futures.
              </p>

              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                    target="_blank"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/roadmaps" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Career Roadmaps
                  </Link>
                </li>

                <li>
                  <Link href="/docs/collaborations" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Collaborations
                  </Link>
                </li>

                <li>
                  <Link href="/docs/resume-builder" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Resume Builder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6 pb-2 border-b border-border">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Documentation
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} ConnectRUAS. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-6 mt-4 md:mt-0 justify-center">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy Policy
              </Link>

              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms of Service
              </Link>

              <Link href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
