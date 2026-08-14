import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-surface-hover to-background overflow-hidden">
      {/* Decorative gradient orbs for a premium look */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
