# Module 3: Getting You In the Door

### Teaching Arc
- **Metaphor:** A hotel key card. When you check in (sign up/sign in), the front desk (Firebase Auth) encodes your room permissions onto a card (session cookie). Every time you swipe the card at a door (visit a page), the lock (server) reads the card — it doesn't call the front desk again for every swipe.
- **Opening hook:** "Every page of AceReady knows who you are without asking you to log in again. How?"
- **Key insight:** AceReady uses a two-part auth system: Firebase handles identity verification, but a server-side httpOnly session cookie handles persistence. The browser never directly touches the session cookie — only the server can read it.
- **"Why should I care?":** Auth bugs are the #1 cause of 'user can see X but not Y' issues. Understanding this flow means you can tell your AI tool exactly where the auth check is missing.

### Code Snippets (pre-extracted)

File: lib/actions/auth.action.ts (lines 79-94) — setSessionCookie
```typescript
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days in milliseconds
  });

  // Set the session cookie in the response headers
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true, // Cookie is only accessible via HTTPS
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    path: "/", // Cookie is valid for the entire site
    sameSite: "lax", // CSRF protection
  });
}
```

File: lib/actions/auth.action.ts (lines 97-127) — getCurrentUser
```typescript
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e) {
    console.error("Error occurred while verifying session cookie:", e);
    return null;
  }
}
```

### Interactive Elements

- [x] **Code↔English translation** — setSessionCookie (lines 79-94 above)
- [x] **Group chat animation** — Sign-in flow: Browser → Firebase Auth (client) → Server Action → Firebase Admin → cookieStore. 6 messages showing the full sign-in dance.
- [x] **Step cards** — 4 steps of the auth flow: 1. User enters email/password → 2. Firebase Auth verifies → 3. idToken issued → 4. Server creates httpOnly cookie
- [x] **Quiz** — 3 scenario questions about auth failures, cookie behavior, and where to add auth checks
- [x] **Callout box** — "Why httpOnly? JavaScript running in the browser (including injected scripts from ads or XSS attacks) cannot read httpOnly cookies. This prevents one of the most common security attacks on the web."
- [x] **Glossary tooltips** — httpOnly cookie, session, idToken, server action, CSRF, XSS, JWT, middleware, authentication vs authorization

### Chat Animation Content
Sign-in flow conversation:
Chat ID: chat-module3
Actors: Browser (actor-1, teal), Firebase Auth (actor-2, blue), Server (actor-3, plum)

1. Browser → Firebase Auth: "Here's the user's email and password. Can you verify them?"
2. Firebase Auth → Browser: "Verified! Here's a short-lived ID token (valid for 1 hour)."
3. Browser → Server: "I got this ID token from Firebase. Can you create a session?"
4. Server → Firebase Auth: "Is this ID token legitimate?" 
5. Firebase Auth → Server: "Yes, it belongs to user uid-abc123."
6. Server → Browser: "Session created. I've set an httpOnly cookie in your browser — you won't be able to read it, but I'll check it on every request."

### Reference Files to Read
- `references/interactive-elements.md` → "Group Chat Animation", "Multiple-Choice Quizzes", "Code ↔ English Translation Blocks", "Numbered Step Cards", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → always include
- `references/gotchas.md` → always include

### Connections
- **Previous module:** The Cast of Characters — introduced Firebase as the identity layer
- **Next module:** Your Voice, Live on the Wire — shifts focus to Vapi and the voice interface
- **Tone/style notes:** Module uses `--color-bg-warm` (odd module). Accent teal.
