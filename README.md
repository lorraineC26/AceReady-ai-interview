<div align="center">
  <img src="public/logo.svg" alt="AceReady Logo" width="60" />
  <h1>AceReady</h1>
  <p>AI-powered mock interview platform — practice real interviews with a voice AI, get instant structured feedback.</p>

  <a href="https://ai-mock-interview-aceready.vercel.app/">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="#getting-started">Quick Start</a> &nbsp;·&nbsp;
  <a href="#features">Features</a>

  <br />

  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Vapi-7C3AED?style=for-the-badge&logo=webrtc&logoColor=white" alt="Vapi" />
</div>

<br />
<br />

---

## Overview

**AceReady** helps job seekers prepare for interviews by simulating realistic, role-specific interviews with an AI voice agent. After each session, **Google Gemini** analyzes your responses and generates a detailed scorecard across five key competency areas — so you always know where to improve.

---

## Screenshots

### User Authentication

<!-- ![User Authentication](public/screenshots/authentication.png) -->
![User Authentication](public/screenshots/authentication2.png)

### Landing Page

![Landing Page](public/screenshots/landing.png)

### Interview Session

![Interview Session](public/screenshots/Interview_Session.png)

### Feedback & Scorecard

![Feedback](public/screenshots/feedback_take1.png)

### Mobile View

<p>
  <img src="public/screenshots/mobile1.png" width="30%" alt="Mobile View 1" hspace="8" />
  <img src="public/screenshots/mobile2.png" width="30%" alt="Mobile View 2" hspace="8" />
  <img src="public/screenshots/mobile3.png" width="30%" alt="Mobile View 3" hspace="8" />
</p>

---

## Features

- **AI Voice Interviewer:** Real-time conversational interviews powered by Vapi. Speak naturally; no typing required.
- **Custom Interview Generation:** Tailor interviews by job role, level (entry / mid / senior), type (technical / behavioral / mixed), and tech stack.
- **Structured AI Feedback:** Powered by **Google Gemini**, the platform analyzes your transcript and scores you on five categories: Communication Skills, Technical Knowledge, Problem-Solving, Cultural & Role Fit, and Confidence & Clarity.
- **Interview Library:** Browse and retake interviews created by other users to diversify your practice.
- **Score Tracking:** Each feedback card shows your total score and per-category breakdown with actionable comments.
- **Authentication:** Secure sign-up / sign-in with **Firebase Auth** and httpOnly session cookies.

---

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| Language        | TypeScript                                     |
| Styling         | Tailwind CSS 4                                 |
| Database & Auth | Firebase (Firestore + Firebase Auth)           |
| Voice Agent     | Vapi (`@vapi-ai/web`)                          |
| AI / LLM        | Google Gemini 2.5 Flash Lite via Vercel AI SDK |
| UI Primitives   | Radix UI, shadcn/ui                            |
| Forms           | React Hook Form + Zod                          |
| Notifications   | Sonner                                         |
| Icons           | Lucide React                                   |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase](https://firebase.google.com/) project (Firestore + Auth enabled)
- A [Vapi](https://vapi.ai/) account with a workflow set up
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/mock-interview-platform.git
   cd mock-interview-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root and fill in the values below:

   ```env
   # Firebase Admin SDK (server-side)
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=

   # Firebase Client SDK (public)
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

   # AI & Voice
   GOOGLE_GENERATIVE_AI_API_KEY=
   NEXT_PUBLIC_VAPI_WEB_TOKEN=
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=
   ```

   > **Tip:** The `FIREBASE_PRIVATE_KEY` value from the Firebase console contains literal `\n` characters. Paste the entire string as-is — the app handles newline escaping automatically.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── (auth)/          # Sign-in & Sign-up pages
├── (root)/          # Protected pages
│   ├── page.tsx     # Dashboard
│   └── interview/
│       ├── page.tsx             # Generate a new interview
│       └── [id]/
│           ├── page.tsx         # Conduct interview
│           └── feedback/        # View feedback & scores
└── api/
    └── vapi/generate/           # Gemini question generation endpoint
```

---

<!-- ## Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server on port 3000 |
| `npm run build` | Build for production                  |
| `npm start`     | Start production server               |
| `npm run lint`  | Run ESLint                            |

--- -->

