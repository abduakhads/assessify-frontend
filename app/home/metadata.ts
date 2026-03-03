import { generateMetadata as genMeta } from "@/lib/seo"

export const metadata = genMeta({
  title: "Dashboard",
  description: "Your Assessify dashboard - manage classrooms, create quizzes, and view analytics.",
  keywords: ["dashboard", "quiz management", "classroom management", "student dashboard", "teacher dashboard"],
  url: "/home",
  noIndex: true, // Dashboard pages should not be indexed
})
