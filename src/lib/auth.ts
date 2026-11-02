import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("socialserve");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
    //...other options
  emailAndPassword: { 
    enabled: true, 
  }, 
   socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string, 
        } 
      }
});

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long"
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter"
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter"
  }
  return null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  photoURL?: string
}

const STORAGE_KEY = "socialserve_user"

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function removeStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}

