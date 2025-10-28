"use client";

import { useState, useEffect } from "react";
import { RegisterForm } from "@/components/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleRegistrationSuccess = (email: string) => {
    setUserEmail(email);
    setRegistrationComplete(true);
    // Start the 1-minute timer
    setResendTimer(60);
  };

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendActivation = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      await api.post("/auth/users/resend_activation/", {
        email: userEmail,
      });

      setResendMessage(
        "Activation email sent successfully! Please check your inbox."
      );
      // Reset timer for another minute
      setResendTimer(60);
    } catch (err: any) {
      console.error("Resend activation error:", err);

      if (err?.response?.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setResendMessage(`Error: ${errorData.email[0]}`);
        } else if (errorData.detail) {
          setResendMessage(`Error: ${errorData.detail}`);
        } else {
          setResendMessage(
            "Error: Failed to resend activation email. Please try again."
          );
        }
      } else {
        setResendMessage(
          "Error: Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Registration Successful!
              </CardTitle>
              <CardDescription>
                Check your email for the activation link
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent an activation link to your email address.
                  Please check your email and click the link to activate your
                  account.
                </p>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Next steps:</strong>
                  </p>
                  <ol className="mt-2 list-decimal list-inside text-sm text-blue-700 space-y-1">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the activation link in the email</li>
                    <li>Return to the login page to sign in</li>
                  </ol>
                </div>

                {/* Resend activation section */}
                <div className="space-y-3">
                  {resendMessage && (
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        resendMessage.startsWith("Error")
                          ? "bg-red-50 text-red-800"
                          : "bg-green-50 text-green-800"
                      }`}
                    >
                      {resendMessage}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Didn&apos;t receive the email?
                    </p>

                    {resendTimer > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Resend available in {Math.floor(resendTimer / 60)}:
                          {(resendTimer % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleResendActivation}
                        disabled={isResending}
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                      >
                        {isResending ? "Sending..." : "Resend Activation Email"}
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full cursor-pointer"
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <RegisterForm onSuccess={handleRegistrationSuccess} />
      </div>
    </div>
  );
}
