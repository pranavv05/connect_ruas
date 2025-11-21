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
    template: "%s – Connect RUAS – Student & Alumni Network",
    default: "Connect RUAS – Student & Alumni Networking Platform",
  },
  description:
    "Connect RUAS is the official networking platform for students, alumni, and faculty of Ramaiah University. Build connections, discover opportunities, collaborate on projects, and strengthen the RUAS community.",
  keywords: [
    "Connect RUAS",
    "RUAS",
    "Ramaiah University",
    "student alumni network",
    "college networking",
    "university collaboration",
    "campus community",
    "student opportunities",
    "alumni connect",
    "RUAS projects"
  ],
  authors: [{ name: "Connect RUAS Team" }],
  creator: "Connect RUAS",
  publisher: "Ramaiah University of Applied Sciences",
  applicationName: "Connect RUAS",
  alternates: {
    canonical: "https://connectruas.com",
  },
  openGraph: {
    title: "Connect RUAS – Student and Alumni Network",
    description:
      "A campus-first platform that helps students, alumni, and faculty collaborate, connect, and grow together.",
    url: "https://connectruas.com",
    siteName: "Connect RUAS",
    images: [
      {
        url: "https://connectruas.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Connect RUAS – University Networking Platform"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect RUAS – Student & Alumni Network",
    description:
      "Strengthening the RUAS community with meaningful connections and collaboration.",
    images: ["https://connectruas.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ---------------------------------------------------------
// ROOT LAYOUT
// With university-themed UI and subtle RUAS colors
// ---------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased font-sans bg-[#0B1A33] text-white`}
      >
        <V0Provider isV0={true}>
          <ClerkProviderWrapper>
            <NavigationWrapper />
            <UserDataCapture />

            <main className="min-h-screen pt-4">
              {children}
            </main>
            <Toaster />
            <StructuredData />
          </ClerkProviderWrapper>
        </V0Provider>
      </body>
    </html>
  )
}
