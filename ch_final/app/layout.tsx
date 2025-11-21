import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { NavigationWrapper } from "@/components/navigation-wrapper"
import { ClerkProviderWrapper } from "@/components/clerk-provider"
import { V0Provider } from "@/lib/v0-context"
import { Toaster } from "sonner"
import { StructuredData } from "@/components/structured-data"
import { UserDataCapture } from "@/components/user-data-capture"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s – Baby Collab – Career Development Platform",
    default: "Baby Collab – Build Your Career – Career Development Platform for Students & Professionals",
  },
  description:
    "Baby Collab is the ultimate career development platform for college students and early professionals. Create AI-powered career roadmaps, collaborate on projects, build your portfolio, and accelerate your career growth. Join thousands of professionals already using Baby Collab.",
  keywords: [
    "Baby Collab",
    "career development",
    "career roadmap",
    "professional growth",
    "college students",
    "early professionals",
    "AI career planning",
    "project collaboration",
    "portfolio builder",
    "skill tracking",
    "resume builder",
    "career advancement",
    "professional networking"
  ],
  authors: [{ name: "Baby Collab Team" }],
  creator: "Baby Collab",
  publisher: "Baby Collab",
  generator: "Next.js",
  applicationName: "Baby Collab",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://babycollab.com"
  },
  openGraph: {
    title: "Baby Collab – Build Your Career",
    description: "The ultimate career development platform for college students and early professionals. Create AI-powered career roadmaps, collaborate on projects, and accelerate your career growth.",
    url: "https://babycollab.com",
    siteName: "Baby Collab",
    images: [
      {
        url: "https://babycollab.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Baby Collab - Career Development Platform"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Collab – Build Your Career",
    description: "The ultimate career development platform for college students and early professionals.",
    creator: "@babycollab",
    images: ["https://babycollab.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        <V0Provider isV0={true}>
          <ClerkProviderWrapper>
            <NavigationWrapper />
            <UserDataCapture />
            {children}
            <Toaster />
            <StructuredData />
          </ClerkProviderWrapper>
        </V0Provider>
      </body>
    </html>
  )
}