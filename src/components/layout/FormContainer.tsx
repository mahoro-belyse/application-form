import type { ReactNode } from "react";
import schoolLogo from "@/assets/school-logo.png";

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="w-full bg-primary">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4 sm:flex-row flex-col">
          <img src={schoolLogo} alt="School Logo" className="h-12 w-auto" />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-primary-foreground">
              Greenfield Academy
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Student Application Portal
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="w-full max-w-4xl mx-auto px-4 py-6 mb-8">
        {children}
      </main>
    </div>
  );
}
