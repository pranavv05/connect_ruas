"use client";

import { useUser } from "@clerk/nextjs";

export function DashboardHeader() {
  const { user } = useUser();
  
  return (
    <div className="space-y-3">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
        Welcome back, {user?.firstName || user?.username || "there"}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground">Continue building your collaborative journey</p>
    </div>
  )
}