"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getUserRole } from "@/utils/user";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (typeof window === "undefined") {
        setIsChecking(false);
        return;
      }

      const role = await getUserRole();

      if (role === "teacher") {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }

      setIsChecking(false);
    };

    checkRole();
  }, []);

  if (isChecking) {
    return null; // Prevent hydration mismatch
  }

  if (!hasAccess) {
    notFound();
  }

  return <>{children}</>;
}
