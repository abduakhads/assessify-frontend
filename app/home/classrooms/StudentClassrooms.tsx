"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import QuizAttempt from "@/components/QuizAttempt";
import type { Classroom, Quiz, StudentQuizAttempt } from "@/types";

export default function StudentClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<StudentQuizAttempt[]>([]);
  const [activeAttemptId, setActiveAttemptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [enrollCode, setEnrollCode] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  const handleEnroll = async () => {
    if (!enrollCode.trim()) {
      setToast({ message: "Please enter an enrollment code", type: "error" });
      return;
    }

    setEnrollLoading(true);
    setToast(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setEnrollLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enroll/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            code: enrollCode,
          }),
        }
      );

      if (res.status === 201) {
        const data = await res.json();
        setToast({ message: data.detail, type: "success" });
        setShowEnrollDialog(false);
        setEnrollCode("");
        // Refresh classrooms list
        const classroomsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (classroomsRes.ok) {
          const classroomsData = await classroomsRes.json();
          setClassrooms(classroomsData);
        }
      } else {
        try {
          const data = await res.json();
          setToast({ message: data.detail, type: "error" });
        } catch {
          setToast({ message: "Failed to enroll in classroom", type: "error" });
        }
      }
    } catch (err) {
      console.error("Error enrolling in classroom", err);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setEnrollLoading(false);
    }
  };

  const fetchQuizzes = async (classroomId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
      return;
    }

    setLoadingQuizzes(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes?classroom=${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      } else {
        setError("Failed to fetch quizzes");
      }
    } catch (err) {
      console.error("Error fetching quizzes", err);
      setError("An error occurred while fetching quizzes");
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const fetchAttempts = async (quizId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
      return;
    }

    setLoadingAttempts(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attempts?quiz=${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAttempts(data);
      } else {
        setError("Failed to fetch attempts");
      }
    } catch (err) {
      console.error("Error fetching attempts", err);
      setError("An error occurred while fetching attempts");
    } finally {
      setLoadingAttempts(false);
    }
  };

  const handleClassroomClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    fetchQuizzes(classroom.id);
  };

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    fetchAttempts(quiz.id);
  };

  const handleBackToClassrooms = () => {
    setSelectedClassroom(null);
    setSelectedQuiz(null);
    setQuizzes([]);
    setAttempts([]);
    setError(null);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setAttempts([]);
    setActiveAttemptId(null);
    setError(null);
  };

  const handleStartAttempt = async () => {
    if (!selectedQuiz) return;

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attempts/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quiz: selectedQuiz.id }),
        }
      );

      if (res.ok) {
        const newAttempt: StudentQuizAttempt = await res.json();
        setActiveAttemptId(newAttempt.id);
      } else {
        setError("Failed to start attempt");
      }
    } catch (err) {
      console.error("Error starting attempt", err);
      setError("An error occurred while starting the attempt");
    }
  };

  const handleResumeAttempt = (attemptId: number) => {
    setActiveAttemptId(attemptId);
  };

  const handleQuizComplete = async () => {
    console.log("handleQuizComplete called - resetting activeAttemptId");
    // Reset active attempt and refresh the attempts list
    setActiveAttemptId(null);
    if (selectedQuiz) {
      console.log("Fetching attempts for quiz:", selectedQuiz.id);
      await fetchAttempts(selectedQuiz.id);
      console.log("Attempts fetched, should now show attempts list");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Classrooms</h1>
        <p className="text-muted-foreground">Loading classrooms...</p>
      </div>
    );
  }

  // Show quiz attempt interface
  if (activeAttemptId && selectedQuiz) {
    return (
      <QuizAttempt
        attemptId={activeAttemptId}
        quizId={selectedQuiz.id}
        onComplete={handleQuizComplete}
      />
    );
  }

  // Show attempts for selected quiz
  if (selectedQuiz && selectedClassroom) {
    const completedAttempts = attempts.filter((a) => a.completed_at !== null);
    const incompleteAttempt = attempts.find((a) => a.completed_at === null);
    const canStartNewAttempt =
      selectedQuiz.is_active &&
      completedAttempts.length < selectedQuiz.allowed_attempts &&
      !incompleteAttempt;

    return (
      <div className="p-8">
        <Button variant="ghost" onClick={handleBackToQuizzes} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{selectedQuiz.title}</h1>
          <p className="text-muted-foreground mb-1">
            {selectedClassroom.name} - {selectedClassroom.teacher.first_name}{" "}
            {selectedClassroom.teacher.last_name}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Quiz ID: {selectedQuiz.id}</span>
            <span>Questions: {selectedQuiz.question_count}</span>
            <span>
              Attempts: {completedAttempts.length}/
              {selectedQuiz.allowed_attempts}
            </span>
            <span>Deadline: {formatDate(selectedQuiz.deadline)}</span>
          </div>
        </div>

        {loadingAttempts ? (
          <p className="text-muted-foreground">Loading attempts...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">
              {incompleteAttempt && (
                <Button
                  onClick={() => handleResumeAttempt(incompleteAttempt.id)}
                  variant="default"
                >
                  Resume Attempt
                </Button>
              )}
              {canStartNewAttempt && (
                <Button onClick={handleStartAttempt} variant="default">
                  Start New Attempt
                </Button>
              )}
            </div>

            {/* Attempts List */}
            {attempts.length === 0 ? (
              <p className="text-muted-foreground">
                No attempts yet. Start your first attempt!
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Attempts</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...attempts].reverse().map((attempt, idx) => (
                    <div
                      key={attempt.id}
                      className="p-6 border rounded-lg bg-card"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">
                            Attempt #{attempts.length - idx}
                          </h3>
                          {attempt.completed_at ? (
                            <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                              Completed
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                              In Progress
                            </span>
                          )}
                        </div>
                        <Separator />
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Started:
                            </span>
                            <span>{formatDate(attempt.started_at)}</span>
                          </div>
                          {attempt.completed_at && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Completed:
                                </span>
                                <span>{formatDate(attempt.completed_at)}</span>
                              </div>
                              <div className="flex justify-between font-semibold mt-2">
                                <span>Score:</span>
                                <span className="text-primary">
                                  {attempt.score
                                    ? `${parseFloat(attempt.score).toFixed(2)}%`
                                    : "Not scored yet"}
                                </span>
                              </div>
                            </>
                          )}
                          {!attempt.completed_at && (
                            <Button
                              onClick={() => handleResumeAttempt(attempt.id)}
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                            >
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show quiz list for selected classroom
  if (selectedClassroom) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={handleBackToClassrooms}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classrooms
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{selectedClassroom.name}</h1>
          <p className="text-muted-foreground">
            Teacher: {selectedClassroom.teacher.first_name}{" "}
            {selectedClassroom.teacher.last_name}
          </p>
        </div>

        {loadingQuizzes ? (
          <p className="text-muted-foreground">Loading quizzes...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : quizzes.length === 0 ? (
          <p className="text-muted-foreground">
            No quizzes found in this classroom
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleQuizClick(quiz)}
                className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{quiz.title}</h3>
                  {quiz.is_active && (
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Questions: {quiz.question_count}</p>
                  <div className="flex flex-row justify-between ">
                    <p>Deadline: {formatDate(quiz.deadline)}</p>
                    {/* <p>ID: {quiz.id}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show classrooms list
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Classrooms</h1>
        <p className="text-destructive">{error}</p>
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

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Classrooms</h1>
        <Button
          onClick={() => setShowEnrollDialog(true)}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Enroll in Classroom
        </Button>
      </div>

      <p className="text-muted-foreground mb-8">Welcome to your classrooms</p>

      {classrooms.length === 0 ? (
        <p className="text-muted-foreground">No classrooms found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              onClick={() => handleClassroomClick(classroom)}
              className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold mb-2">{classroom.name}</h3>
              <p className="text-sm text-muted-foreground">
                {classroom.teacher.first_name} {classroom.teacher.last_name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Dialog */}
      <Dialog
        isOpen={showEnrollDialog}
        onClose={() => {
          setShowEnrollDialog(false);
          setEnrollCode("");
        }}
        title="Enroll in Classroom"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enroll-code">Enrollment Code</Label>
            <Input
              id="enroll-code"
              value={enrollCode}
              onChange={(e) => setEnrollCode(e.target.value)}
              placeholder="Enter enrollment code (e.g., PF5TOV94)"
              maxLength={8}
              className="uppercase"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnroll();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Enter the 8-character code provided by your teacher
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowEnrollDialog(false);
                setEnrollCode("");
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={enrollLoading}
              className="cursor-pointer"
            >
              {enrollLoading ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
