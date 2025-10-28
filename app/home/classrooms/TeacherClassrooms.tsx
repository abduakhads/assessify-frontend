"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Classroom } from "@/types";

export default function TeacherClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClassrooms() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setClassrooms(data);
        } else {
          setError("Failed to fetch classrooms");
        }
      } catch (err) {
        console.error("Error fetching classrooms", err);
        setError("An error occurred while fetching classrooms");
      } finally {
        setLoading(false);
      }
    }

    fetchClassrooms();
  }, []);

  const handleCreateClassroom = () => {
    // TODO: Implement create classroom logic
    console.log("Create new classroom");
  };

  const handleClassroomClick = (classroomId: number) => {
    // TODO: Navigate to classroom detail page
    console.log("View classroom:", classroomId);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">My Classrooms</h1>
        <p className="text-muted-foreground">Loading classrooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">My Classrooms</h1>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Classrooms</h1>
          <p className="text-muted-foreground">
            Manage your classrooms and assignments
          </p>
        </div>
        <Button onClick={handleCreateClassroom}>
          <Plus className="h-4 w-4 mr-2" />
          Create Classroom
        </Button>
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">No classrooms yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first classroom to get started
          </p>
          <Button onClick={handleCreateClassroom}>
            <Plus className="h-4 w-4 mr-2" />
            Create Classroom
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              onClick={() => handleClassroomClick(classroom.id)}
              className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{classroom.name}</h3>
              </div>

              {classroom.description && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {classroom.description}
                  </p>
                </>
              )}

              <Separator className="my-3" />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {classroom.student_count || 0} student
                  {classroom.student_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
