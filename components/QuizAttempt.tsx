"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, AlertCircle } from "lucide-react";
import type { NextQuestionResponse } from "@/types";
import { q } from "framer-motion/client";

interface QuizAttemptProps {
  attemptId: number;
  quizId: number;
  onComplete: () => void;
}

export default function QuizAttempt({ attemptId, quizId, onComplete }: QuizAttemptProps) {
  const router = useRouter();
  const [questionData, setQuestionData] = useState<NextQuestionResponse | null>(
    null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Fetch next question
  const fetchNextQuestion = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attempts/${attemptId}/next-question/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data: NextQuestionResponse = await res.json();
        console.log("Next question response:", data);
        console.log("Answers:", data.next_question?.answers);
        setQuestionData(data);

        // Check if quiz is completed
        if (data.next_question === null) {
          // Quiz completed, redirect back
          router.push("/home/classrooms");
          return;
        }

        // Reset state for new question
        setSelectedAnswers([]);
        setWrittenAnswer("");
        setError(null);

        // Set timer if question has time limit
        if (
          data.next_question.time_limit &&
          data.next_question.time_limit > 0
        ) {
          setTimeRemaining(data.next_question.time_limit);
        } else {
          setTimeRemaining(null);
        }
      } else {
        setError("Failed to fetch question");
      }
    } catch (err) {
      console.error("Error fetching question", err);
      setError("An error occurred while fetching the question");
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!questionData?.question_attempt) {
      setError("No question attempt ID");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("No access token found");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        question_attempt: questionData.question_attempt,
        answers: questionData.next_question?.is_written
          ? [writtenAnswer]
          : selectedAnswers.map(String),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/answer-submit/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        // Fetch next question
        setLoading(true);
        await fetchNextQuestion();
      } else {
        setError("Failed to submit answer");
      }
    } catch (err) {
      console.error("Error submitting answer", err);
      setError("An error occurred while submitting the answer");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && questionData?.question_attempt) {
      submitAnswer();
    }
  }, [timeRemaining]);

  // Initial fetch
  useEffect(() => {
    fetchNextQuestion();
  }, [attemptId]);

  // Handle checkbox/radio selection
  const handleAnswerToggle = (answerId: number) => {
    if (!questionData?.next_question) return;

    if (questionData.next_question.has_multiple_answers) {
      // Multiple choice - checkbox
      setSelectedAnswers((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id !== answerId)
          : [...prev, answerId]
      );
    } else {
      // Single choice - radio
      setSelectedAnswers([answerId]);
    }
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading question...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-destructive">{error}</p>
          <Button
            onClick={() => router.push("/home/classrooms")}
            className="mt-4"
          >
            Back to Classrooms
          </Button>
        </div>
      </div>
    );
  }

  if (!questionData?.next_question) {
    return null; // Will redirect
  }

  const question = questionData.next_question;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Timer */}
      {timeRemaining !== null && timeRemaining > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Time Remaining:</span>
            </div>
            <span
              className={`text-2xl font-bold ${
                timeRemaining <= 10 ? "text-red-500" : "text-primary"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Question {question.order}</h2>
        <p className="text-lg">{question.text}</p>
      </div>

      <Separator className="mb-6" />

      {/* Answers */}
      <div className="space-y-4 mb-8">
        {question.is_written ? (
          // Written answer
          <div>
            <Label htmlFor="written-answer" className="text-base mb-2 block">
              Your Answer:
            </Label>
            <textarea
              id="written-answer"
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              className="w-full min-h-[200px] p-4 border rounded-lg bg-background"
              placeholder="Type your answer here..."
            />
          </div>
        ) : (
          // Multiple choice
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {question.has_multiple_answers
                ? "Select all that apply"
                : "Select one answer"}
            </p>
            {question.answers?.map((answer, index) => {
              const answerId = index;
              const isSelected = selectedAnswers.includes(answerId);
              return (
                <div
                  key={`answer-${answerId}-${index}`}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleAnswerToggle(answerId)}
                >
                  <Checkbox
                    id={`answer-${answerId}`}
                    checked={isSelected}
                    onCheckedChange={() => handleAnswerToggle(answerId)}
                    className={
                      question.has_multiple_answers ? "" : "rounded-full"
                    }
                  />
                  <Label
                    htmlFor={`answer-${answerId}`}
                    className="flex-1 cursor-pointer"
                  >
                    {answer}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={submitAnswer}
          disabled={
            submitting ||
            (question.is_written
              ? !writtenAnswer.trim()
              : selectedAnswers.length === 0)
          }
          size="lg"
        >
          {submitting ? "Submitting..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
