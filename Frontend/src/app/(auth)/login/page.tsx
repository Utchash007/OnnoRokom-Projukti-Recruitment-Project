import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — OnnoRokom",
  description: "Sign in to the Assignment & Submission Management System",
};

export default function LoginPage() {
  return <LoginForm />;
}
