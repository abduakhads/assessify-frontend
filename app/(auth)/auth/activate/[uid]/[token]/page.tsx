"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ActivationPage() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const activateAccount = async () => {
      const uid = params.uid as string;
      const token = params.token as string;

      if (!uid || !token) {
        setError("Invalid activation link. Missing required parameters.");
        setStatus("error");
        return;
      }

      try {
        const response = await api.post("/auth/users/activation/", {
          uid,
          token,
        });

        // Success - status 204
        if (response.status === 204) {
          setStatus("success");

          // Start countdown for redirect
          let timeLeft = 10;
          const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft <= 0) {
              clearInterval(timer);
              router.push("/login");
            }
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (err: any) {
        console.log("Activation error:", err);

        if (err?.response?.data) {
          const errorData = err.response.data;
          if (errorData.uid) {
            setError(errorData.uid[0]);
          } else if (errorData.token) {
            setError(errorData.token[0]);
          } else if (errorData.detail) {
            setError(errorData.detail);
          } else if (typeof errorData === "string") {
            setError(errorData);
          } else {
            setError(
              "Account activation failed. Please try again or contact support."
            );
          }
        } else {
          setError(
            "Network error. Please check your connection and try again."
          );
        }

        setStatus("error");
      }
    };

    activateAccount();
  }, [router, params.uid, params.token]);

  const handleRetry = () => {
    setStatus("loading");
    setError("");
    window.location.reload();
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">
                Activating Your Account
              </CardTitle>
              <CardDescription>
                Please wait while we activate your account...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Account Activated!</CardTitle>
              <CardDescription>
                Your account has been successfully activated
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Great! Your account is now active and you can log in to start
                  using Assessify.
                </p>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    <strong>
                      You will be redirected to login in {countdown} seconds...
                    </strong>
                  </p>
                </div>
                <Button onClick={handleGoToLogin} className="w-full cursor-pointer">
                  Go to Login Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Activation Failed</CardTitle>
              <CardDescription>
                We couldn&apos;t activate your account
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>This could happen if:</p>
                  <ul className="mt-2 list-disc list-inside text-left space-y-1">
                    <li>The activation link has expired</li>
                    <li>The link has already been used</li>
                    <li>The link is invalid or corrupted</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button onClick={handleGoToLogin} className="w-full">
                    Go to Login
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  If the problem persists, please contact support or try
                  registering again.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
