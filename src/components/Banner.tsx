
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Leaf, HeartHandshake } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-50 via-white to-green-50">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-24">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div className="space-y-7">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-green-800">
              <Leaf className="h-4 w-4" />
              Together for a Better Tomorrow
            </span>

            {/* Heading */}
            <div className="space-y-5">
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Social Development
                <span className="block bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                  Events Platform
                </span>
              </h1>

              <p className="max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
                Join community events, contribute to social causes,
                and be a part of positive change.
              </p>
            </div>

            {/* Action Buttons - Original Routes Preserved */}
            <div className="flex flex-col gap-4 sm:flex-row">

              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-600/30 active:scale-95"
              >
                <CalendarDays className="h-5 w-5" />
                Explore Upcoming Events
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/create-event"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 active:scale-95"
              >
                Create Event
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            {/* Community Message */}
            <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <HeartHandshake className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold text-slate-800">
                  Small Actions. Big Impact.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Together, we can build stronger communities.
                </p>
              </div>
            </div>

          </div>

          {/* Right Image */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">

            {/* Image Glow */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-200/60 to-green-200/60 opacity-80 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-2xl shadow-violet-900/10">

              <Image
                src="/images/hero.svg"
                alt="Volunteers planting a tree together"
                width={700}
                height={560}
                className="h-auto w-full rounded-[1.5rem] object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                priority
              />

            </div>

            {/* Floating Badge */}
            <div className="absolute -right-3 -top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-600/30 sm:-right-5 sm:-top-6">
              <Leaf className="h-8 w-8" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
