# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AceReady is an AI-powered mock interview platform built with Next.js 16, React 19, TypeScript, and Firebase. The application enables users to practice job interviews with AI and receive feedback on their performance.

## Development Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **React**: 19.2.3 with React Compiler enabled
- **Styling**: Tailwind CSS 4 with custom animations
- **Database**: Firebase (Firestore for data, Firebase Auth for authentication)
- **UI Components**: Radix UI primitives, shadcn/ui patterns
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: Day.js
- **Notifications**: Sonner for toast messages

## Architecture

### Route Structure

The app uses Next.js App Router with route groups:

- **`(root)/`** - Main authenticated area (home page, interview listings)
- **`(auth)/`** - Authentication pages (sign-in, sign-up)
- Each route group has its own layout

### Firebase Setup

Two separate Firebase configurations:

- **`firebase/client.ts`** - Client-side Firebase (auth, firestore)
  - Uses `NEXT_PUBLIC_*` environment variables
  - Exports `auth` and `db` instances

- **`firebase/admin.ts`** - Server-side Firebase Admin SDK
  - Uses private environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
  - Initializes once and returns singleton instances
  - Used for server-side operations and API routes

### Type Definitions

All shared TypeScript interfaces are in `types/index.d.ts`:
- `Interview` - Interview data structure
- `Feedback` - Feedback and scoring data
- `User` - User account data
- Component props interfaces (InterviewCardProps, etc.)
- API parameter types

### Components Organization

- **`components/ui/`** - Reusable UI primitives (button, input, form, label, sonner)
- **`components/`** - Feature components:
  - `AuthForm.tsx` - Handles sign-in/sign-up with unified form
  - `InterviewCard.tsx` - Displays interview cards with feedback status
  - `DisplayTechIcons.tsx` - Renders tech stack icons
  - `FormField.tsx` - Wrapper for form inputs with validation

### Constants & Utilities

- **`constants/index.ts`** - Tech stack mappings, interview covers, dummy data
  - `mappings` - Normalizes tech stack names (e.g., "react.js" → "react")
  - `interviewCovers` - Array of company logo paths for interview cards
  - `dummyInterviews` - Sample interview data for development

- **`lib/utils.ts`** - Utility functions (cn for className merging, etc.)

### Styling

- **Path alias**: `@/` maps to project root
- **Dark mode**: Application runs in dark-only theme (enforced in root layout)
- **Custom font**: Mona Sans from Google Fonts
- **Pattern background**: Applied via `pattern` class on body

## Environment Variables

Required environment variables (see `.env.example`):

**Server-side (Firebase Admin)**:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY` (escaped newlines handled automatically)
- `FIREBASE_CLIENT_EMAIL`

**Client-side (Firebase Client)**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Key Implementation Notes

### React Compiler
- React Compiler is enabled (`reactCompiler: true` in next.config.ts)
- Automatic optimization of React components
- Follow React best practices to maximize benefits

### Authentication Flow
- `AuthForm` component handles both sign-in and sign-up
- Form type determined by `type` prop ("sign-in" | "sign-up")
- Uses Zod schema that conditionally requires name field for sign-up
- Currently shows success toasts but needs Firebase Auth integration

### Interview Data Model
- Interviews have: role, level, type, techstack, questions
- `finalized` flag indicates if interview is complete
- Feedback is linked via `interviewId` and includes:
  - Total score and category scores
  - Strengths and areas for improvement
  - Final assessment text

### Tech Stack Icon Handling
- Use `mappings` constant to normalize tech names before displaying
- DisplayTechIcons component handles rendering of tech stack badges

### Date Formatting
- Day.js is used throughout for date formatting
- Standard format: "MMM D, YYYY" (e.g., "Feb 19, 2024")

## Git Workflow

Repository uses conventional commits. Recent commits show pattern:
- Feature commits: "setup firebase client side", "created DisplayIcon compo"
- Fix commits: "fixed the layout issue for homepg"
- Reorganization: "reorged compo location"

Main branch is `main`. Current status is clean.
