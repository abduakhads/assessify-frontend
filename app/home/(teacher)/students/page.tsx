"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Users,
  ArrowLeft,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import type { Classroom, User, EnrollmentCode } from "@/types";

export default function StudentsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [enrollmentCode, setEnrollmentCode] = useState<EnrollmentCode | null>(
    null
  );
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<User | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({
        message: "No access token found",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch classrooms");
      }

      const data = await res.json();
      setClassrooms(data);
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to fetch classrooms",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !selectedClassroom) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setToast({
        message: "No access token found",
        type: "error",
      });
      return;
    }

    setRemoveLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${selectedClassroom.id}/delete-students/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_ids: [studentToRemove.id],
          }),
        }
      );

      if (res.status === 204) {
        // Success
        setToast({
          message: `${studentToRemove.first_name} ${studentToRemove.last_name} removed successfully`,
          type: "success",
        });
        setShowRemoveDialog(false);
        setStudentToRemove(null);

        // Update the selected classroom by removing the student from its students array
        if (selectedClassroom) {
          const updatedStudents =
            selectedClassroom.students?.filter(
              (s) => s.id !== studentToRemove.id
            ) || [];

          setSelectedClassroom({
            ...selectedClassroom,
            students: updatedStudents,
          });
        }

        // Refresh classrooms list in background
        await fetchClassrooms();
      } else if (res.status === 404) {
        const errorData = await res.json();
        setToast({
          message: errorData.detail || "Classroom not found",
          type: "error",
        });
      } else if (res.status === 400) {
        const errorData = await res.json();
        setToast({
          message: errorData.detail || "No valid students found",
          type: "error",
        });
      } else {
        throw new Error("Failed to remove student");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to remove student",
        type: "error",
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  const openRemoveDialog = (student: User) => {
    setStudentToRemove(student);
    setShowRemoveDialog(true);
  };

  const handleClassroomClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setSearchQuery("");
    fetchEnrollmentCode(classroom.id);
  };

  const handleBack = () => {
    setSelectedClassroom(null);
    setSearchQuery("");
    setEnrollmentCode(null);
  };

  const fetchEnrollmentCode = async (classroomId: number) => {
    setLoadingEnrollment(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEnrollmentCode(data);
      } else if (res.status === 404) {
        setEnrollmentCode(null);
      }
    } catch (err) {
      console.error("Error fetching enrollment code", err);
    } finally {
      setLoadingEnrollment(false);
    }
  };

  const handleToggleCodeActive = async () => {
    if (!selectedClassroom || !enrollmentCode) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/${selectedClassroom.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !enrollmentCode.is_active,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEnrollmentCode(data);
        setToast({
          message: `Enrollment code ${
            data.is_active ? "activated" : "deactivated"
          }`,
          type: "success",
        });
      } else {
        throw new Error("Failed to update enrollment code");
      }
    } catch (err) {
      setToast({
        message: "Failed to update enrollment code",
        type: "error",
      });
    }
  };

  const handleResetCode = async () => {
    if (!selectedClassroom) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/${selectedClassroom.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEnrollmentCode(data);
        setToast({
          message: "Enrollment code reset successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to reset enrollment code");
      }
    } catch (err) {
      setToast({
        message: "Failed to reset enrollment code",
        type: "error",
      });
    }
  };

  const handleCopyCode = () => {
    if (enrollmentCode) {
      navigator.clipboard.writeText(enrollmentCode.code);
      setToast({
        message: "Enrollment code copied to clipboard",
        type: "success",
      });
    }
  };

  // Get students for selected classroom and filter by search
  const filteredStudents = selectedClassroom
    ? (selectedClassroom.students || []).filter((student) => {
        return (
          searchQuery === "" ||
          student.first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {!selectedClassroom ? (
        // Classroom Selection View
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Students</h1>
            <p className="text-muted-foreground">
              Select a classroom to view and manage students
            </p>
          </div>

          {classrooms.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No classrooms yet</h3>
              <p className="text-muted-foreground">
                Create a classroom to start managing students
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  onClick={() => handleClassroomClick(classroom)}
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
                      {(classroom.students || []).length} student
                      {(classroom.students || []).length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Student List View for Selected Classroom
        <>
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classrooms
            </Button>

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Right Section: Enrollment Code - First on mobile, right on desktop */}
              <div className="w-full lg:w-72 lg:order-2 p-4 border rounded-lg bg-card self-start">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Enrollment Code</h3>
                  {enrollmentCode && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          enrollmentCode.is_active
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {enrollmentCode.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
                {loadingEnrollment ? (
                  <p className="text-xs text-muted-foreground">Loading...</p>
                ) : enrollmentCode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md font-mono text-sm">
                      <span className="flex-1 truncate">
                        {enrollmentCode.code}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="cursor-pointer h-7 w-7 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={
                          enrollmentCode.is_active ? "destructive" : "default"
                        }
                        onClick={handleToggleCodeActive}
                        className="cursor-pointer text-xs h-7 flex-1"
                        size="sm"
                      >
                        {enrollmentCode.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleResetCode}
                        className="cursor-pointer text-xs h-7 px-2"
                        size="sm"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No enrollment code
                  </p>
                )}
              </div>

              {/* Left Section: Classroom Name + Search - Second on mobile, left on desktop */}
              <div className="flex-1 lg:order-1 flex flex-col justify-between">
                {/* Classroom Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {selectedClassroom.name}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    Manage students in this classroom
                  </p>
                </div>

                {/* Search */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, surname, or username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {filteredStudents.length} student
                      {filteredStudents.length !== 1 ? "s" : ""} found
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Students List */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No students enrolled in this classroom"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {student.first_name} {student.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{student.username}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRemoveDialog(student)}
                      className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog
        isOpen={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setStudentToRemove(null);
        }}
        title="Remove Student"
      >
        {studentToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {studentToRemove.first_name} {studentToRemove.last_name}
              </span>{" "}
              from the classroom? This action cannot be undone.
            </p>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemoveDialog(false);
                  setStudentToRemove(null);
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemoveStudent}
                disabled={removeLoading}
                className="cursor-pointer bg-destructive hover:bg-destructive/90"
              >
                {removeLoading ? "Removing..." : "Remove Student"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
