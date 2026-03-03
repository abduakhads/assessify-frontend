import { generateMetadata as genMeta } from "@/lib/seo"

export const metadata = genMeta({
  title: "Analytics",
  description: "Track student performance, quiz results, and classroom analytics with Assessify's comprehensive dashboard.",
  keywords: ["quiz analytics", "student performance", "classroom analytics", "assessment metrics", "learning analytics"],
  url: "/home/analytics",
  noIndex: true,
})
