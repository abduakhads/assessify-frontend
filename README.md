<p align="center">
	<img src="public/logo.svg" alt="Assessify Banner" width="400"/>
</p>

<h1 align="center">Assessify Frontend</h1>

<p align="center">
<b>Modern frontend for Assessify: a classroom quiz and assessment platform built with Next.js & TypeScript.</b>
</p>

---

## 🚀 Project Overview

Assessify Frontend is a responsive, user-friendly web client for the Assessify platform, enabling teachers and students to manage classrooms, take quizzes, and view analytics.

### ✨ Features

- **Role-based Dashboards:** Distinct interfaces for students and teachers, with tailored navigation and features.
- **Authentication Flows:** Secure login, registration, activation, password reset, and logout, fully integrated with backend JWT auth.
- **Quiz Management:** Students can attempt quizzes with per-question time limits; teachers can create, manage, and analyze quizzes.
- **Classroom Management:** Enroll in classrooms, view classroom lists, and manage students.
- **Comprehensive Analytics:** Teachers access detailed stats on student performance and quiz attempts.
- **Profile Management:** Edit profile, change password, update username, and delete account.
- **Modern UI:** Built with Radix UI, Tailwind CSS, and shadcn/ui for a clean, accessible experience.

### Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI & shadcn/ui
- Axios (API requests)

---

## 🛠️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/abduakhads/assessify-frontend.git
cd assessify-frontend
npm install
# or
yarn install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in required values:

```bash
cp .env.example .env.local
# Edit .env.local with your config
```

Required variables:

- `NEXT_PUBLIC_API_URL` (Assessify backend API URL)

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Linting

Run linter:

```bash
npm run lint
```

---

## 🏗️ Project Structure

```
frontend/
├── app/            # Next.js app directory (routing, layouts, pages)
├── components/     # UI components (forms, quiz, sidebar, etc.)
├── lib/            # API utilities (axios config, helpers)
├── public/         # Static assets (logo, favicon)
├── types/          # TypeScript types
├── utils/          # Auth and user utilities
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── ...
```

---

## 🏫 Main Pages & Features

- `/auth/login` — Login
- `/auth/register` — Register
- `/auth/activate` — Account activation
- `/auth/reset/password` — Password reset
- `/home/classrooms` — Classroom dashboard (student/teacher)
- `/home/archived` — Archived quizzes (student)
- `/home/analytics` — Analytics (teacher)
- `/home/profile` — Profile management

---

## 🏗️ Contributing

We welcome PRs! To contribute:

1. **Fork & branch** from `main`.
2. **Add/modify code**. All new features/bugfixes should include relevant tests or usage examples.
3. **Open a Pull Request**. The CI will run lint checks.
4. **Describe your change** clearly in the PR.

---

## ⚡ Development Tips

- **Hot reload:** Changes auto-update in development.
- **API integration:** All API calls use the URL from `NEXT_PUBLIC_API_URL`.
- **UI components:** Built with shadcn/ui and Radix UI for accessibility and style.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
