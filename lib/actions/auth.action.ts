"use server";
// whenever in an action file, have to add 'use server' at the top

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // sign user-up logic
    // fetch user, check if user exists
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    // if user doesn't exist, create a new user
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully! Please sign in.",
    };
  } catch (e: any) {
    console.error("Error occurred while signing up:", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: "Failed to create an account.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  // get access to the user
  try {
    const userRecord = await auth.getUserByEmail(email);

    // when user not exist
    if (!userRecord) {
      return {
        success: false,
        message: "No user found with this email. Create an account first.",
      };
    }

    // if user exist, set the session cookie
    await setSessionCookie(idToken);
  } catch (e: any) {
    console.error("Error occurred while signing in:", e);

    return {
      success: false,
      message: "Failed to sign in.",
    };
  }
}

// this fx is used to generate the cookie that will be sent to the client after successful sign-in or sign-up, so can stay authenticated in subsequent requests
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

// Get the currently logged-in user based on the session cookie --> (later) figure out whether user is authenticated
export async function getCurrentUser(): Promise<User | null> {
  // Get the cookie from the request headers
  const cookieStore = await cookies();

  // Get the specific session cookie
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    // Verify the session cookie and decode it to get the user's information
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // checkRevoked = true to ensure the session is still valid and hasn't been revoked

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

    // either the session is invalid or expired, so clear the cookie
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  // !!cover the return type to boolean (true if user exists)
  return !!user;
}

//fetch all the interviews of a specific user
export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
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
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
