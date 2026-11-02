"use client";


import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";


type LoginPageProps = {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onGoogleLogin?: () => void;
  onRegisterClick?: () => void;
};


export default function LoginPage({
  onLogin,
  onGoogleLogin,
  onRegisterClick,
}: LoginPageProps) {
  const router = useRouter();
  const { login, signInWithGoogle } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onLogin) {
      onLogin({ email, password });
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      show({ title: "Login successful", description: "Welcome back!", type: "success" });
      // Fallback redirect in case router doesn't navigate
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err: any) {
      show({ title: "Login failed", description: err.message || "Invalid credentials", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f9] px-4 py-10">
      <section className="w-full max-w-[450px] rounded-[24px] 
      border border-slate-100
       bg-white px-7 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.09)]
        sm:px-9 sm:py-9">
        <div className="mx-auto flex h-12 w-12 items-center
         justify-center rounded-2xl bg-yellow-500
          text-white shadow-md shadow-emerald-500/20">
          <Heart size={24} strokeWidth={2.6} />
        </div>


        <header className="mt-3 text-center">
          <h1 className="text-[30px] font-extrabold tracking-tight
           text-slate-950">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to organize and join community events
          </p>
        </header>


        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold
               text-slate-800"
            >
              Email
            </label>


            <div className="flex h-12 items-center gap-3 rounded-xl border
             border-slate-200 bg-slate-50 px-4 transition
              focus-within:border-yellow-500 focus-within:ring-2
               focus-within:ring-emerald-100">
              <Mail size={18} className="shrink-0 text-slate-400" />


              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-full w-full bg-transparent text-sm
                 text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>


          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-800"
              >
                Password
              </label>


              {/* Visual reference only; password recovery is not implemented. */}
              <span className="text-xs font-semibold text-yellow-600">
                Forgot password?
              </span>
            </div>


            <div className="flex h-12 items-center gap-3 rounded-xl border
             border-slate-200 bg-slate-50 px-4 transition
              focus-within:border-yellow-500 focus-within:ring-2
               focus-within:ring-emerald-100">
              <LockKeyhole
                size={18}
                className="shrink-0 text-slate-400"
              />


              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-full w-full bg-transparent text-sm
                 text-slate-800 outline-none placeholder:text-slate-400"
              />


              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-slate-400 transition
                 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center 
            gap-2 rounded-xl bg-yellow-600 px-5 text-sm font-bold
             text-white shadow-md shadow-emerald-600/20 transition
              hover:bg-yellow-700 focus:outline-none focus:ring-4
               focus:ring-emerald-100 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"} <ArrowRight size={17} />
          </button>
        </form>


        <div className="my-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold tracking-wide text-slate-400">
            OR CONTINUE WITH
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>


        <button
          type="button"
          onClick={async () => {
            if (onGoogleLogin) {
              onGoogleLogin();
              return;
            }
            try {
              await signInWithGoogle();
            } catch (err: any) {
              show({ title: "Google sign in failed", description: err.message || "Something went wrong", type: "error" });
            }
          }}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition
           hover:bg-slate-50 focus:outline-none focus:ring-4
            focus:ring-slate-100"
        >
          <GoogleIcon />
          Continue with Google
        </button>


        <p className="mt-7 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              if (onRegisterClick) {
                onRegisterClick();
              } else {
                router.push("/register");
              }
            }}
            className="font-bold text-yellow-600 
            transition hover:text-yellow-700 hover:underline"
          >
            Register here
          </button>
        </p>
      </section>
    </main>
  );
}


function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
      <path
        fill="#FFC107"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.6c3.9-3.6 6.1-8.8 6.1-14.7Z"
      />
      <path
        fill="#FF3D00"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.2 39.5 16 44 24 44Z"
      />
      <path
        fill="#4CAF50"
        d="M12.6 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18Z"
      />
      <path
        fill="#1976D2"
        d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4 16 4 9.2 8.5 5.8 15l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
      />
    </svg>
  );
}
