import { generateMetadata as genMeta } from "@/lib/seo"

export const metadata = genMeta({
  title: "Classrooms",
  description: "Manage your classrooms, join new classes, and collaborate with teachers and students on Assessify.",
  keywords: ["classrooms", "classroom management", "join classroom", "class enrollment", "online classroom"],
  url: "/home/classrooms",
  noIndex: true,
})
