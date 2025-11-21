"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useEffect } from "react";
import { clearAllCache } from "@/lib/data-fetching";
import { useUser } from "@clerk/nextjs";

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#3b82f6",
        },
      }}
      localization={{
        socialButtonsBlockButton: "Continue with {{provider|titleize}}",
      }}
      afterSignInUrl="/profile"
      afterSignUpUrl="/profile"
    >
      {children}
    </ClerkProvider>
  );
}