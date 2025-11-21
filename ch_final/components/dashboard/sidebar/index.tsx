"use client";

import * as React from "react";

import AtomIcon from "@/components/icons/atom";
import BracketsIcon from "@/components/icons/brackets";
import ProcessorIcon from "@/components/icons/proccesor";
import CuteRobotIcon from "@/components/icons/cute-robot";
import EmailIcon from "@/components/icons/email";
import GearIcon from "@/components/icons/gear";
import LockIcon from "@/components/icons/lock";
import Image from "next/image";
import { useIsV0 } from "@/lib/v0-context";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export function DashboardSidebar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const isV0 = useIsV0();
  const { user, isLoaded } = useUser();

  // Get user data
  const userData = {
    name: user?.fullName || user?.firstName || user?.username || "User",
    email: user?.primaryEmailAddress?.emailAddress || "No email",
    avatar: user?.imageUrl || null,
  };

  // This is sample data for the sidebar
  const navData = {
    navMain: [
      {
        title: "Tools",
        items: [
          {
            title: "Overview",
            url: "/",
            icon: BracketsIcon,
            isActive: true,
          },
          {
            title: "Laboratory",
            url: "/laboratory",
            icon: AtomIcon,
            isActive: false,
          },
          {
            title: "Devices",
            url: "/devices",
            icon: ProcessorIcon,
            isActive: false,
          },
          {
            title: "Security",
            url: "/security",
            icon: CuteRobotIcon,
            isActive: false,
          },
          {
            title: "Communication",
            url: "/communication",
            icon: EmailIcon,
            isActive: false,
          },
          {
            title: "Admin Settings",
            url: "/admin",
            icon: GearIcon,
            isActive: false,
            locked: true,
          },
        ],
      },
    ],
    desktop: {
      title: "Desktop (Online)",
      status: "online",
    },
  };

  // Add a key to force re-render when user data changes
  const sidebarKey = `${userData.name}-${userData.avatar}`;

  return (
    <div {...props} className={`fixed inset-y-0 left-0 z-50 h-full w-64 bg-gray-900 text-white ${className || ''}`} key={sidebarKey}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex gap-3 items-center">
          <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-blue-500 transition-colors">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                width={48}
                height={48}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-blue-500 text-white font-bold rounded">
                {userData.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="text-xl font-bold truncate">{userData.name}</span>
            <span className="text-xs uppercase text-gray-400">The OS for Rebels</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Tools</h3>
          <nav className="space-y-1">
            {navData.navMain[0].items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${item.isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'} ${item.locked ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
                {item.locked && (
                  <LockIcon className="size-4 ml-auto" />
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}