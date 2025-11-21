"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Calendar, 
  BookOpen,
  ShieldCheck
} from "lucide-react";

export function UserTypeModal() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<"student" | "alumni" | null>(null);
  const [graduationYear, setGraduationYear] = useState("");
  const [majorSubject, setMajorSubject] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user has completed onboarding
  useEffect(() => {
    if (isLoaded && user) {
      const checkOnboardingStatus = async () => {
        try {
          const response = await fetch("/api/user-type");
          if (response.ok) {
            const data = await response.json();
            if (!data.hasCompletedOnboarding) {
              setIsOpen(true);
            }
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      };

      checkOnboardingStatus();
    }
  }, [isLoaded, user]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-college-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      // Show OTP input field
      setShowOtpInput(true);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-college-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          collegeEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify OTP");
      }

      // OTP verified, now save user type
      await saveUserType();
    } catch (error: any) {
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserType = async () => {
    try {
      const response = await fetch("/api/user-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType,
          graduationYear: userType === "alumni" ? graduationYear : undefined,
          majorSubject: userType === "alumni" ? majorSubject : undefined,
          collegeEmail: userType === "student" ? collegeEmail : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user type");
      }

      // Close modal on success
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === "student" && !showOtpInput) {
      // Send OTP first
      handleSendOtp(e);
      return;
    }
    
    if (userType === "student" && showOtpInput) {
      // Verify OTP
      handleVerifyOtp(e);
      return;
    }
    
    // For alumni, save directly
    setIsLoading(true);
    setError("");
    await saveUserType();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Welcome to Baby Collab!</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <p className="text-muted-foreground mb-6">
            To get started, please tell us whether you're a student or an alumni.
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User Type Selection */}
              {!showOtpInput && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType("student")}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                        userType === "student"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 text-primary" />
                      <span className="font-medium">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("alumni")}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                        userType === "alumni"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Briefcase className="w-6 h-6 text-primary" />
                      <span className="font-medium">Alumni</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Student Form */}
              {userType === "student" && !showOtpInput && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="collegeEmail" className="block text-sm font-medium text-foreground mb-2">
                      College Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        id="collegeEmail"
                        value={collegeEmail}
                        onChange={(e) => setCollegeEmail(e.target.value)}
                        placeholder="Enter your college email"
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll send a verification code to this email
                    </p>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              {userType === "student" && showOtpInput && (
                <div className="space-y-4">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Verify Your Email</h3>
                    <p className="text-muted-foreground text-sm">
                      We've sent a 6-digit code to <span className="font-medium">{collegeEmail}</span>
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Change email address
                  </button>
                </div>
              )}

              {/* Alumni Form */}
              {userType === "alumni" && !showOtpInput && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-foreground mb-2">
                      Graduation Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        id="graduationYear"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="e.g., 2023"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="majorSubject" className="block text-sm font-medium text-foreground mb-2">
                      Major Subject
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        id="majorSubject"
                        value={majorSubject}
                        onChange={(e) => setMajorSubject(e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !userType || 
                  isLoading || 
                  (userType === "student" && !collegeEmail && !showOtpInput) ||
                  (userType === "student" && showOtpInput && otp.length !== 6) ||
                  (userType === "alumni" && (!graduationYear || !majorSubject))
                }
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {userType === "student" && !showOtpInput ? "Sending OTP..." : 
                     userType === "student" && showOtpInput ? "Verifying..." : "Processing..."}
                  </>
                ) : (
                  <>
                    {userType === "student" && !showOtpInput ? "Send Verification Code" : 
                     userType === "student" && showOtpInput ? "Verify Code" : "Continue to Dashboard"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}