# Module 5: The AI That Grades You

### Teaching Arc
- **Metaphor:** A customs officer with a checklist. When you cross the border, the officer doesn't accept a verbal story — they need your passport, a filled-out form, and specific answers to specific questions. Gemini is the same: you don't just send it a transcript and hope for a nice answer. You give it a strict form (the Zod schema) and it must fill it in exactly, or the data gets rejected.
- **Opening hook:** "After your interview ends, your words travel to Google's AI and come back as a structured scorecard. Here is exactly how that happens."
- **Key insight:** Gemini is used in two places: once to generate interview questions (a simple text prompt), and once to analyze the transcript and produce structured JSON feedback (a schema-constrained output). The schema is the critical piece — it means feedback always has the same shape, so the app can always display it the same way.
- **"Why should I care?":** Every time you want AI to produce structured data (not just text), you need a schema. Understanding this pattern means you can add new scoring categories, change the feedback format, or build entirely new AI features without breaking the UI.

### Code Snippets (pre-extracted)

File: constants/index.ts (lines 158-170) — feedbackSchema
```typescript
export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});
```

File: lib/actions/general.action.ts (lines 58-97) — createFeedback (just the generateText call)
```typescript
const formattedTranscript = transcript
  .map(
    (sentence: { role: string; content: string }) =>
      `- ${sentence.role}: ${sentence.content}\n`,
  )
  .join("");

const {
  output: {
    totalScore,
    categoryScores,
    strengths,
    areasForImprovement,
    finalAssessment,
  },
} = await generateText({
  model: google("gemini-2.5-flash-lite"),
  output: Output.object({ schema: feedbackSchema }),
  prompt: `
    You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
    Transcript:
    ${formattedTranscript}

    Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
    - **Communication Skills**: Clarity, articulation, structured responses.
    - **Technical Knowledge**: Understanding of key concepts for the role.
    - **Problem-Solving**: Ability to analyze problems and propose solutions.
    - **Cultural & Role Fit**: Alignment with company values and job role.
    - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
    `,
});
```

File: app/api/vapi/generate/route.ts (lines 20-37) — question generation prompt
```typescript
const { text: questions } = await generateText({
  model: google("gemini-2.5-flash-lite"),
  prompt: `Prepare questions for a job interview.
    The job role is ${role}.
    The job experience level is ${level}.
    The tech stack used in the job is: ${techstack}.
    The focus between behavioral and technical questions should lean towards: ${type}.
    The amount of questions required is: ${amount}.
    Please return only the questions, without any additional text.
    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
    Return the questions formatted like this:
    ["Question 1", "Question 2", "Question 3"]
    
    Thank you! <3
`,
});
```

### Interactive Elements

- [x] **Code↔English translation** — feedbackSchema Zod object (constants/index.ts lines 158-170)
- [x] **Flow animation (interactive)** — 7 steps from call-end to feedback page:
  - Actors: Agent Component, createFeedback, Gemini API, Firestore
  - Steps: call ends → transcript array built → sent to Gemini with schema → Gemini returns JSON → upsert to Firestore → feedbackId returned → router navigates to feedback page
- [x] **Pattern cards** — 5 scoring categories: Communication Skills, Technical Knowledge, Problem-Solving, Cultural & Role Fit, Confidence & Clarity. Each card: emoji, name, brief description of what's graded.
- [x] **Quiz** — 3 scenario questions about Gemini usage, schema validation, feedback bugs
- [x] **Callout box** — "Upsert = Update or Insert. If feedback already exists for this interview+user combination, the code UPDATES it. If not, it INSERTS a new one. This is how retaking an interview works — you get fresh feedback without duplicate records in the database."
- [x] **Glossary tooltips** — Zod schema, structured output, prompt engineering, upsert, JSON, API rate limit, token, model, inference

### Flow Animation Steps (data-steps JSON — NO apostrophes in labels):
```json
[
  {"highlight":"flow-actor-1","label":"The interview call ends. Agent has the full transcript array."},
  {"highlight":"flow-actor-1","label":"handleGenerateFeedback is called with all messages","packet":true,"from":"actor-1","to":"actor-2"},
  {"highlight":"flow-actor-2","label":"createFeedback formats the transcript into a readable string"},
  {"highlight":"flow-actor-2","label":"generateText sends the transcript + feedbackSchema to Gemini","packet":true,"from":"actor-2","to":"actor-3"},
  {"highlight":"flow-actor-3","label":"Gemini analyzes the transcript and returns a structured JSON object"},
  {"highlight":"flow-actor-2","label":"createFeedback receives the scores and checks for existing feedback","packet":true,"from":"actor-3","to":"actor-2"},
  {"highlight":"flow-actor-4","label":"Upsert: update if feedback exists, create if not","packet":true,"from":"actor-2","to":"actor-4"},
  {"highlight":"flow-actor-1","label":"feedbackId returned. Browser navigates to the feedback page.","packet":true,"from":"actor-2","to":"actor-1"}
]
```
Actors: flow-actor-1=Agent Component, flow-actor-2=createFeedback, flow-actor-3=Gemini API, flow-actor-4=Firestore

### Reference Files to Read
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Multiple-Choice Quizzes", "Code ↔ English Translation Blocks", "Pattern/Feature Cards", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → always include
- `references/gotchas.md` → always include — especially "Single quotes in step labels will break parsing"

### Connections
- **Previous module:** Your Voice, Live on the Wire — covered how transcripts are collected
- **Next module:** None — this is the final module
- **Tone/style notes:** Module uses `--color-bg-warm` (odd module). Accent teal. This is the climax of the course — the "magic" that makes AceReady feel intelligent.
