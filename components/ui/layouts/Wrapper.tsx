"use client";
import { useEffect, useState } from "react";
import { StudentSidebar } from "../student-sidebar";
import { TeacherSidebar } from "../teacher-sidebar";
import api from "@/lib/axios";

export default function Wrapper({ children }: { children: React.ReactNode }) {
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Setting up your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {role === "teacher" ? <TeacherSidebar /> : <StudentSidebar />}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
