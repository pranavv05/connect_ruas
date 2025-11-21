"use client"

import { useState, useEffect, useRef } from "react"
import "./page.css"

export default function TestResponsivePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMobile, sidebarOpen])

  return (
    <div className="min-h-screen bg-background lg:ml-64 test-responsive-container">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md lg:hidden"
          aria-label="Open navigation menu"
        >
          <span className="text-foreground">Menu</span>
        </button>
      )}
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50
          transition-all duration-300 ease-in-out test-responsive-sidebar
          ${isMobile 
            ? `w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl` 
            : 'w-64 translate-x-0'
          }
          lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? 'open' : ''}
        `}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Sidebar</h2>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close navigation menu"
            >
              <span className="text-foreground">✕</span>
            </button>
          )}
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li><a href="#" className="block py-2 text-foreground hover:text-primary">Dashboard</a></li>
            <li><a href="#" className="block py-2 text-foreground hover:text-primary">Roadmaps</a></li>
            <li><a href="#" className="block py-2 text-foreground hover:text-primary">Projects</a></li>
            <li><a href="#" className="block py-2 text-foreground hover:text-primary">Resume</a></li>
            <li><a href="#" className="block py-2 text-foreground hover:text-primary">Profile</a></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg lg:hidden"
          >
            Close
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 test-responsive-main">
        <h1 className="text-3xl font-bold text-foreground mb-6">Responsive Test Page</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Current Viewport Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-foreground font-medium">Device Type:</p>
              <p className="text-lg">{isMobile ? "Mobile" : "Desktop"}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-foreground font-medium">Sidebar Status:</p>
              <p className="text-lg">{sidebarOpen ? "Open" : "Closed"}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Test Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            <li>Resize your browser window to test responsive behavior</li>
            <li>On mobile viewports (&lt; 1024px), the sidebar should slide in from the left</li>
            <li>On desktop viewports (&ge; 1024px), the sidebar should be permanently visible</li>
            <li>Try clicking outside the sidebar to close it on mobile</li>
            <li>Try using the ESC key to close the sidebar on mobile</li>
          </ul>
        </div>
      </main>
    </div>
  )
}