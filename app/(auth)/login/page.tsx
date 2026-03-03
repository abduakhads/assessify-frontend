import { LoginForm } from "@/components/login-form";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata = genMeta({
  title: "Login",
  description:
    "Sign in to your Assessify account to access your quizzes, classrooms, and analytics dashboard.",
  keywords: [
    "login",
    "sign in",
    "assessify login",
    "quiz platform login",
    "teacher login",
    "student login",
  ],
  url: "/login",
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
