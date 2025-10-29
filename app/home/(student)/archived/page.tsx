"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, Award, Archive } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { StudentQuizAttempt } from "@/types";

export default function ArchivedQuizzes() {
  const [archivedAttempts, setArchivedAttempts] = useState<
    StudentQuizAttempt[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchivedAttempts() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attempts/archived/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setArchivedAttempts(data);
        } else {
          setError("Failed to fetch archived attempts");
        }
      } catch (err) {
        console.error("Error fetching archived attempts", err);
        setError("An error occurred while fetching archived attempts");
      } finally {
        setLoading(false);
      }
    }

    fetchArchivedAttempts();
  }, []);

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

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 90) return "text-green-600";
    if (numScore >= 75) return "text-blue-600";
    if (numScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Group attempts by quiz and count attempts per quiz
  const getQuizAttemptNumber = (attempt: StudentQuizAttempt) => {
    const quizAttempts = archivedAttempts
      .filter((a) => a.quiz === attempt.quiz)
      .sort(
        (a, b) =>
          new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
      );

    return quizAttempts.findIndex((a) => a.id === attempt.id) + 1;
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Archived Quizzes</h1>
        <p className="text-muted-foreground">Loading archived attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Archived Quizzes</h1>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Archived Quizzes</h1>
        <p className="text-muted-foreground">
          View your archived quiz attempts and past performance
        </p>
      </div>

      {archivedAttempts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center py-12">
            <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No archived quizzes</h3>
            <p className="text-muted-foreground">
              Quiz attempts from classrooms you were removed from will appear
              here
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Total archived attempts: {archivedAttempts.length}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...archivedAttempts].reverse().map((attempt) => (
              <div
                key={attempt.id}
                className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Quiz Name and Attempt Number */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {attempt.quiz_name || `Quiz ${attempt.quiz}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Attempt #{getQuizAttemptNumber(attempt)}
                    </p>
                  </div>

                  <Separator />

                  {/* Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>Score</span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        attempt.score
                          ? getScoreColor(attempt.score)
                          : "text-muted-foreground"
                      }`}
                    >
                      {attempt.score
                        ? `${parseFloat(attempt.score).toFixed(2)}%`
                        : "Not scored yet"}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Started</span>
                      </div>
                      <span>{formatDate(attempt.started_at)}</span>
                    </div>
                    {attempt.completed_at && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Completed</span>
                        </div>
                        <span>{formatDate(attempt.completed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
