import { Metadata, Viewport } from "next";
import {
  generateMetadata as genMeta,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateEducationalSchema,
} from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = genMeta({
  title: "AI-Powered Quiz & Assessment Platform for Education",
  description:
    "Create, manage, and analyze quizzes with AI. Perfect for teachers and students. Features role-based dashboards, classroom management, AI quiz generation, and detailed analytics.",
  keywords: [
    "AI quiz generator",
    "online quiz platform",
    "educational assessment tool",
    "classroom management software",
    "quiz maker for teachers",
    "student assessment platform",
    "AI-powered education",
    "quiz analytics",
    "online learning platform",
    "teacher dashboard",
    "student quiz portal",
    "automated grading",
  ],
  url: "/landing",
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const educationalSchema = generateEducationalSchema();

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalSchema),
        }}
      />
      {children}
    </>
  );
}
