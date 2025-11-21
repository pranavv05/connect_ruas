"use client"

import Link from "next/link"
import { FileText, Clock, Shield } from "lucide-react"

export default function TermsPage() {
  const lastUpdated = "October 15, 2023"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Terms of Service</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>Legal Agreement</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-card max-w-none">
          <p className="text-muted-foreground mb-6">
            These Terms of Service ("Terms") govern your access to and use of the Baby Collab website and services 
            (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound 
            by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Eligibility</h2>
          <p className="text-muted-foreground mb-4">
            You must be at least 13 years old to use our Service. By using the Service, you represent and warrant 
            that you meet this eligibility requirement and have the right, authority, and capacity to enter into these Terms.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Account Registration</h2>
          <p className="text-muted-foreground mb-4">
            To access certain features of the Service, you may be required to create an account. You agree to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information as needed</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. User Content</h2>
          <p className="text-muted-foreground mb-4">
            You are responsible for the content you post, upload, or otherwise make available through the Service ("User Content"). 
            You retain all rights in your User Content, but you grant us a license to use, display, and distribute your content 
            as necessary to operate the Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Prohibited Activities</h2>
          <p className="text-muted-foreground mb-4">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Violate any laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Post harmful, offensive, or inappropriate content</li>
            <li>Engage in fraudulent or deceptive practices</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Attempt to gain unauthorized access to the Service</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            The Service and its original content, features, and functionality are owned by Baby Collab and are protected 
            by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Termination</h2>
          <p className="text-muted-foreground mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, 
            for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground mb-4">
            The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            To the maximum extent permitted by law, Baby Collab shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages arising out of or related to your use of the Service.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Governing Law</h2>
          <p className="text-muted-foreground mb-4">
            These Terms shall be governed by and construed in accordance with the laws of California, without regard 
            to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting 
            the new Terms on this page and updating the "Last Updated" date.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">12. Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-foreground font-medium">legal@babycollab.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}