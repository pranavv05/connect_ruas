"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "For general inquiries and support",
      detail: "support@connectruas.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "For urgent matters",
      detail: "+1 (555) 123-4567"
    }
  ]

  const officeLocations = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Headquarters",
      address: "123 Career Street, San Francisco, CA 94103",
      hours: "Monday - Friday: 9AM - 5PM PST"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Contact</span>
        </nav>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-muted rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {method.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground">{method.title}</h2>
              </div>
              <p className="text-muted-foreground mb-2">{method.description}</p>
              <p className="font-medium text-foreground">{method.detail}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Office Locations</h2>
          <div className="grid grid-cols-1 gap-6">
            {officeLocations.map((location, index) => (
              <div key={index} className="bg-muted rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                    {location.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{location.title}</h3>
                    <p className="text-muted-foreground mb-2">{location.address}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="What is this regarding?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Need Immediate Help?</h2>
        <p className="text-muted-foreground mb-6">
          Visit our Help Center for instant answers to common questions.
        </p>
        <Link 
          href="/help" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Visit Help Center
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}