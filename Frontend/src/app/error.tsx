"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/15 text-destructive mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
        {error.message ||
          "An unexpected error occurred while loading this page. Please try again."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Try Again
        </Button>
        <Link href="/dashboard">
          <Button
            variant="outline"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
