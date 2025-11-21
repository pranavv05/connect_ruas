"use client"

import type React from "react"

import { useState } from "react"
import { Linkedin, Twitter, CheckCircle2, ExternalLink, Share2, Smile, ImageIcon, Video, X } from "lucide-react"

const socialPlatforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0A66C2]",
    bgColor: "bg-[#0A66C2]/10",
    borderColor: "border-[#0A66C2]/20",
    connected: true,
    profile: {
      username: "@johndoe",
      followers: "1.2K",
      connections: "850",
      profileUrl: "https://linkedin.com/in/johndoe",
    },
    benefits: [
      "Share career milestones automatically",
      "Sync professional achievements",
      "Grow your network with recommendations",
    ],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
    borderColor: "border-foreground/20",
    connected: false,
    profile: null,
    benefits: ["Share project updates and wins", "Connect with industry professionals", "Build your personal brand"],
  },
]

export default function ConnectionsPage() {
  const [platforms, setPlatforms] = useState(socialPlatforms)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [postText, setPostText] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<{ type: "image" | "video"; url: string; name: string }[]>([])
  const [isPosting, setIsPosting] = useState(false)

  const emojis = ["😊", "🎉", "🚀", "💡", "👏", "🔥", "💪", "✨", "🎯", "📈", "💼", "🌟", "👍", "❤️", "🙌", "⭐"]

  const handleConnect = (platformId: string) => {
    setIsConnecting(platformId)
    // Simulate OAuth flow
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId
            ? {
                ...p,
                connected: true,
                profile: {
                  username: "@johndoe",
                  followers: "0",
                  connections: "0",
                  profileUrl: `https://${platformId}.com/johndoe`,
                },
              }
            : p,
        ),
      )
      setIsConnecting(null)
    }, 1500)
  }

  const handleDisconnect = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              connected: false,
              profile: null,
            }
          : p,
      ),
    )
  }

  const handleEmojiSelect = (emoji: string) => {
    setPostText((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const type = file.type.startsWith("image/") ? "image" : "video"
      setMediaFiles((prev) => [...prev, { type, url, name: file.name }])
    })
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const handlePost = () => {
    if (!postText.trim() && mediaFiles.length === 0) return
    if (selectedPlatforms.length === 0) return

    setIsPosting(true)
    // Simulate posting
    setTimeout(() => {
      setIsPosting(false)
      setPostText("")
      setMediaFiles([])
      setSelectedPlatforms([])
      alert("Post shared successfully!")
    }, 1500)
  }

  const connectedCount = platforms.filter((p) => p.connected).length
  const connectedPlatforms = platforms.filter((p) => p.connected)

  return (
    <div className="min-h-screen bg-background ml-64">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Social Connections</h1>
          <p className="text-lg text-muted-foreground">Connect your social accounts to amplify your career growth</p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Why Connect Your Social Accounts?</h3>
              <p className="text-sm text-muted-foreground">
                Connecting your social media accounts allows you to automatically share your achievements, project
                completions, and career milestones. Build your professional brand and grow your network effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isConnected = isConnecting === platform.id

            return (
              <div key={platform.id} className={`bg-card border ${platform.borderColor} rounded-lg p-6`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg ${platform.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${platform.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{platform.name}</h3>
                      {platform.connected && platform.profile ? (
                        <p className="text-sm text-muted-foreground">{platform.profile.username}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  {platform.connected && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  )}
                </div>

                {/* Connected Profile Stats */}
                {platform.connected && platform.profile && (
                  <div className="bg-secondary rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Followers</p>
                        <p className="text-lg font-semibold text-foreground">{platform.profile.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Connections</p>
                        <p className="text-lg font-semibold text-foreground">{platform.profile.connections}</p>
                      </div>
                    </div>
                    <a
                      href={platform.profile.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                    >
                      View Profile
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Benefits */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Benefits:</p>
                  <ul className="space-y-2">
                    {platform.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {platform.connected ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={!!isConnecting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isConnected ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Icon className="w-5 h-5" />
                        Connect {platform.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Post Composer Section */}
        {connectedCount > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Create a Post</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Share your thoughts, achievements, or updates with your connected networks
            </p>

            {/* Text Area */}
            <div className="relative mb-4">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind? Share your latest achievement, project update, or career milestone..."
                className="w-full min-h-[120px] bg-secondary border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">{postText.length}/500</div>
            </div>

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type === "image" ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <div className="w-full h-32 bg-secondary rounded-lg border border-border flex items-center justify-center">
                        <Video className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-destructive-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                {/* Emoji Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5 text-muted-foreground" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg p-3 shadow-lg z-10 w-64">
                      <div className="grid grid-cols-8 gap-2">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="text-xl hover:bg-secondary rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <label className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer" title="Add image">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <input type="file" accept="image/*" multiple onChange={handleMediaUpload} className="hidden" />
                </label>

                {/* Video Upload */}
                <label className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer" title="Add video">
                  <Video className="w-5 h-5 text-muted-foreground" />
                  <input type="file" accept="video/*" onChange={handleMediaUpload} className="hidden" />
                </label>
              </div>

              <div className="text-sm text-muted-foreground">
                {mediaFiles.length > 0 && `${mediaFiles.length} file${mediaFiles.length > 1 ? "s" : ""} attached`}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-3">Share to:</p>
              <div className="flex flex-wrap gap-3">
                {connectedPlatforms.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        isSelected
                          ? `${platform.bgColor} ${platform.borderColor} ${platform.color}`
                          : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{platform.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Post Button */}
            <button
              onClick={handlePost}
              disabled={isPosting || (!postText.trim() && mediaFiles.length === 0) || selectedPlatforms.length === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Post to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        )}

        {/* Auto-Share Settings */}
        {connectedCount > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Auto-Share Settings</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Choose what you want to automatically share on your connected platforms
            </p>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Roadmap Completions</p>
                  <p className="text-xs text-muted-foreground">Share when you complete a career roadmap phase</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Project Launches</p>
                  <p className="text-xs text-muted-foreground">Share when you complete and launch a project</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">New Skills</p>
                  <p className="text-xs text-muted-foreground">Share when you learn and verify new skills</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Resume Updates</p>
                  <p className="text-xs text-muted-foreground">Share when you optimize your resume</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
