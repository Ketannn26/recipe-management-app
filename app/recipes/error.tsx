// app/recipes/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RecipesError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Recipes page error:", error);
  }, [error]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t load the recipes right now. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} className="mt-4">
          Try Again
        </Button>
      </div>
    </main>
  );
}
