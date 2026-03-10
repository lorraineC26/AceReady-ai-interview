// whenever in an action file, have to add 'use server' at the top
"use server";

import { db } from "@/firebase/admin";

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
