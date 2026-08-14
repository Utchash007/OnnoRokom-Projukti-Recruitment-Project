"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginSchema, type LoginFormData } from "@/lib/validators";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { ApiError } from "@/lib/api/client";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.detail || err.message || "Invalid credentials");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-border/80 backdrop-blur-md bg-surface/95">
      <Card.Header className="text-center pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-inner">
          <GraduationCap className="h-8 w-8" />
        </div>
        <Card.Title className="text-2xl font-bold tracking-tight">
          Welcome to OnnoRokom
        </Card.Title>
        <Card.Description>
          Sign in to access your courses, assignments, and submissions
        </Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="space-y-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@institution.edu"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
        </Card.Content>

        <Card.Footer className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold shadow-md"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Contact your administrator if you need account assistance.
          </p>
        </Card.Footer>
      </form>
    </Card>
  );
};
