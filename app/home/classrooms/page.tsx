"use client";

import { useEffect, useState } from "react";
import StudentClassrooms from "./StudentClassrooms";
import TeacherClassrooms from "./TeacherClassrooms";
import api from "@/lib/axios";

export default function ClassroomsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await api.get("/auth/users/me/");
        setRole(res.data.role);
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
