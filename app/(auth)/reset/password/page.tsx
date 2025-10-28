"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getRefreshToken } from "@/utils/auth";
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
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";

export default function PasswordResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      router.push("/home");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/users/reset_password/", {
        email,
      });

      // Success - show success message
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);

      if (err?.response?.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else if (typeof errorData === "string") {
          setError(errorData);
        } else {
          setError("Failed to send password reset email. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleTryAgain = () => {
    setSuccess(false);
    setEmail("");
    setError("");
  };

  // Don't render while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                Password reset instructions sent
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent password reset instructions to your email
                  address. Please check your email and follow the link to reset
                  your password.
                </p>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="mt-2 list-decimal list-inside text-sm text-blue-700 space-y-1">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the password reset link in the email</li>
                    <li>Create a new password</li>
                    <li>Log in with your new password</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleBackToLogin} className="w-full cursor-pointer">
                    Back to Login
                  </Button>

                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    Send to Different Email
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try
                  again with a different email address.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
            </div>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordReset}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your account
                  </p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                Remember your password? {" "}
                <button
                  onClick={handleBackToLogin}
                  className="text-primary underline underline-offset-4 hover:no-underline  cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
