# Module 4: Your Voice, Live on the Wire

### Teaching Arc
- **Metaphor:** A court reporter. During a deposition, the stenographer listens to everything said in the room and transcribes it in real-time. Vapi is that stenographer — it listens to the voice conversation, transcribes every word, and fires events your code can react to.
- **Opening hook:** "When you speak during an interview, your words travel through 3 systems before the AI can respond. Here's the journey."
- **Key insight:** The Agent component is entirely event-driven — it never actively listens. It registers handlers for specific events (call-start, message, speech-start) and the Vapi SDK calls those handlers when things happen. This is a fundamental pattern in interactive software called the Observer pattern.
- **"Why should I care?":** Understanding event-driven code is how you debug "the AI stopped responding mid-interview" — you know exactly which event handler to check.

### Code Snippets (pre-extracted)

File: components/Agent.tsx (lines 38-72) — the event listener setup
```typescript
useEffect(() => {
  const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
  const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

  const onMessage = (message: Message) => {
    if (message.type === "transcript" && message.transcriptType === "final") {
      const newMessage = { role: message.role, content: message.transcript };

      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const onSpeechStart = () => setIsSpeaking(true);
  const onSpeechEnd = () => setIsSpeaking(false);

  const onError = (error: Error) => console.log("Call error:", error);

  // Listen to VAPI events
  vapi.on("call-start", onCallStart);
  vapi.on("call-end", onCallEnd);
  vapi.on("message", onMessage);
  vapi.on("speech-start", onSpeechStart);
  vapi.on("speech-end", onSpeechEnd);
  vapi.on("error", onError);

  // Cleanup listeners on unmount
  return () => {
    vapi.off("call-start", onCallStart);
    vapi.off("call-end", onCallEnd);
    vapi.off("message", onMessage);
    vapi.off("speech-start", onSpeechStart);
    vapi.off("speech-end", onSpeechEnd);
    vapi.off("error", onError);
  };
}, []);
```

File: components/Agent.tsx (lines 92-105) — call status drives navigation
```typescript
useEffect(() => {
  if (callStatus === CallStatus.FINISHED) {
    if (type === "generate") {
      router.push("/");
    } else {
      handleGenerateFeedback(messages);
    }
  }

  if (callStatus === CallStatus.FINISHED) {
    router.push("/");
  }
}, [messages, callStatus, type, userId]);
```

File: components/Agent.tsx (lines 107-140) — handleCall shows two modes
```typescript
const handleCall = async () => {
  setCallStatus(CallStatus.CONNECTING);

  if (type === "generate") {
    await vapi.start(
      undefined,
      undefined,
      undefined,
      process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
      {
        variableValues: {
          username: userName,
          userid: userId,
        },
      },
    );
  } else {
    let formattedQuestions = "";
    if (questions) {
      formattedQuestions = questions
        .map((question) => `- ${question}`)
        .join("\n");
    }

    await vapi.start(interviewer, {
      variableValues: {
        questions: formattedQuestions,
      },
    });
  }
};
```

### Interactive Elements

- [x] **Code↔English translation** — the useEffect with vapi.on() event listeners (lines 38-72 above)
- [x] **Flow animation (interactive)** — 6 steps: You speak → Vapi transcribes → "message" event fires → onMessage handler checks transcriptType === "final" → newMessage added to state → when call ends, feedback generation starts
  - Actors: You (Microphone), Vapi SDK, Agent Component, React State
  - Steps: highlight actor, animate packet between actors
- [x] **Pattern cards** — 4 call states: INACTIVE, CONNECTING, ACTIVE, FINISHED. Each card explains what the app shows and what's possible in that state.
- [x] **Quiz** — 3 scenario questions about event handling, call states, and debugging voice issues
- [x] **Callout box** — "The Observer Pattern: instead of checking every millisecond 'did the call start yet?', the code says 'call me when it starts.' This is how all modern real-time apps work — from chat apps to stock tickers."
- [x] **Glossary tooltips** — event-driven, event listener, useEffect, WebSocket, real-time transcription, SDK, state management, Observer pattern, cleanup function

### Flow Animation Steps (data-steps JSON — NO apostrophes in labels):
```json
[
  {"highlight":"flow-actor-1","label":"You speak into the microphone"},
  {"highlight":"flow-actor-2","label":"Vapi streams your audio to Deepgram for transcription","packet":true,"from":"actor-1","to":"actor-2"},
  {"highlight":"flow-actor-2","label":"Deepgram returns a transcript segment marked as final"},
  {"highlight":"flow-actor-3","label":"Vapi fires a message event with the transcript","packet":true,"from":"actor-2","to":"actor-3"},
  {"highlight":"flow-actor-3","label":"onMessage handler checks: is this a final transcript?"},
  {"highlight":"flow-actor-4","label":"The new message is added to React state","packet":true,"from":"actor-3","to":"actor-4"},
  {"highlight":"flow-actor-4","label":"When the call ends, all messages are sent to Gemini for feedback"}
]
```
Actors: flow-actor-1=Microphone, flow-actor-2=Vapi SDK, flow-actor-3=Agent Component, flow-actor-4=React State

### Reference Files to Read
- `references/interactive-elements.md` → "Message Flow / Data Flow Animation", "Multiple-Choice Quizzes", "Code ↔ English Translation Blocks", "Pattern/Feature Cards", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → always include
- `references/gotchas.md` → always include — especially "Single quotes in step labels will break parsing"

### Connections
- **Previous module:** Getting You In the Door — covered how users authenticate
- **Next module:** The AI That Grades You — will cover what happens to the transcript after the call ends
- **Tone/style notes:** Module uses `--color-bg` (even module). Accent teal. Note: the flow-animation data-steps must use double quotes for the JSON and avoid apostrophes in labels.
