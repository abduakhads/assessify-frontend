"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "@/components/ui/layouts/Wrapper";
import { isAuthenticated } from "@/utils/auth";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        router.push("/login");
      } else {
        setIsAuth(true);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuth) {
    return null;
  }

  return <Wrapper>{children}</Wrapper>;
}
