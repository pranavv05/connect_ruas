"use client"

import Link from "next/link"
import { Cookie, Clock, Shield } from "lucide-react"

export default function CookiesPage() {
  const lastUpdated = "October 15, 2023"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Cookie Policy</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Privacy Policy</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-card max-w-none">
          <p className="text-muted-foreground mb-6">
            This Cookie Policy explains how ConnectRUAS ("we", "our", or "us") uses cookies and similar technologies 
            to recognize you when you visit our website and services (collectively, the "Service").
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Do We Use Cookies?</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies for several reasons:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>To ensure the Service functions properly</li>
            <li>To understand how you interact with our Service</li>
            <li>To improve your browsing experience</li>
            <li>To remember your preferences and settings</li>
            <li>To show you personalized content and advertisements</li>
            <li>To analyze Service usage and performance</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Essential Cookies</h3>
          <p className="text-muted-foreground mb-4">
            These cookies are strictly necessary for the Service to function and cannot be switched off. 
            They are usually set in response to actions made by you, such as setting your privacy preferences, 
            logging in, or filling in forms.
          </p>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Performance Cookies</h3>
          <p className="text-muted-foreground mb-4">
            These cookies help us understand how visitors interact with our Service by collecting and reporting 
            information anonymously. This helps us improve how the Service works.
          </p>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Functional Cookies</h3>
          <p className="text-muted-foreground mb-4">
            These cookies enable the Service to provide enhanced functionality and personalization. 
            They may be set by us or by third-party providers whose services we have added to our pages.
          </p>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Targeting Cookies</h3>
          <p className="text-muted-foreground mb-4">
            These cookies may be set through our Service by our advertising partners. 
            They may be used by those companies to build a profile of your interests and show you relevant advertisements.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Third-Party Cookies</h2>
          <p className="text-muted-foreground mb-4">
            We may also use third-party cookies for:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Analytics (Google Analytics)</li>
            <li>Advertising (Google Ads, Facebook Ads)</li>
            <li>Social media integration (Twitter, LinkedIn, Facebook)</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Your Cookie Choices</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to decide whether to accept or reject cookies. You can:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Set your browser to block or alert you about cookies</li>
            <li>Delete cookies manually at any time</li>
            <li>Use our cookie consent manager to customize your preferences</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            If you choose to reject cookies, some parts of the Service may not work properly.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Changes to This Policy</h2>
          <p className="text-muted-foreground mb-4">
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Cookie Policy, please contact us at:
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-foreground font-medium">privacy@connectruas.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}