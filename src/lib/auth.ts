
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("socialserve");

// Better Auth configuration
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true,
  },

  // Google Authentication
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
    },
  },

  // JWT Plugin
  plugins: [jwt()],

  // Session Configuration
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});

// Password Validation
export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  return null;
}

// Auth User Interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

// Local Storage Key
const STORAGE_KEY = "socialserve_user";

// Get Stored User
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// Save User
export function setStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// Remove User
export function removeStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
}
