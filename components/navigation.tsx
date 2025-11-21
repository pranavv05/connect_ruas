"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { LogOut, LayoutDashboard, Map, FolderKanban, FileText, Share2, User, MessageSquare, Menu, X, Users } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMobile && isOpen) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMobile, isOpen])

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false)
    }
  }, [isMobile])

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mentorship", label: "Mentorship", icon: Users },
    { href: "/roadmaps", label: "Roadmaps", icon: Map },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/chat", label: "Chat", icon: MessageSquare },
  ]

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      )}
      
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl` 
            : 'w-64 translate-x-0'
          }
          lg:translate-x-0 lg:shadow-none
        `}
      >
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Image 
              src="/logo.jpg" 
              alt="Baby Collab Logo" 
              width={40} 
              height={40} 
              className="rounded-lg" 
            />
            <span className="text-lg sm:text-xl font-bold text-primary truncate">Baby Collab</span>
          </Link>
          {isMobile && (
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section at Bottom */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/feedback"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname.startsWith("/feedback")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Feedback</span>
          </Link>

          <SignOutButton>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  )
}