"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        // The logout function will handle the redirect to /login
      } catch (err) {
        console.error("Logout error:", err);
        setError("An error occurred during logout. Redirecting to login...");

        // Fallback redirect after error
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } finally {
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-red-600 text-sm font-medium mb-4">{error}</div>
            <div className="text-xs text-muted-foreground">
              You will be redirected to the login page shortly...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <div className="text-sm font-medium mb-2">Logging out...</div>
          <div className="text-xs text-muted-foreground">
            Please wait while we securely log you out.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
