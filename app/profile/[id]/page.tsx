"use client";

import { useState, useEffect } from "react";
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
  Target, 
  FolderKanban, 
  Award, 
  Calendar 
} from "lucide-react";
import { notFound } from "next/navigation";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const res = await fetch(`/api/users/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background ml-64">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{userData.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userData.name || userData.username || 'User'}</h1>
                  {userData.role && (
                    <p className="text-lg text-muted-foreground mb-3">{userData.role}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                {userData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                )}
                {userData.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                )}
              </div>
              
              {userData.bio && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {userData.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats?.projectsJoined || 0}</p>
              </div>
              <p className="text-sm text-muted-foreground">Projects Joined</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats?.roadmapsCreated || 0}</p>
              </div>
              <p className="text-sm text-muted-foreground">Roadmaps Created</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <p className="text-2xl font-bold text-foreground">{userData.stats?.tasksCompleted || 0}</p>
              </div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">{userData.stats?.joinedDate ? new Date(userData.stats.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}</p>
              </div>
              <p className="text-sm text-muted-foreground">Member Since</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {userData.bio && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {userData.bio}
                </p>
              </div>
            )}

            {/* Experience */}
            {userData.experience && userData.experience.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {userData.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold text-foreground">{exp.position || exp.title}</h3>
                      {exp.companyName && (
                        <p className="text-sm text-primary mb-1">{exp.companyName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mb-2">
                        {exp.startDate && exp.endDate 
                          ? `${new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                          : 'N/A'}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {userData.education && userData.education.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h2>
                <div className="space-y-4">
                  {userData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      {edu.institutionName && (
                        <p className="text-sm text-primary mb-1">{edu.institutionName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mb-2">
                        {edu.startDate && edu.endDate 
                          ? `${new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${edu.isCurrent ? 'Present' : new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                          : 'N/A'}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-muted-foreground">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills */}
            {userData.skills && userData.skills.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(userData.githubUrl || userData.linkedinUrl || userData.websiteUrl) && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Links
                </h2>
                <div className="space-y-3">
                  {userData.githubUrl && (
                    <a 
                      href={userData.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
                    >
                      <Github className="w-5 h-5 group-hover:text-primary" />
                      <span className="text-foreground">GitHub</span>
                    </a>
                  )}
                  {userData.linkedinUrl && (
                    <a 
                      href={userData.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 group-hover:text-primary" />
                      <span className="text-foreground">LinkedIn</span>
                    </a>
                  )}
                  {userData.websiteUrl && (
                    <a 
                      href={userData.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
                    >
                      <Globe className="w-5 h-5 group-hover:text-primary" />
                      <span className="text-foreground">Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}