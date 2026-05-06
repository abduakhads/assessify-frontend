import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://assessify.app",
  ),
  title: {
    default: "Assessify - AI-Powered Quiz & Assessment Platform",
    template: "%s | Assessify",
  },
  description:
    "Create, manage, and analyze quizzes with AI. Assessify offers role-based dashboards for teachers and students, classroom management, and detailed analytics.",
  keywords: [
    "online quiz platform",
    "AI quiz generator",
    "educational assessment",
    "classroom management",
    "quiz analytics",
    "student assessment",
    "teacher dashboard",
    "online learning",
    "quiz maker",
    "education technology",
  ],
  authors: [{ name: "Assessify Team" }],
  creator: "Assessify",
  publisher: "Assessify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logoself.png",
    shortcut: "/logoself.png",
    apple: "/logoself.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Assessify - AI-Powered Quiz & Assessment Platform",
    description:
      "Create, manage, and analyze quizzes with AI. Perfect for teachers and students.",
    siteName: "Assessify",
    images: [
      {
        url: "/logoself.png",
        width: 1200,
        height: 630,
        alt: "Assessify - AI-Powered Quiz Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assessify - AI-Powered Quiz & Assessment Platform",
    description:
      "Create, manage, and analyze quizzes with AI. Perfect for teachers and students.",
    images: ["/logoself.png"],
    creator: "@assessify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
