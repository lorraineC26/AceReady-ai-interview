# Module 1: Meet AceReady

### Teaching Arc
- **Metaphor:** A flight simulator — pilots practice dangerous situations safely before the real thing. AceReady is a job interview simulator.
- **Opening hook:** "Imagine you're about to interview for your dream job. What if you could practice with a real AI interviewer first — one that asks the actual questions and grades your answers?"
- **Key insight:** AceReady chains together 4 separate services (voice, AI, database, web framework) into one seamless experience. Understanding where one service ends and another begins is the key to debugging and extending it.
- **"Why should I care?":** Knowing the user journey end-to-end means you can tell your AI coding tool exactly which step to fix when something breaks.

### Code Snippets (pre-extracted)

File: app/(root)/page.tsx (lines 18-22)
```typescript
const [userInterviews, latestInterviews] = await Promise.all([
  getInterviewsByUserId(user.id),
  getLatestInterviews({ userId: user.id }),
]);
```

### Interactive Elements

- [x] **Flow diagram (static)** — 5-step user journey: Create Interview → Voice Interview → Transcript Saved → Gemini Grades → View Feedback
- [x] **Architecture diagram** — 4 zones: Browser (Next.js), Voice (Vapi), AI (Gemini), Storage (Firebase). Click each component to see what it does.
- [x] **Code↔English translation** — Promise.all for parallel fetch (lines 18-22 above)
- [x] **Quiz** — 3 scenario questions about the user journey and which layer to investigate when something breaks
- [x] **Glossary tooltips** — API, SDK, full-stack, server-side, client-side, async, parallel

### Reference Files to Read
- `references/interactive-elements.md` → "Multiple-Choice Quizzes", "Interactive Architecture Diagram", "Flow Diagrams", "Callout Boxes", "Code ↔ English Translation Blocks", "Glossary Tooltips"
- `references/design-system.md` → Module Structure section
- `references/content-philosophy.md` → always include
- `references/gotchas.md` → always include

### Connections
- **Previous module:** None — this is the first module
- **Next module:** The Cast of Characters — will zoom in on each actor introduced here
- **Tone/style notes:** Accent color is teal (#2A7B9B). Actor colors: Browser=actor-1 (teal-ish), Vapi=actor-2, Gemini=actor-3, Firebase=actor-4. Module uses `--color-bg-warm` (odd module).
