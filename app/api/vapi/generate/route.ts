import { generateText } from "ai";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";

export async function GET() {
  return Response.json(
    { success: true, data: "Hello from VAPI!" },
    { status: 200 },
  );
}

// a POST route to get the Qs generated from Gemini, and save in the new interview
// Google Generative AI Vercel SDK: https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
export async function POST(request: Request) {
  const {type, role, level,techstack, amount, userid} = await request.json();

  try {
    // rename text to questions for better readability
    const { text: questions } = await generateText({
      // gemini available models: https://ai.google.dev/gemini-api/docs/models
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

    // create a new Interview obj in the db to save the generated Qs
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions), // parse the questions back to array format
      userID: userid,
      finalized: true, // true since the Qs are generated and ready to use
      // TODO: later let user choose the company logo as the interview cover
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(), // 全球通用的标准格式
    };

    await db.collection("interviews").add(interview);

    return Response.json({success: true}, {status: 200});

  } catch (error) {
    console.error("Error in generating interview:", error);

    return Response.json({success: false, error}, {status: 500});
  }

}