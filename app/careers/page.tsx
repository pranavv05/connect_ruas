"use client"

import Link from "next/link"
import { Users, Zap, Heart, TrendingUp, ArrowRight, MapPin, DollarSign, Clock } from "lucide-react"

export default function CareersPage() {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Competitive Salary",
      description: "We offer competitive compensation packages."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Opportunities",
      description: "Continuous learning and career development."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Hours",
      description: "Work-life balance with flexible schedules."
    }
  ]

  const positions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA / Remote",
      type: "Full-time"
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "San Francisco, CA / Remote",
      type: "Full-time"
    },
    {
      title: "Software Engineer Intern",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Internship"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Careers</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us build the future of career development for students and early professionals.
          </p>
        </div>

        <div className="flex items-start gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                At ConnectRUAS, our mission is to strengthen the RUAS student and alumni community by bringing 
                mentorship, collaboration, and growth opportunities into one unified platform. We believe every 
                student deserves access to guidance, real-world exposure, and a network that supports their academic 
                and professional journey.
              </p>

              <p>
                Our team is committed to building tools that make learning, connecting, and collaborating easier for 
                everyone — whether you're exploring career paths, seeking mentors, joining collaborations, or simply 
                looking to grow alongside your peers. ConnectRUAS is built for the RUAS community, and we welcome 
                passionate contributors who want to help shape the future of student–alumni engagement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{benefit.title}</h3>
                </div>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="bg-muted rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{position.department}</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </div>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Culture</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              We foster a culture of innovation, collaboration, and continuous learning. Our team members 
              come from diverse backgrounds and bring unique perspectives to problem-solving.
            </p>
            <p>
              We believe in work-life balance and provide flexible working arrangements. Our team 
              collaborates remotely and in-office, with regular team-building activities and opportunities 
              for professional development.
            </p>
            <p>
              We're committed to creating an inclusive environment where everyone can thrive. We actively 
              work to ensure all team members feel valued and heard.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Not Seeing the Right Role?</h2>
        <p className="text-muted-foreground mb-6">
          We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Send Your Resume
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}