// whenever in an action file, have to add 'use server' at the top
"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // sign user-up logic
    // fetch user, check if user exists
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }
    
    // if user doesn't exist, create a new user
    await db.collection('users').doc(uid).set({
      name, email
    })


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
      message: 'Failed to create an account.'
    }
  }
}

// this fx is used to generate the cookie that will be sent to the client after successful sign-in or sign-up, so can stay authenticated in subsequent requests
export async function setSesstionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days in milliseconds
  }); 

  // Set the session cookie in the response headers
  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK, 
    httpOnly: true, // Cookie is only accessible via HTTPS
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/', // Cookie is valid for the entire site
    sameSite: 'lax', // CSRF protection
  })

}
