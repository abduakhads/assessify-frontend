"use client";

import { useEffect, useState } from "react";
import StudentClassrooms from "./StudentClassrooms";
import TeacherClassrooms from "./TeacherClassrooms";

export default function ClassroomsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
        }
      } catch (err) {
        console.error("Error fetching role", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Classrooms</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Render appropriate component based on role
  if (role === "teacher") {
    return <TeacherClassrooms />;
  }

  return <StudentClassrooms />;
}
