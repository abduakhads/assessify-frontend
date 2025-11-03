"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getRefreshToken } from "@/utils/auth";
import { GraduationCap, Users } from "lucide-react";

interface RegisterFormProps extends React.ComponentProps<"div"> {
  onSuccess?: (email: string) => void;
}

export function RegisterForm({
  className,
  onSuccess,
  ...props
}: RegisterFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      router.replace("/home");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/users/", {
        username,
        email,
        password,
        role,
      });

      // Registration successful
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (err: any) {
      console.log(err);

      // Handle different types of errors
      if (err?.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === "string") {
          setError(errorData);
        } else if (errorData.username) {
          setError(`Username: ${errorData.username[0]}`);
        } else if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Password: ${errorData.password[0]}`);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form while checking authentication
  if (isCheckingAuth) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="role">Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={cn(
                      "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-accent",
                      role === "student"
                        ? "border-primary bg-primary/5"
                        : "border-input"
                    )}
                    onClick={() => setRole("student")}
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <GraduationCap
                        className={cn(
                          "h-8 w-8",
                          role === "student"
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            role === "student"
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          Student
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Take assessments and view results
                        </p>
                      </div>
                    </div>
                    {role === "student" && (
                      <div className="absolute right-2 top-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-accent",
                      role === "teacher"
                        ? "border-primary bg-primary/5"
                        : "border-input"
                    )}
                    onClick={() => setRole("teacher")}
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <Users
                        className={cn(
                          "h-8 w-8",
                          role === "teacher"
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            role === "teacher"
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          Teacher
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Create and manage assessments
                        </p>
                      </div>
                    </div>
                    {role === "teacher" && (
                      <div className="absolute right-2 top-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium">{error}</div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
