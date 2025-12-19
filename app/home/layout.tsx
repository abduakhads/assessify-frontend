"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "@/components/ui/layouts/Wrapper";
import { isAuthenticated } from "@/utils/auth";
import { getCurrentUser, isProfileComplete } from "@/utils/user";
import { UserProfileModal } from "@/components/UserProfileModal";
import { User } from "@/types";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        router.push("/login");
      } else {
        setIsAuth(true);

        // Check if user profile is complete
        const user = await getCurrentUser();
        if (user && !isProfileComplete(user)) {
          setShowProfileModal(true);
        }

        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleProfileComplete = () => {
    setShowProfileModal(false);
  };

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

  return (
    <>
      <UserProfileModal
        open={showProfileModal}
        onComplete={handleProfileComplete}
      />
      <Wrapper>{children}</Wrapper>
    </>
  );
}
