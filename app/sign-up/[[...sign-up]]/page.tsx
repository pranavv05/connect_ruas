// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              card: "bg-card border border-border shadow-lg rounded-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              dividerText: "text-muted-foreground",
              formFieldInput: "bg-background border border-border rounded-md",
              formFieldLabel: "text-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
              footerAction: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            }
          }}
        />
      </div>
    </div>
  );
}