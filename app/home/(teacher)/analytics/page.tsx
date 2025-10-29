"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import type {
  Classroom,
  Quiz,
  QuizAttemptStats,
  QuestionAttemptDetail,
} from "@/types";

export default function Analytics() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttemptStats[]>([]);
  const [selectedAttempt, setSelectedAttempt] =
    useState<QuizAttemptStats | null>(null);
  const [attemptDetails, setAttemptDetails] = useState<QuestionAttemptDetail[]>(
    []
  );
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
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
  };

  const fetchQuizzes = async (classroomId: number) => {
    setLoadingQuizzes(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

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
      }
    } catch (err) {
      console.error("Error fetching quizzes", err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const fetchAttempts = async (quizId: number) => {
    setLoadingAttempts(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/stats/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAttempts(data);
      }
    } catch (err) {
      console.error("Error fetching attempts", err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const fetchAttemptDetails = async (quizId: number, attemptId: number) => {
    setLoadingDetails(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${quizId}/stats/${attemptId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAttemptDetails(data);
      }
    } catch (err) {
      console.error("Error fetching attempt details", err);
    } finally {
      setLoadingDetails(false);
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

  const handleAttemptClick = (attempt: QuizAttemptStats) => {
    setSelectedAttempt(attempt);
    setScore(attempt.score || "");
    if (selectedQuiz) {
      fetchAttemptDetails(selectedQuiz.id, attempt.id);
    }
  };

  const handleBackToClassrooms = () => {
    setSelectedClassroom(null);
    setSelectedQuiz(null);
    setSelectedAttempt(null);
    setQuizzes([]);
    setAttempts([]);
    setAttemptDetails([]);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setSelectedAttempt(null);
    setAttempts([]);
    setAttemptDetails([]);
  };

  const handleBackToAttempts = () => {
    setSelectedAttempt(null);
    setAttemptDetails([]);
  };

  const handleUpdateScore = async () => {
    if (!selectedQuiz || !selectedAttempt) return;

    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      setToast({
        message: "Please enter a valid score between 0 and 100",
        type: "error",
      });
      return;
    }

    setScoringLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setScoringLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${selectedQuiz.id}/stats/${selectedAttempt.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: score }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Preserve the student object from the current selectedAttempt
        setSelectedAttempt({
          ...data,
          student: selectedAttempt.student,
        });
        setToast({
          message: "Score updated successfully",
          type: "success",
        });
        // Refresh attempts list
        fetchAttempts(selectedQuiz.id);
      } else {
        throw new Error("Failed to update score");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to update score",
        type: "error",
      });
    } finally {
      setScoringLoading(false);
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
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <p className="text-muted-foreground">Loading classrooms...</p>
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
        // Classroom List View
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              View quiz performance and student statistics
            </p>
          </div>

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
                  <h3 className="font-semibold text-lg mb-3">
                    {classroom.name}
                  </h3>
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
        </>
      ) : !selectedQuiz ? (
        // Quiz List View
        <>
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToClassrooms}
              className="mb-4 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classrooms
            </Button>
            <h1 className="text-3xl font-bold mb-2">
              {selectedClassroom.name}
            </h1>
            <p className="text-muted-foreground">
              Select a quiz to view analytics
            </p>
          </div>

          {loadingQuizzes ? (
            <p className="text-muted-foreground">Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p className="text-muted-foreground">No quizzes found</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...quizzes].reverse().map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleQuizClick(quiz)}
                  className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        quiz.is_active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {quiz.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium text-foreground">
                        {quiz.question_count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deadline:</span>
                      <span className="font-medium text-foreground">
                        {new Date(quiz.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : !selectedAttempt ? (
        // Attempts List View
        <>
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToQuizzes}
              className="mb-4 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
            <h1 className="text-3xl font-bold mb-2">{selectedQuiz.title}</h1>
            <p className="text-muted-foreground">Student quiz attempts</p>
          </div>

          {loadingAttempts ? (
            <p className="text-muted-foreground">Loading attempts...</p>
          ) : attempts.length === 0 ? (
            <p className="text-muted-foreground">No attempts found</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...attempts].reverse().map((attempt) => (
                <div
                  key={attempt.id}
                  onClick={() => handleAttemptClick(attempt)}
                  className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {attempt.student.first_name[0]}
                        {attempt.student.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {attempt.student.first_name} {attempt.student.last_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        @{attempt.student.username}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Started: {formatDate(attempt.started_at)}</span>
                    </div>
                    {attempt.completed_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          Completed: {formatDate(attempt.completed_at)}
                        </span>
                      </div>
                    )}
                    {attempt.score && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Score:</span>
                          <span className="text-lg font-bold text-primary">
                            {parseFloat(attempt.score).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Attempt Details View
        <>
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToAttempts}
              className="mb-4 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Attempts
            </Button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedAttempt.student.first_name}{" "}
                  {selectedAttempt.student.last_name}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {selectedQuiz.title}
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Started: {formatDate(selectedAttempt.started_at)}</span>
                  {selectedAttempt.completed_at && (
                    <span>
                      Completed: {formatDate(selectedAttempt.completed_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score Input */}
            <div className="mt-6 p-4 border rounded-lg bg-card">
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-xs space-y-2">
                  <Label htmlFor="score">Score (0-100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </div>
                <Button
                  onClick={handleUpdateScore}
                  disabled={scoringLoading}
                  className="cursor-pointer"
                >
                  {scoringLoading ? "Updating..." : "Update Score"}
                </Button>
              </div>
            </div>
          </div>

          {/* Questions and Answers */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Question Attempts</h2>
            {loadingDetails ? (
              <p className="text-muted-foreground">Loading details...</p>
            ) : attemptDetails.length === 0 ? (
              <p className="text-muted-foreground">No details found</p>
            ) : (
              <div className="space-y-6">
                {attemptDetails.map((detail, index) => (
                  <div
                    key={detail.id}
                    className="p-6 border rounded-lg bg-card"
                  >
                    <div className="flex gap-3 mb-4">
                      <span className="font-semibold text-lg text-muted-foreground">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-lg mb-2">
                          {detail.question.text}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {detail.question.is_written ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                              Written Answer
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                              {detail.question.has_multiple_answers
                                ? "Multiple Choice"
                                : "Single Choice"}
                            </span>
                          )}
                          {detail.question.time_limit > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {detail.question.time_limit}s
                            </span>
                          )}
                        </div>

                        <Separator className="my-4" />

                        {/* Correct Answers */}
                        {detail.question.answers.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Correct Answer(s):
                            </p>
                            <div className="space-y-1">
                              {detail.question.answers
                                .filter((a) => a.is_correct)
                                .map((answer) => (
                                  <div
                                    key={answer.id}
                                    className="text-sm p-2 rounded bg-green-500/10 text-green-700 dark:text-green-400"
                                  >
                                    ✓ {answer.text}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Student Answers */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Student Answer(s):
                          </p>
                          <div className="space-y-1">
                            {detail.student_answers.map((answer) => (
                              <div
                                key={answer.id}
                                className={`text-sm p-2 rounded ${
                                  answer.is_correct
                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "bg-red-500/10 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {answer.is_correct ? "✓" : "✗"} {answer.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time Info */}
                        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                          <div className="flex gap-4">
                            <span>
                              Started: {formatDate(detail.started_at)}
                            </span>
                            <span>
                              Submitted: {formatDate(detail.submitted_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
