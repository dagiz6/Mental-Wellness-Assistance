"use server";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: "/",
      },
    });
    return { success: true, user: result?.user || null, error: null };
  } catch (err: any) {
    console.error("Sign up error:", err);
    const message = err?.message || "Failed to create account. Please try again.";
    // Check for common errors
    if (message.toLowerCase().includes("already exists") || message.toLowerCase().includes("duplicate")) {
      return { success: false, user: null, error: "An account with this email already exists." };
    }
    return { success: false, user: null, error: message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/",
      },
    });
    return { success: true, user: result?.user || null, error: null };
  } catch (err: any) {
    console.error("Sign in error:", err);
    const message = err?.message || "Invalid email or password.";
    if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("credentials")) {
      return { success: false, user: null, error: "Invalid email or password." };
    }
    return { success: false, user: null, error: message };
  }
};

export const signInSocial = async (provider: "google") => {
  // Return the redirect URL to the client instead of calling redirect() here.
  // This avoids the NEXT_REDIRECT error being thrown in server actions,
  // which causes the client-side catch block to fire and break navigation.
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/",
    },
  });
  return { url: url || null };
};

export const signOut = async () => {
  try {
    const result = await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (err: any) {
    console.error("Sign out error:", err);
    return { success: false, error: err?.message || "Failed to sign out." };
  }
};