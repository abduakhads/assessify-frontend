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

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show nothing while checking authentication to avoid hydration mismatch
  if (isChecking) {
    return null;
  }

  return <Wrapper>{children}</Wrapper>;
}
