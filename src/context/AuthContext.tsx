"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authClient, signIn, signOut, signUp, useSession } from "@/lib/auth-client"

export interface AuthUser {
  id: string
  name: string
  email: string
  image?: string
  photoURL?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    name: string
    email: string
    photoURL?: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void> | void
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "socialserve_user"

function mapSessionUser(sessionUser: any): AuthUser {
  return {
    id: sessionUser?.id || sessionUser?._id || "",
    name: sessionUser?.name || sessionUser?.email?.split("@")[0] || "",
    email: sessionUser?.email || "",
    image: sessionUser?.image || sessionUser?.photoURL,
    photoURL: sessionUser?.photoURL || sessionUser?.image,
  }
}

function validatePassword(password: string): string | null {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    if (session?.user) {
      const mapped = mapSessionUser(session.user)
      setUser(mapped)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped))
      } catch {}
      setIsLoading(false)
    } else if (!isPending) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.email) {
            setUser(parsed)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
      setIsLoading(false)
    } else {
      // Still pending, keep loading true until we know
      setIsLoading(true)
    }
  }, [session, isPending])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const result = await signIn.email({
          email,
          password,
        })

        if (result?.error) {
          throw new Error(result.error.message || "Invalid email or password")
        }

        router.push("/")
      } catch (err: any) {
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const register = useCallback(
    async (data: {
      name: string
      email: string
      photoURL?: string
      password: string
    }) => {
      const passwordError = validatePassword(data.password)
      if (passwordError) {
        throw new Error(passwordError)
      }

      setIsLoading(true)
      try {
        const result = await signUp.email({
          name: data.name,
          email: data.email,
          password: data.password,
          image: data.photoURL,
        } as any)

        if (result?.error) {
          throw new Error(result.error.message || "Registration failed")
        }

        router.push("/")
      } catch (err: any) {
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch {}
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    // Clear cookies if possible
    try {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
    } catch {}
    setIsLoading(false)
    router.push("/login")
  }, [router])

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "google",
      })
    } catch (err: any) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

