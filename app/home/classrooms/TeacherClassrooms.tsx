"use client";

import { useEffect, useState } from "react";
import { Plus, Users, ArrowLeft, Edit, Trash2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Toast } from "@/components/ui/toast";
import type { Classroom, Quiz, Question, Answer } from "@/types";

export default function TeacherClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateQuizDialog, setShowCreateQuizDialog] = useState(false);
  const [showEditQuizDialog, setShowEditQuizDialog] = useState(false);
  const [showDeleteQuizDialog, setShowDeleteQuizDialog] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [editClassroomName, setEditClassroomName] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDeadline, setQuizDeadline] = useState("");
  const [quizIsActive, setQuizIsActive] = useState(true);
  const [quizAllowedAttempts, setQuizAllowedAttempts] = useState(1);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createQuizLoading, setCreateQuizLoading] = useState(false);
  const [editQuizLoading, setEditQuizLoading] = useState(false);
  const [deleteQuizLoading, setDeleteQuizLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] =
    useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [hasMultipleAnswers, setHasMultipleAnswers] = useState(false);
  const [isWritten, setIsWritten] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ text: string; is_correct: boolean; id?: number }>
  >([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [deleteQuestionLoading, setDeleteQuestionLoading] = useState(false);
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

  const handleCreateClassroom = async () => {
    if (!classroomName.trim()) {
      setToast({ message: "Please enter a classroom name", type: "error" });
      return;
    }

    setCreateLoading(true);
    setToast(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setCreateLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: classroomName,
          }),
        }
      );

      if (res.ok) {
        setToast({
          message: "Classroom created successfully!",
          type: "success",
        });
        setShowCreateDialog(false);
        setClassroomName("");
        // Refresh classrooms list
        await fetchClassrooms();
      } else {
        try {
          const data = await res.json();
          setToast({
            message: data.detail || "Failed to create classroom",
            type: "error",
          });
        } catch {
          setToast({ message: "Failed to create classroom", type: "error" });
        }
      }
    } catch (err) {
      console.error("Error creating classroom", err);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleClassroomClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setEditClassroomName(classroom.name);
    fetchQuizzes(classroom.id);
  };

  const handleBack = () => {
    setSelectedClassroom(null);
    setQuizzes([]);
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

  const handleEditClassroom = async () => {
    if (!selectedClassroom || !editClassroomName.trim()) {
      setToast({ message: "Please enter a classroom name", type: "error" });
      return;
    }

    setEditLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setEditLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${selectedClassroom.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editClassroomName,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSelectedClassroom(data);
        setToast({
          message: "Classroom updated successfully",
          type: "success",
        });
        setShowEditDialog(false);
        await fetchClassrooms();
      } else if (res.status === 404) {
        const errorData = await res.json();
        setToast({
          message: errorData.detail || "Classroom not found",
          type: "error",
        });
      } else {
        throw new Error("Failed to update classroom");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to update classroom",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClassroom = async () => {
    if (!selectedClassroom) return;

    setDeleteLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setDeleteLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/classrooms/${selectedClassroom.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 204) {
        setToast({
          message: "Classroom deleted successfully",
          type: "success",
        });
        setShowDeleteDialog(false);
        setShowEditDialog(false);
        setSelectedClassroom(null);
        await fetchClassrooms();
      } else if (res.status === 404) {
        const errorData = await res.json();
        setToast({
          message: errorData.detail || "Classroom not found",
          type: "error",
        });
      } else {
        throw new Error("Failed to delete classroom");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to delete classroom",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!selectedClassroom || !quizTitle.trim() || !quizDeadline) {
      setToast({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    if (quizAllowedAttempts < 1) {
      setToast({
        message: "Allowed attempts must be at least 1",
        type: "error",
      });
      return;
    }

    setCreateQuizLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setCreateQuizLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: quizTitle,
            classroom: selectedClassroom.id,
            deadline: quizDeadline,
            is_active: quizIsActive,
            allowed_attempts: quizAllowedAttempts,
          }),
        }
      );

      if (res.status === 201) {
        setToast({
          message: "Quiz created successfully!",
          type: "success",
        });
        setShowCreateQuizDialog(false);
        setQuizTitle("");
        setQuizDeadline("");
        setQuizIsActive(true);
        setQuizAllowedAttempts(1);
        await fetchQuizzes(selectedClassroom.id);
      } else {
        try {
          const data = await res.json();
          setToast({
            message: data.detail || "Failed to create quiz",
            type: "error",
          });
        } catch {
          setToast({ message: "Failed to create quiz", type: "error" });
        }
      }
    } catch (err) {
      console.error("Error creating quiz", err);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setCreateQuizLoading(false);
    }
  };

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizTitle(quiz.title);
    setQuizDeadline(quiz.deadline.slice(0, 16));
    setQuizIsActive(quiz.is_active);
    setQuizAllowedAttempts(quiz.allowed_attempts);
    fetchQuestions(quiz.id);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuestions([]);
  };

  const fetchQuestions = async (quizId: number) => {
    setLoadingQuestions(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions?quiz=${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEditQuiz = async () => {
    if (!selectedQuiz || !quizTitle.trim() || !quizDeadline) {
      setToast({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    if (quizAllowedAttempts < 1) {
      setToast({
        message: "Allowed attempts must be at least 1",
        type: "error",
      });
      return;
    }

    setEditQuizLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setEditQuizLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${selectedQuiz.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: quizTitle,
            deadline: quizDeadline,
            is_active: quizIsActive,
            allowed_attempts: quizAllowedAttempts,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSelectedQuiz(data);
        setToast({
          message: "Quiz updated successfully",
          type: "success",
        });
        setShowEditQuizDialog(false);
        if (selectedClassroom) {
          await fetchQuizzes(selectedClassroom.id);
        }
      } else {
        throw new Error("Failed to update quiz");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to update quiz",
        type: "error",
      });
    } finally {
      setEditQuizLoading(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    setDeleteQuizLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setDeleteQuizLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${selectedQuiz.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 204) {
        setToast({
          message: "Quiz deleted successfully",
          type: "success",
        });
        setShowDeleteQuizDialog(false);
        setShowEditQuizDialog(false);
        setSelectedQuiz(null);
        if (selectedClassroom) {
          await fetchQuizzes(selectedClassroom.id);
        }
      } else {
        throw new Error("Failed to delete quiz");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to delete quiz",
        type: "error",
      });
    } finally {
      setDeleteQuizLoading(false);
    }
  };

  const handleOpenQuestionDialog = (question?: Question) => {
    if (question) {
      // Edit mode
      setEditingQuestion(question);
      setQuestionText(question.text);
      setHasMultipleAnswers(question.has_multiple_answers);
      setIsWritten(question.is_written);
      setTimeLimit(question.time_limit);
      setAnswers(
        question.answers.map((a) => ({
          text: a.text,
          is_correct: a.is_correct,
          id: a.id,
        }))
      );
    } else {
      // Create mode
      setEditingQuestion(null);
      setQuestionText("");
      setHasMultipleAnswers(false);
      setIsWritten(false);
      setTimeLimit(0);
      setAnswers([{ text: "", is_correct: false }]);
    }
    setShowQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setShowQuestionDialog(false);
    setEditingQuestion(null);
    setQuestionText("");
    setHasMultipleAnswers(false);
    setIsWritten(false);
    setTimeLimit(0);
    setAnswers([]);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", is_correct: false }]);
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAnswerTextChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const handleAnswerCorrectChange = (index: number, isCorrect: boolean) => {
    const newAnswers = [...answers];
    if (!hasMultipleAnswers && isCorrect) {
      // If single answer, uncheck all others
      newAnswers.forEach((a, i) => {
        a.is_correct = i === index;
      });
    } else {
      newAnswers[index].is_correct = isCorrect;
    }
    setAnswers(newAnswers);
  };

  const handleSaveQuestion = async () => {
    if (!selectedQuiz || !questionText.trim()) {
      setToast({ message: "Please enter question text", type: "error" });
      return;
    }

    if (isWritten && (!answers[0] || !answers[0].text.trim())) {
      setToast({
        message: "Please enter a reference answer for grading",
        type: "error",
      });
      return;
    }

    if (!isWritten && answers.filter((a) => a.text.trim()).length === 0) {
      setToast({ message: "Please add at least one answer", type: "error" });
      return;
    }

    if (!isWritten && !answers.some((a) => a.is_correct)) {
      setToast({
        message: "Please mark at least one answer as correct",
        type: "error",
      });
      return;
    }

    setQuestionLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setQuestionLoading(false);
      return;
    }

    try {
      // Create or update question
      const questionPayload = {
        quiz: selectedQuiz.id,
        text: questionText,
        has_multiple_answers: hasMultipleAnswers,
        is_written: isWritten,
        time_limit: timeLimit,
      };

      let questionId: number;

      if (editingQuestion) {
        // Update existing question
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${editingQuestion.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: questionText,
              has_multiple_answers: hasMultipleAnswers,
              is_written: isWritten,
              time_limit: timeLimit,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to update question");
        questionId = editingQuestion.id;
      } else {
        // Create new question
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/questions/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionPayload),
          }
        );

        if (res.status !== 201) throw new Error("Failed to create question");
        const data = await res.json();
        questionId = data.id;
      }

      // Handle answers for both written and non-written questions
      const validAnswers = isWritten
        ? answers.length > 0 && answers[0].text.trim()
          ? [{ ...answers[0], is_correct: true }]
          : []
        : answers.filter((a) => a.text.trim());

      // If editing, we need to handle existing answers
      if (editingQuestion) {
        const existingAnswerIds = editingQuestion.answers.map((a) => a.id);
        const currentAnswerIds = answers.filter((a) => a.id).map((a) => a.id!);

        // Delete removed answers
        const answersToDelete = existingAnswerIds.filter(
          (id) => !currentAnswerIds.includes(id)
        );
        for (const answerId of answersToDelete) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/answers/${answerId}/`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }
      }

      // Create or update answers
      for (const answer of validAnswers) {
        if (answer.id) {
          // Update existing answer
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/answers/${answer.id}/`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: answer.text,
                is_correct: answer.is_correct,
              }),
            }
          );
        } else {
          // Create new answer
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/answers/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: questionId,
              text: answer.text,
              is_correct: answer.is_correct,
            }),
          });
        }
      }

      setToast({
        message: editingQuestion
          ? "Question updated successfully"
          : "Question created successfully",
        type: "success",
      });
      handleCloseQuestionDialog();
      await fetchQuestions(selectedQuiz.id);
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to save question",
        type: "error",
      });
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!editingQuestion) return;

    setDeleteQuestionLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToast({ message: "No access token found", type: "error" });
      setDeleteQuestionLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${editingQuestion.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 204) {
        setToast({
          message: "Question deleted successfully",
          type: "success",
        });
        setShowDeleteQuestionDialog(false);
        handleCloseQuestionDialog();
        if (selectedQuiz) {
          await fetchQuestions(selectedQuiz.id);
        }
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to delete question",
        type: "error",
      });
    } finally {
      setDeleteQuestionLoading(false);
    }
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Classrooms</h1>
              <p className="text-muted-foreground">
                Manage your classrooms and assignments
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="cursor-pointer"
            >
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
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
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
              onClick={handleBack}
              className="mb-4 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classrooms
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedClassroom.name}
                </h1>
                <p className="text-muted-foreground">
                  Manage quizzes for this classroom
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(true)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Classroom
              </Button>
            </div>
          </div>

          {/* Quizzes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quizzes</h2>
              <Button
                onClick={() => setShowCreateQuizDialog(true)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>

            {loadingQuizzes ? (
              <p className="text-muted-foreground">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quiz to get started
                </p>
                <Button
                  onClick={() => setShowCreateQuizDialog(true)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
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
                        <span>Attempts:</span>
                        <span className="font-medium text-foreground">
                          {quiz.allowed_attempts}
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
          </div>
        </>
      ) : (
        // Quiz Detail View
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedQuiz.title}
                </h1>
                <p className="text-muted-foreground">
                  Manage questions for this quiz
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowEditQuizDialog(true)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Quiz
              </Button>
            </div>

            {/* Quiz Info */}
            <div className="mt-4 p-4 border rounded-lg bg-card">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-semibold text-lg">
                    {selectedQuiz.question_count}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Allowed Attempts</p>
                  <p className="font-semibold text-lg">
                    {selectedQuiz.allowed_attempts}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="font-semibold text-lg">
                    {new Date(selectedQuiz.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        selectedQuiz.is_active ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-semibold">
                      {selectedQuiz.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Questions</h2>
              <Button
                onClick={() => handleOpenQuestionDialog()}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {loadingQuestions ? (
              <p className="text-muted-foreground">Loading questions...</p>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first question to get started
                </p>
                <Button
                  onClick={() => handleOpenQuestionDialog()}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    onClick={() => handleOpenQuestionDialog(question)}
                    className="p-6 border rounded-lg bg-card hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-3 flex-1">
                        <span className="font-semibold text-lg text-muted-foreground">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-lg mb-2">
                            {question.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.is_written ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                                Written Answer
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">
                                {question.has_multiple_answers
                                  ? "Multiple Choice"
                                  : "Single Choice"}
                              </span>
                            )}
                            {question.time_limit > 0 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {question.time_limit}s
                              </span>
                            )}
                          </div>

                          {!question.is_written &&
                            question.answers.length > 0 && (
                              <div className="space-y-2 mt-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                  Answers:
                                </p>
                                {question.answers.map((answer) => (
                                  <div
                                    key={answer.id}
                                    className={`text-sm p-2 rounded ${
                                      answer.is_correct
                                        ? "bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {answer.is_correct && "✓ "}
                                    {answer.text}
                                  </div>
                                ))}
                              </div>
                            )}
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

      {/* Create Classroom Dialog */}
      <Dialog
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setClassroomName("");
        }}
        title="Create New Classroom"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classroom-name">Classroom Name</Label>
            <Input
              id="classroom-name"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              placeholder="Enter classroom name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateClassroom();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name for your classroom
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setClassroomName("");
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateClassroom}
              disabled={createLoading}
              className="cursor-pointer"
            >
              {createLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Classroom Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditClassroomName(selectedClassroom?.name || "");
        }}
        title="Edit Classroom"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-classroom-name">Classroom Name</Label>
            <Input
              id="edit-classroom-name"
              value={editClassroomName}
              onChange={(e) => setEditClassroomName(e.target.value)}
              placeholder="Enter classroom name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditClassroom();
                }
              }}
              autoFocus
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-destructive">Danger Zone</Label>
            <p className="text-sm text-muted-foreground">
              Deleting a classroom will permanently remove all quizzes,
              questions, and student data associated with it.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Classroom
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditClassroomName(selectedClassroom?.name || "");
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditClassroom}
              disabled={editLoading}
              className="cursor-pointer"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Classroom"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {selectedClassroom?.name}
            </span>
            ? This action cannot be undone and will permanently remove all
            associated data.
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteClassroom}
              disabled={deleteLoading}
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Delete Classroom"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Create Quiz Dialog */}
      <Dialog
        isOpen={showCreateQuizDialog}
        onClose={() => {
          setShowCreateQuizDialog(false);
          setQuizTitle("");
          setQuizDeadline("");
          setQuizIsActive(true);
          setQuizAllowedAttempts(1);
        }}
        title="Create New Quiz"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-deadline">Deadline</Label>
            <Input
              id="quiz-deadline"
              type="datetime-local"
              value={quizDeadline}
              onChange={(e) => setQuizDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-attempts">Allowed Attempts</Label>
            <Input
              id="quiz-attempts"
              type="number"
              min="1"
              value={quizAllowedAttempts}
              onChange={(e) =>
                setQuizAllowedAttempts(parseInt(e.target.value) || 1)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="quiz-active"
              checked={quizIsActive}
              onCheckedChange={(checked) => setQuizIsActive(checked === true)}
            />
            <Label htmlFor="quiz-active" className="cursor-pointer">
              Active (students can see and take this quiz)
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateQuizDialog(false);
                setQuizTitle("");
                setQuizDeadline("");
                setQuizIsActive(true);
                setQuizAllowedAttempts(1);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateQuiz}
              disabled={createQuizLoading}
              className="cursor-pointer"
            >
              {createQuizLoading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Quiz Dialog */}
      <Dialog
        isOpen={showEditQuizDialog}
        onClose={() => {
          setShowEditQuizDialog(false);
          if (selectedQuiz) {
            setQuizTitle(selectedQuiz.title);
            setQuizDeadline(selectedQuiz.deadline.slice(0, 16));
            setQuizIsActive(selectedQuiz.is_active);
            setQuizAllowedAttempts(selectedQuiz.allowed_attempts);
          }
        }}
        title="Edit Quiz"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-quiz-title">Quiz Title</Label>
            <Input
              id="edit-quiz-title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quiz-deadline">Deadline</Label>
            <Input
              id="edit-quiz-deadline"
              type="datetime-local"
              value={quizDeadline}
              onChange={(e) => setQuizDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quiz-attempts">Allowed Attempts</Label>
            <Input
              id="edit-quiz-attempts"
              type="number"
              min="1"
              value={quizAllowedAttempts}
              onChange={(e) =>
                setQuizAllowedAttempts(parseInt(e.target.value) || 1)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="edit-quiz-active"
              checked={quizIsActive}
              onCheckedChange={(checked) => setQuizIsActive(checked === true)}
            />
            <Label htmlFor="edit-quiz-active" className="cursor-pointer">
              Active (students can see and take this quiz)
            </Label>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-destructive">Danger Zone</Label>
            <p className="text-sm text-muted-foreground">
              Deleting a quiz will permanently remove all questions and student
              attempts associated with it.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowDeleteQuizDialog(true)}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Quiz
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditQuizDialog(false);
                if (selectedQuiz) {
                  setQuizTitle(selectedQuiz.title);
                  setQuizDeadline(selectedQuiz.deadline.slice(0, 16));
                  setQuizIsActive(selectedQuiz.is_active);
                  setQuizAllowedAttempts(selectedQuiz.allowed_attempts);
                }
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditQuiz}
              disabled={editQuizLoading}
              className="cursor-pointer"
            >
              {editQuizLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Quiz Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteQuizDialog}
        onClose={() => setShowDeleteQuizDialog(false)}
        title="Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {selectedQuiz?.title}
            </span>
            ? This action cannot be undone and will permanently remove all
            associated questions and student attempts.
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteQuizDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteQuiz}
              disabled={deleteQuizLoading}
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
            >
              {deleteQuizLoading ? "Deleting..." : "Delete Quiz"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Question/Answer Dialog */}
      <Dialog
        isOpen={showQuestionDialog}
        onClose={handleCloseQuestionDialog}
        title={editingQuestion ? "Edit Question" : "Add Question"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
          <div className="space-y-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Input
                id="question-text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is-written"
                checked={isWritten}
                onCheckedChange={(checked) => {
                  setIsWritten(checked === true);
                  if (checked) {
                    // Initialize with one answer for written questions
                    setAnswers([{ text: "", is_correct: true }]);
                  } else if (answers.length === 0) {
                    setAnswers([{ text: "", is_correct: false }]);
                  }
                }}
              />
              <Label htmlFor="is-written" className="cursor-pointer">
                Written Answer (no multiple choice options)
              </Label>
            </div>

            {!isWritten && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-multiple"
                  checked={hasMultipleAnswers}
                  onCheckedChange={(checked) =>
                    setHasMultipleAnswers(checked === true)
                  }
                />
                <Label htmlFor="has-multiple" className="cursor-pointer">
                  Allow multiple correct answers
                </Label>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time-limit">
                Time Limit (seconds, 0 for no limit)
              </Label>
              <Input
                id="time-limit"
                type="number"
                min="0"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {isWritten ? (
            <>
              <Separator />
              <div className="space-y-2 px-1">
                <Label htmlFor="written-answer">
                  Correct Answer (for reference)
                </Label>
                <Input
                  id="written-answer"
                  value={answers[0]?.text ?? ""}
                  onChange={(e) => {
                    const newAnswers = [
                      { text: e.target.value, is_correct: true },
                    ];
                    setAnswers(newAnswers);
                  }}
                  placeholder="Enter the expected answer or key points"
                />
                <p className="text-xs text-muted-foreground">
                  This will be used as a reference for grading written answers
                </p>
              </div>
            </>
          ) : (
            <>
              <Separator />
              <div className="space-y-3 px-1">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAnswer}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Answer
                  </Button>
                </div>

                <div className="space-y-2">
                  {answers.map((answer, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        checked={answer.is_correct}
                        onCheckedChange={(checked) =>
                          handleAnswerCorrectChange(index, checked === true)
                        }
                      />
                      <Input
                        value={answer.text}
                        onChange={(e) =>
                          handleAnswerTextChange(index, e.target.value)
                        }
                        placeholder={`Answer ${index + 1}`}
                        className="flex-1"
                      />
                      {answers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAnswer(index)}
                          className="cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Check the box to mark an answer as correct
                </p>
              </div>
            </>
          )}

          {editingQuestion && (
            <>
              <Separator />
              <div className="space-y-2 px-1">
                <Label className="text-destructive">Danger Zone</Label>
                <p className="text-sm text-muted-foreground">
                  Deleting a question will permanently remove it and all student
                  answers.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteQuestionDialog(true)}
                  className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Question
                </Button>
              </div>
            </>
          )}

          <div className="flex gap-2 justify-end px-1 pt-2">
            <Button
              variant="outline"
              onClick={handleCloseQuestionDialog}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuestion}
              disabled={questionLoading}
              className="cursor-pointer"
            >
              {questionLoading
                ? "Saving..."
                : editingQuestion
                ? "Save Changes"
                : "Create Question"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Question Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteQuestionDialog}
        onClose={() => setShowDeleteQuestionDialog(false)}
        title="Delete Question"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this question? This action cannot be
            undone and will permanently remove all associated answers and
            student responses.
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteQuestionDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteQuestion}
              disabled={deleteQuestionLoading}
              className="cursor-pointer bg-destructive hover:bg-destructive/90"
            >
              {deleteQuestionLoading ? "Deleting..." : "Delete Question"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
