"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4 shadow-inner">
        <GraduationCap className="h-8 w-8" />
      </div>

      <h1 className="text-6xl font-black text-primary tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-foreground mt-2">
        Page Not Found
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
        The requested page or resource could not be found. It may have been moved, renamed, or you might not have authorization.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/dashboard">
          <Button leftIcon={<Home className="h-4 w-4" />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
