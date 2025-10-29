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
  students?: User[];
  student_count?: number;
}

export interface EnrollmentCode {
  code: string;
  classroom: number;
  is_active: boolean;
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
  answers: Answer[];
}

export interface NextQuestionResponse {
  id: number;
  question_attempt: number | null;
  next_question: Question | null;
}

// Analytics Types
export interface QuizAttemptStats {
  id: number;
  student: User;
  started_at: string;
  completed_at: string;
  score: string;
}

export interface StudentAnswer {
  id: number;
  question_attempt: number;
  text: string;
  is_correct: boolean;
}

export interface QuestionAttemptDetail {
  id: number;
  question: Question;
  started_at: string;
  submitted_at: string;
  student_answers: StudentAnswer[];
}
