"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Heart, LockKeyhole, Mail, User, Image as ImageIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { show } = useToast()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await register(form)
      show({ title: "Account created!", description: "Welcome to SocialServe", type: "success" })
    } catch (err) {
      show({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center
     bg-[#f6f8f9] px-4 py-10">
      <section className="w-full max-w-[450px] rounded-[24px]
       border border-slate-100 bg-white px-7 py-8 
       shadow-[0_18px_45px_rgba(15,23,42,0.09)] sm:px-9 sm:py-9">
        {/* <div className="mx-auto flex h-12 w-12 items-center
         justify-center rounded-2xl bg-emerald-500
          text-white shadow-md shadow-emerald-500/20">
          <Heart size={24} strokeWidth={2.6} />
        </div> */}
        <p className="mx-auto flex h-12 w-12 items-center
         justify-center rounded-2xl  bg-emerald-500
          text-white shadow-md shadow-emerald-500/20 font-bold">Social</p>

        <header className="mt-3 text-center">
          <h1 className="text-[30px] font-extrabold tracking-tight text-slate-950">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Join SocialServe and start making a difference
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-800">
              Full name
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <User size={18} className="shrink-0 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Rezaul Islam"
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
              Email
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <Mail size={18} className="shrink-0 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="name@example.com"
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="photoURL" className="mb-2 block text-sm font-semibold text-slate-800">
              Profile photo URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <ImageIcon size={18} className="shrink-0 text-slate-400" />
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                value={form.photoURL}
                onChange={(event) => setForm({ ...form, photoURL: event.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800">
              Password
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <LockKeyhole size={18} className="shrink-0 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter your password"
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-slate-400 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Password must be at least 6 characters with one uppercase and one lowercase letter
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Create Account"} <ArrowRight size={17} />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
