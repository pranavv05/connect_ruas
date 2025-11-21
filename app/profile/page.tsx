"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  Globe,
  Edit,
  Save,
  X,
  Target,
  FolderKanban,
  Award,
  Calendar,
  Camera,
  Plus,
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // State for user profile data
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: null as string | null,
    role: "",
    location: "",
    bio: "",
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    links: [] as any[],
    stats: {
      projectsJoined: 0,
      roadmapsCreated: 0,
      tasksCompleted: 0,
      joinedDate: "",
    },
  })
  
  const [editedData, setEditedData] = useState(userData)
  
  // Fetch user profile data from database
  useEffect(() => {
    if (isLoaded && user) {
      // Set initial user data from Clerk - this should be the real data
      const initialData = {
        name: user.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) || "User",
        email: user.primaryEmailAddress?.emailAddress || "No email",
        avatar: user.imageUrl || null,
        role: "",
        location: "",
        bio: "",
        experience: [],
        education: [],
        skills: [],
        links: [],
        stats: {
          projectsJoined: 0,
          roadmapsCreated: 0,
          tasksCompleted: 0,
          joinedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        },
      }
      
      setUserData(initialData)
      setEditedData(initialData)
      
      // Fetch additional profile data from our database
      fetchUserProfile()
    }
  }, [isLoaded, user])
  
  // Fetch user profile data from our database
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      
      // Map profile links to the links array structure
      const links: any[] = [];
      if (data.profile?.githubUrl) {
        links.push({ name: 'GitHub', url: data.profile.githubUrl, icon: Github });
      }
      if (data.profile?.linkedinUrl) {
        links.push({ name: 'LinkedIn', url: data.profile.linkedinUrl, icon: Linkedin });
      }
      if (data.profile?.websiteUrl) {
        links.push({ name: 'Website', url: data.profile.websiteUrl, icon: Globe });
      }
      if (data.profile?.twitterUrl) {
        links.push({ name: 'Twitter', url: data.profile.twitterUrl, icon: Globe });
      }
      
      // Update user data with database information, but preserve Clerk data as primary source
      setUserData(prev => ({
        ...prev,
        name: user?.fullName || data.user?.fullName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || prev.name),
        email: user?.primaryEmailAddress?.emailAddress || data.user?.email || prev.email,
        avatar: user?.imageUrl || data.user?.avatarUrl || prev.avatar,
        location: data.profile?.location || prev.location,
        bio: data.profile?.bio || prev.bio,
        // Add education, experience, and skills from API response
        education: data.user?.education || prev.education,
        experience: data.user?.experience || prev.experience,
        skills: data.user?.skills?.map((skill: any) => skill.skillName) || prev.skills,
        links: links,
        stats: data.stats || prev.stats,
      }))
      
      setEditedData(prev => ({
        ...prev,
        name: user?.fullName || data.user?.fullName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || prev.name),
        email: user?.primaryEmailAddress?.emailAddress || data.user?.email || prev.email,
        avatar: user?.imageUrl || data.user?.avatarUrl || prev.avatar,
        location: data.profile?.location || prev.location,
        bio: data.profile?.bio || prev.bio,
        // Add education, experience, and skills from API response
        education: data.user?.education || prev.education,
        experience: data.user?.experience || prev.experience,
        skills: data.user?.skills?.map((skill: any) => skill.skillName) || prev.skills,
        links: links,
      }))
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Even if fetch fails, we still have the Clerk data which is the real data
      if (user) {
        setUserData(prev => ({
          ...prev,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
          avatar: user.imageUrl || prev.avatar,
        }))
        
        setEditedData(prev => ({
          ...prev,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
          avatar: user.imageUrl || prev.avatar,
        }))
      }
    }
  }
  
  // Save profile data to database
  const handleSave = async () => {
    try {
      // Map links back to individual fields
      let githubUrl = "";
      let linkedinUrl = "";
      let websiteUrl = "";
      let twitterUrl = "";
      
      editedData.links.forEach(link => {
        if (link.name === 'GitHub') githubUrl = link.url;
        if (link.name === 'LinkedIn') linkedinUrl = link.url;
        if (link.name === 'Website') websiteUrl = link.url;
        if (link.name === 'Twitter') twitterUrl = link.url;
      });
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editedData.name,
          bio: editedData.bio,
          location: editedData.location,
          githubUrl,
          linkedinUrl,
          websiteUrl,
          twitterUrl,
          // Map education data to match database schema
          education: editedData.education.map((edu: any) => ({
            institutionName: edu.institutionName || edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            startDate: edu.startDate || null,
            endDate: edu.endDate || null,
            isCurrent: edu.isCurrent || false,
            description: edu.description || ''
          })),
          // Map experience data to match database schema
          experience: editedData.experience.map((exp: any) => ({
            companyName: exp.companyName || exp.company || '',
            position: exp.position || exp.title || '',
            employmentType: exp.employmentType || '',
            startDate: exp.startDate || null,
            endDate: exp.endDate || null,
            isCurrent: exp.isCurrent || false,
            description: exp.description || ''
          })),
          // Map skills data
          skills: editedData.skills.filter((skill: string) => skill && skill.trim() !== '').map((skill: string) => skill.trim())
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save profile')
      }
      
      // Update successful - update local state
      setUserData(editedData)
      setIsEditing(false)
      
      // Refresh the Clerk user data to ensure consistency across the app
      if (user) {
        await user.reload()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }
  
  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload to a service like Cloudinary
    // For now, we'll just create a data URL and save it to the database
    setIsUploading(true)
    
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const avatarUrl = event.target?.result as string
        
        // Save to database
        const response = await fetch('/api/profile/photo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatarUrl }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload photo')
        }
        
        // Update local state with new avatar
        const updatedData = { ...userData, avatar: avatarUrl }
        setUserData(updatedData)
        setEditedData(updatedData)
        setIsUploading(false)
        
        // Refresh the Clerk user data to ensure consistency across the app
        if (user) {
          await user.reload()
        }
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. Please try again.')
      setIsUploading(false)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      title: "",
      company: "",
      period: "",
      description: ""
    }
    setEditedData({
      ...editedData,
      experience: [...editedData.experience, newExperience]
    })
  }

  // Add new education
  const addEducation = () => {
    const newEducation = {
      degree: "",
      institution: "",
      period: "",
      description: ""
    }
    setEditedData({
      ...editedData,
      education: [...editedData.education, newEducation]
    })
  }

  // Add new skill
  const addSkill = () => {
    setEditedData({
      ...editedData,
      skills: [...editedData.skills, ""]
    })
  }

  // Add new link
  const addLink = () => {
    const newLink = {
      name: "Website",
      url: "",
      icon: Globe
    }
    setEditedData({
      ...editedData,
      links: [...editedData.links, newLink]
    })
  }

  // Update experience field
  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...editedData.experience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    setEditedData({ ...editedData, experience: updatedExperience })
  }

  // Update education field
  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...editedData.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEditedData({ ...editedData, education: updatedEducation })
  }

  // Update skill
  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...editedData.skills]
    updatedSkills[index] = value
    setEditedData({ ...editedData, skills: updatedSkills })
  }

  // Update link field
  const updateLink = (index: number, field: string, value: string) => {
    const updatedLinks = [...editedData.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    setEditedData({ ...editedData, links: updatedLinks })
  }

  // Remove experience
  const removeExperience = (index: number) => {
    const updatedExperience = [...editedData.experience]
    updatedExperience.splice(index, 1)
    setEditedData({ ...editedData, experience: updatedExperience })
  }

  // Remove education
  const removeEducation = (index: number) => {
    const updatedEducation = [...editedData.education]
    updatedEducation.splice(index, 1)
    setEditedData({ ...editedData, education: updatedEducation })
  }

  // Remove skill
  const removeSkill = (index: number) => {
    const updatedSkills = [...editedData.skills]
    updatedSkills.splice(index, 1)
    setEditedData({ ...editedData, skills: updatedSkills })
  }

  // Remove link
  const removeLink = (index: number) => {
    const updatedLinks = [...editedData.links]
    updatedLinks.splice(index, 1)
    setEditedData({ ...editedData, links: updatedLinks })
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>You must be signed in to view your profile.</div>
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt={userData.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{userData.name.charAt(0)}</span>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="text-2xl sm:text-3xl font-bold text-foreground bg-background border border-border rounded px-3 py-1 mb-2 w-full sm:w-auto"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{userData.name}</h1>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </div>
                  {(userData.location || isEditing) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.location}
                          onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                          placeholder="Add location"
                          className="bg-background border border-border rounded px-2 py-0.5"
                        />
                      ) : (
                        <span>{userData.location}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-primary" />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.projectsJoined}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Projects Joined</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.roadmapsCreated}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Roadmaps Created</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <p className="text-xl sm:text-2xl font-bold text-foreground">{userData.stats.tasksCompleted}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">{userData.stats.joinedDate}</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About
              </h2>
              {isEditing ? (
                <textarea
                  value={editedData.bio}
                  onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {userData.bio || "No bio added yet. Edit your profile to tell others about yourself."}
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experience
                </h2>
                {isEditing && (
                  <button 
                    onClick={addExperience}
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                )}
              </div>
              {editedData.experience && editedData.experience.length > 0 ? (
                <div className="space-y-4">
                  {editedData.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            placeholder="Job Title"
                            className="font-semibold text-foreground bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            placeholder="Company"
                            className="text-sm text-primary bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => updateExperience(index, 'period', e.target.value)}
                            placeholder="Period (e.g., 2020 - Present)"
                            className="text-xs text-muted-foreground bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Description"
                            className="text-sm text-muted-foreground bg-background border border-border rounded px-2 py-1 w-full min-h-[60px]"
                          />
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-destructive hover:text-destructive/80 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-foreground">{exp.title}</h3>
                          <p className="text-sm text-primary mb-1">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isEditing 
                    ? "Add your work experience to showcase your professional background." 
                    : "No experience added yet."}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h2>
                {isEditing && (
                  <button 
                    onClick={addEducation}
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                )}
              </div>
              {editedData.education && editedData.education.length > 0 ? (
                <div className="space-y-4">
                  {editedData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Degree"
                            className="font-semibold text-foreground bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            placeholder="Institution"
                            className="text-sm text-primary bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => updateEducation(index, 'period', e.target.value)}
                            placeholder="Period (e.g., 2018 - 2022)"
                            className="text-xs text-muted-foreground bg-background border border-border rounded px-2 py-1 w-full"
                          />
                          <textarea
                            value={edu.description}
                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                            placeholder="Description"
                            className="text-sm text-muted-foreground bg-background border border-border rounded px-2 py-1 w-full min-h-[60px]"
                          />
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-destructive hover:text-destructive/80 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                          <p className="text-sm text-primary mb-1">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground mb-2">{edu.period}</p>
                          <p className="text-sm text-muted-foreground">{edu.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isEditing 
                    ? "Add your educational background to highlight your qualifications." 
                    : "No education added yet."}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Skills
                </h2>
                {isEditing && (
                  <button 
                    onClick={addSkill}
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                )}
              </div>
              {editedData.skills && editedData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    editedData.skills.map((skill: string, index: number) => (
                      <div key={index} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          placeholder="Skill"
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 w-full"
                        />
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    editedData.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isEditing 
                    ? "Add your skills to showcase your expertise." 
                    : "No skills added yet."}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Links
                </h2>
                {isEditing && (
                  <button 
                    onClick={addLink}
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                )}
              </div>
              {editedData.links && editedData.links.length > 0 ? (
                <div className="space-y-3">
                  {editedData.links.map((link: any, index: number) => (
                    <div key={index}>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={link.name}
                            onChange={(e) => updateLink(index, 'name', e.target.value)}
                            className="text-sm bg-background border border-border rounded px-2 py-1"
                          >
                            <option value="Website">Website</option>
                            <option value="GitHub">GitHub</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Twitter">Twitter</option>
                          </select>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            placeholder="URL"
                            className="text-sm bg-background border border-border rounded px-2 py-1 flex-1"
                          />
                          <button
                            onClick={() => removeLink(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
                        >
                          <link.icon className="w-5 h-5 group-hover:text-primary" />
                          <span className="text-foreground">{link.name}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isEditing 
                    ? "Add links to your portfolio, GitHub, LinkedIn, or other profiles." 
                    : "No links added yet."}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}