"use client"

import Link from "next/link"
import { Shield, Clock, FileText } from "lucide-react"

export default function PrivacyPage() {
  const lastUpdated = "October 15, 2023"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Legal Document</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-card max-w-none">
          <p className="text-muted-foreground mb-6">
            This Privacy Policy describes how ConnectRUAS ("we", "our", or "us") collects, uses, and shares your personal information 
            when you use our website and services (collectively, the "Service").
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Information You Provide</h3>
          <p className="text-muted-foreground mb-4">
            We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. 
            This may include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Name and contact information</li>
            <li>Email address and password</li>
            <li>Professional background and career goals</li>
            <li>Skills and interests</li>
            <li>Profile information and preferences</li>
            <li>Content you create or share on our platform</li>
          </ul>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Information We Collect Automatically</h3>
          <p className="text-muted-foreground mb-4">
            When you access or use our Service, we automatically collect information about you, including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Log information (IP address, browser type, pages viewed, etc.)</li>
            <li>Device information (device type, operating system, unique device identifiers)</li>
            <li>Usage data (features used, time spent, interactions with content)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Provide, maintain, and improve our Service</li>
            <li>Personalize your experience and recommend relevant content</li>
            <li>Communicate with you about your account and our Service</li>
            <li>Process transactions and send related information</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, prevent, and address technical issues or security concerns</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Information Sharing</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell, trade, or otherwise transfer your personal information to outside parties except as described below:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li><strong>With your consent:</strong> We may share information when you give us permission</li>
            <li><strong>Service providers:</strong> We may share information with trusted third parties who assist us in operating our Service</li>
            <li><strong>Legal requirements:</strong> We may disclose information to comply with legal obligations or protect our rights</li>
            <li><strong>Business transfers:</strong> We may transfer information in connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational measures to protect your personal information. 
            However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>The right to access, update, or delete your personal information</li>
            <li>The right to object to or restrict processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-foreground font-medium">privacy@connectruas.com</p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last Updated" date.
          </p>
        </div>
      </div>
    </div>
  )
}