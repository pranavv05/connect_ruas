import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BC</span>
              </div>
              <span className="text-xl font-bold text-foreground">ConnectRUAS</span>
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  )
}