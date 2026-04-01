"use server";
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";

//fetch all the interviews of a specific user
export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userID", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      userId: data.userID,
    };
  }) as Interview[];
}

//retrive a list of interviews created by other users
export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userID", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      userId: data.userID,
    };
  }) as Interview[];
}

//fetch a specific interview details
export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return (interview.data() as Interview) || null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`,
      )
      .join("");

    // migrate from generateObject to generateText due to deprecation
    // https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0#generateobject-and-streamobject-deprecation
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
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const existingFeedback = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    let feedbackId: string;

    if (!existingFeedback.empty) {
      // .docs[0] is a snapshot (read-only), .ref is a reference (read/write)
      const docRef = existingFeedback.docs[0].ref;
      await docRef.update({
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt: new Date().toISOString(),
      });
      feedbackId = docRef.id;
    } else {
      const newDoc = await db.collection("feedback").add({
        interviewId,
        userId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt: new Date().toISOString(),
      });
      feedbackId = newDoc.id;
    }

    return {
      success: true,
      feedbackId,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false, feedbackId: null };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
