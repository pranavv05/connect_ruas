"use client"

import { useState, useEffect } from "react"
import { Linkedin, Twitter, Link2, CheckCircle2, Github, Globe } from "lucide-react"

interface Connection {
  id: string | null
  platform: string
  connected: boolean
  username: string | null
}

const platformIcons: Record<string, any> = {
  'LinkedIn': Linkedin,
  'X (Twitter)': Twitter,
  'GitHub': Github,
  'Portfolio': Globe
}

export function SocialConnections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/dashboard/connections', {
          credentials: 'include'
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch connections')
        }
        
        const data = await res.json()
        setConnections(data)
      } catch (err) {
        console.error('Error fetching connections:', err)
        setError("Failed to load connections")
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  const handleConnect = async (platform: string) => {
    // In a real implementation, this would open a connection flow
    alert(`Connection flow for ${platform} would be implemented here`)
  }

  const handleDisconnect = async (id: string | null, platform: string) => {
    if (!id) return
    
    try {
      const res = await fetch(`/api/dashboard/connections/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error('Failed to disconnect')
      }
      
      // Update the connections state
      setConnections(connections.map(conn => 
        conn.id === id ? { ...conn, connected: false, username: null } : conn
      ))
    } catch (err) {
      console.error('Error disconnecting:', err)
      alert('Failed to disconnect')
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 bg-muted rounded w-40"></div>
          <div className="w-5 h-5 bg-muted rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-secondary border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="h-3 bg-muted rounded w-64"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Social Connections</h3>
          <Link2 className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">Social Connections</h3>
        <Link2 className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {connections.map((connection) => {
          const Icon = platformIcons[connection.platform] || Link2
          return (
            <div key={`${connection.platform}-${connection.id}`} className="bg-secondary border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{connection.platform}</h4>
                    {connection.connected ? (
                      <p className="text-xs text-muted-foreground">{connection.username}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                {connection.connected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleDisconnect(connection.id, connection.platform)}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded transition-colors"
                    onClick={() => handleConnect(connection.platform)}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Connect your social accounts to share your achievements and grow your network
        </p>
      </div>
    </div>
  )
}