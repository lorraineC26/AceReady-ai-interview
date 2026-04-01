# Module 2: The Cast of Characters

### Teaching Arc
- **Metaphor:** A film production crew — the director calls the shots (Next.js), the voice actor performs (Vapi), the fact-checker verifies (Gemini), and the records department keeps everything filed (Firebase). Each has one clear job.
- **Opening hook:** "You've seen the app from the outside. Now let's meet everyone backstage."
- **Key insight:** AceReady is built from 5 distinct technologies, each expert at exactly one thing. Understanding their roles means you can tell your AI tool which file to open instead of saying 'fix the interview page.'
- **"Why should I care?":** When you can name the actors, you can give precise instructions to AI coding tools and catch it when it touches the wrong file.

### Code Snippets (pre-extracted)

File: firebase/admin.ts (lines 1-27) — the singleton Firebase Admin init
```typescript
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  // make sure only one instance of the app is initialized
  if(!apps.length) {
    initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // replace escaped newlines with actual newlines
        })
      }
    )
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
```

File: lib/vapi.sdk.ts — Vapi SDK initialization (mention it initializes Vapi with a public token)

File: constants/index.ts (lines 100-156) — the interviewer assistant config (just the voice/model section)
```typescript
export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [/* system prompt */],
  },
};
```

### Interactive Elements

- [x] **Pattern cards** — 5 cards, one per technology: Next.js (the framework), Firebase Auth (identity), Firestore (database), Vapi (voice), Gemini (AI brain). Each card: icon, name, one-line job description, actor color border.
- [x] **Code↔English translation** — firebase/admin.ts singleton pattern (above)
- [x] **Group chat animation** — actors: Next.js Page, Firebase Admin, Vapi SDK. A page load conversation: Page asks Firebase "who is this user?", Firebase checks the cookie, returns the user, Page renders their interviews.
- [x] **Quiz** — 3 scenario questions about which actor to blame/check when specific things break
- [x] **Glossary tooltips** — singleton, SDK, environment variable, credential, provider, TypeScript, runtime, server-side rendering

### Chat Animation Content
Chat actors and messages:
1. Next.js Page → Firebase Admin: "Someone's loading the dashboard. Is this session cookie valid?"
2. Firebase Admin → Next.js Page: "Yes — it's User #abc123. Here's their profile."
3. Next.js Page → Firestore: "Give me all interviews for User #abc123, newest first."
4. Firestore → Next.js Page: "Here are 3 interviews."
5. Next.js Page (system): "Renders the dashboard with the user's interview cards."

Chat IDs: chat-module2
Actor colors: Next.js=actor-1 (#2A7B9B), Firebase=actor-4 (#D4A843), Firestore=actor-5 (#2D8B55)

### Reference Files to Read
- `references/interactive-elements.md` → "Group Chat Animation", "Multiple-Choice Quizzes", "Pattern/Feature Cards", "Code ↔ English Translation Blocks", "Glossary Tooltips"
- `references/content-philosophy.md` → always include
- `references/gotchas.md` → always include

### Connections
- **Previous module:** Meet AceReady — introduced the user journey and high-level architecture
- **Next module:** Getting You In the Door — will zoom into Firebase Auth specifically
- **Tone/style notes:** Module uses `--color-bg` (even module). Accent teal. Pattern cards use actor colors for border-top.
