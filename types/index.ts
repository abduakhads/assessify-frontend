// User and Authentication Types
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

// Classroom Types
export interface Classroom {
  id: number;
  name: string;
  description?: string;
  teacher: User;
  student_count?: number;
}

// Quiz Types
export interface Quiz {
  id: number;
  title: string;
  classroom: number | Classroom;
  created_at: string;
  deadline: string;
  is_active: boolean;
  allowed_attempts: number;
  question_count: number;
}

// Attempt Types
export interface StudentQuizAttempt {
  id: number;
  student: number;
  quiz: number;
  started_at: string;
  completed_at: string | null;
  score: string | null;
}

// Question and Answer Types
export interface Answer {
  id: number;
  question: number;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  quiz: number;
  text: string;
  order: number;
  has_multiple_answers: boolean;
  is_written: boolean;
  time_limit: number;
  answers: [];
}

export interface NextQuestionResponse {
  id: number;
  question_attempt: number | null;
  next_question: Question | null;
}
