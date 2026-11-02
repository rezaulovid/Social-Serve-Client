"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  if (submitted) {
    return (
      <section className="py-12 lg:py-16 bg-violet-600 text-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm border border-white/10">
            <Mail className="h-4 w-4" />
            <span>You are subscribed! Thank you.</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-violet-600 text-white">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-4 items-center"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-violet-100">
                Get the latest events and updates directly in your inbox.
              </p>
            </div>
          </div>

          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 text-sm text-violet-900 placeholder:text-violet-900/60 rounded-xl bg-white/90 border border-white/20 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!email}
            className="px-6 py-3.5 text-sm font-semibold text-violet-600 bg-white rounded-xl shadow-lg hover:bg-violet-50 hover:shadow-violet-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            Subscribe <Send className="w-3.5 h-3.5 ml-1" />
          </button>
        </form>
      </div>
    </section>
  );
}
