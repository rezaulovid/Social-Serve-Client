import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Leaf,
  Plus,
  Users,
} from "lucide-react";

const stats = [
  { value: "10K+", label: "Active Volunteers", Icon: Users },
  { value: "500+", label: "Events Held", Icon: CalendarDays },
  { value: "50K+", label: "Lives Impacted", Icon: Heart },
];

const blobRadius = "55% 45% 47% 53% / 50% 43% 57% 50%";

function LeafSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M87 124C59 100 51 72 65 37C75 12 86 3 96 0C102 33 101 65 93 90C90 104 88 116 87 124Z"
        fill="#16a34a"
      />
      <path
        d="M92 122C86 95 91 68 108 51C116 43 121 41 124 43C119 67 109 92 92 122Z"
        fill="#4ade80"
      />
      <path
        d="M86 123C83 94 87 62 94 43"
        stroke="#14532d"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M42 122C30 103 32 82 46 60C56 44 65 38 73 38C72 64 64 91 42 122Z"
        fill="#22c55e"
      />
      <path
        d="M42 122C41 98 48 76 60 61"
        stroke="#14532d"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroLandscape() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
    >
      {/* Soft green skyline and trees */}
      <div className="absolute inset-x-0 bottom-16 h-28 opacity-80 sm:bottom-20 sm:h-36 lg:bottom-24 lg:h-40">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          <g fill="#86efac" fillOpacity="0.32">
            <path d="M0 200V146H36V124H52V146H88V108H104V146H148V120H170V146H206V96H220V146H244V132H264V146H302V114H318V146H354V84H372V146H412V118H432V146H470V136H488V146H530V100H548V146H580V124H598V146H640V72L700 20L760 72V146H806V116H824V146H866V96H884V146H930V128H948V146H986V110H1004V146H1040V82H1058V146H1104V118H1124V146H1168V100H1188V146H1230V130H1250V146H1290V108H1310V146H1352V88H1370V146H1410V126H1440V200H0Z" />
          </g>
          <path
            d="M680 200V66L700 22L720 66V200H680Z"
            fill="#5eead4"
            fillOpacity="0.35"
          />
          <g fill="#4ade80" fillOpacity="0.28">
            <circle cx="86" cy="147" r="19" />
            <circle cx="66" cy="158" r="14" />
            <circle cx="106" cy="158" r="14" />
            <circle cx="1190" cy="152" r="20" />
            <circle cx="1168" cy="163" r="14" />
            <circle cx="1212" cy="163" r="14" />
            <circle cx="1338" cy="145" r="17" />
            <circle cx="1320" cy="156" r="12" />
            <circle cx="1356" cy="156" r="12" />
          </g>
          <g stroke="#22c55e" strokeOpacity="0.22" strokeWidth="4">
            <path d="M86 200V160" />
            <path d="M1190 200V164" />
            <path d="M1338 200V158" />
          </g>
        </svg>
      </div>

      {/* Layered green and purple ground shapes */}
      <div className="relative h-28 w-full sm:h-36 lg:h-40">
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient
              id="hero-green-wave"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22c55e" stopOpacity="0.05" />
              <stop offset="0.5" stopColor="#16a34a" stopOpacity="0.16" />
              <stop offset="1" stopColor="#15803d" stopOpacity="0.24" />
            </linearGradient>
            <linearGradient
              id="hero-purple-wave"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6d28d9" stopOpacity="0.3" />
              <stop offset="0.45" stopColor="#8b5cf6" stopOpacity="0.15" />
              <stop offset="1" stopColor="#a78bfa" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient
              id="hero-green-wave-deep"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#15803d" stopOpacity="0.08" />
              <stop offset="0.55" stopColor="#15803d" stopOpacity="0.16" />
              <stop offset="1" stopColor="#14532d" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <path
            d="M0 92C240 48 420 122 700 96C960 72 1180 28 1440 60V180H0V92Z"
            fill="url(#hero-green-wave)"
          />
          <path
            d="M0 140C200 106 360 154 610 132C880 108 1120 122 1440 102V180H0V140Z"
            fill="url(#hero-purple-wave)"
          />
          <path
            d="M0 164C250 142 470 178 740 160C1040 140 1240 164 1440 150V180H0V164Z"
            fill="url(#hero-green-wave-deep)"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Banner() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#f8f2ff_0%,#ffffff_45%,#f5fff8_100%)]"
    >
      {/* Ambient background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-violet-200/45 blur-3xl" />
        <div className="absolute -right-40 -top-28 h-[34rem] w-[34rem] rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -right-20 top-24 h-72 w-72 rounded-full border-[34px] border-violet-100/40" />
        <div className="absolute right-[24%] top-4 hidden h-24 w-24 bg-[radial-gradient(circle,#a78bfa_1.2px,transparent_1.2px)] bg-[length:11px_11px] opacity-20 lg:block" />
        <div className="absolute -left-24 top-1/2 hidden h-48 w-48 rounded-full bg-green-100/40 blur-2xl lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-28 pt-10 sm:px-8 sm:pb-32 sm:pt-14 lg:pb-40 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {/* Left content */}
          <div className="max-w-2xl">
            <div className="space-y-7 sm:space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/80 bg-lime-50/90 px-4 py-2.5 text-[13px] font-semibold text-green-800 shadow-sm shadow-green-900/5 sm:px-5 sm:text-[15px]">
                <Leaf
                  className="h-[18px] w-[18px] text-green-600"
                  aria-hidden="true"
                />
                Together for a Better Tomorrow
              </span>

              <div className="space-y-5">
                <h1
                  id="hero-heading"
                  className="text-[2.3rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-[#0c1535] sm:text-[clamp(2.8rem,4.7vw,4rem)]"
                >
                  <span className="block">Social Development</span>
                  <span className="block bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Events Platform
                  </span>
                </h1>

                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 xl:text-[1.35rem] xl:leading-9">
                  Join community events, contribute to social causes, and be a
                  part of positive change.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                <Link
                  href="/events"
                  className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/35 focus-visible:ring-4 focus-visible:ring-violet-300/60 focus-visible:outline-none active:translate-y-0 active:scale-[0.99] sm:w-auto"
                >
                  <CalendarDays
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Explore Upcoming Events</span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/create-event"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl border border-[#111a3e]/80 bg-white px-6 py-3.5 text-sm font-bold text-[#0c1535] shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50/60 hover:shadow-md focus-visible:ring-4 focus-visible:ring-violet-300/50 focus-visible:outline-none active:translate-y-0 active:scale-[0.99] sm:w-auto"
                >
                  <Plus className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Create Event
                </Link>
              </div>

              {/* Impact stats */}
              <dl
                aria-label="Community impact"
                className="grid grid-cols-3 divide-x divide-slate-200/90 border-t border-slate-200/70 pt-6"
              >
                {stats.map(({ value, label, Icon }) => (
                  <div
                    key={label}
                    className="flex min-w-0 items-center gap-2 px-3 first:pl-0 last:pr-0 sm:gap-3 sm:px-5"
                  >
                    <Icon
                      className="h-6 w-6 shrink-0 text-green-600 sm:h-7 sm:w-7 xl:h-9 xl:w-9"
                      strokeWidth={2.1}
                      aria-hidden="true"
                    />
                    <div className="flex min-w-0 flex-col">
                      <dt className="order-2 mt-0.5 text-[10px] leading-tight font-medium text-slate-500 sm:text-xs xl:text-sm">
                        {label}
                      </dt>
                      <dd className="order-1 text-base leading-tight font-extrabold text-[#0c1535] sm:text-xl xl:text-2xl">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-full bg-green-200/25 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-violet-200/35 blur-2xl"
            />

            <div className="relative">
              {/* Offset backing shape */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-2 translate-y-3 bg-green-600/10 sm:translate-x-3 sm:translate-y-4"
                style={{ borderRadius: blobRadius }}
              />

              {/* Organic image frame */}
              <div
                className="relative rotate-[-2deg] bg-[linear-gradient(140deg,#15803d_0%,#22c55e_42%,#84cc16_100%)] p-[9px] shadow-[0_30px_80px_-30px_rgba(21,128,61,0.55)] sm:p-3"
                style={{ borderRadius: blobRadius }}
              >
                <div
                  className="bg-white p-2 sm:p-2.5"
                  style={{ borderRadius: blobRadius }}
                >
                  <div
                    className="relative aspect-[7/6] w-full overflow-hidden bg-green-100"
                    style={{ borderRadius: blobRadius }}
                  >
                    <Image
                      src="/images/hero-volunteers.jpg"
                      alt="Community volunteers planting together in a garden"
                      fill
                      priority
                      sizes="(max-width: 640px) 92vw, (max-width: 1023px) 86vw, (max-width: 1280px) 46vw, 580px"
                      className="object-cover object-center"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-green-950/15 via-transparent to-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Greener Community badge */}
              <div className="absolute -right-1 top-6 z-20 h-28 w-28 sm:-right-4 sm:top-8 sm:h-32 sm:w-32 xl:h-36 xl:w-36">
                <svg
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full drop-shadow-[0_16px_28px_rgba(20,83,45,0.18)]"
                >
                  <path
                    d="M100.00 20.00 A24 24 0 0 1 140.00 30.72 A24 24 0 0 1 169.28 60.00 A24 24 0 0 1 180.00 100.00 A24 24 0 0 1 169.28 140.00 A24 24 0 0 1 140.00 169.28 A24 24 0 0 1 100.00 180.00 A24 24 0 0 1 60.00 169.28 A24 24 0 0 1 30.72 140.00 A24 24 0 0 1 20.00 100.00 A24 24 0 0 1 30.72 60.00 A24 24 0 0 1 60.00 30.72 A24 24 0 0 1 100.00 20.00 Z"
                    fill="#ffffff"
                    stroke="#dcfce7"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                  <Leaf
                    className="mb-1 h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />
                  <p className="text-[13px] leading-[1.05] font-extrabold text-green-700 sm:text-sm">
                    Greener
                    <br />
                    Community
                  </p>
                </div>
              </div>

              {/* Leaf accents */}
              <LeafSprig
                className="absolute -left-3 -top-7 z-20 h-20 w-[4.5rem] -rotate-12 drop-shadow-sm sm:-left-7 sm:-top-11 sm:h-28 sm:w-24"
              />
              <LeafSprig
                className="absolute -bottom-5 -right-2 z-20 h-20 w-[4.5rem] rotate-[155deg] drop-shadow-sm sm:-bottom-7 sm:right-1 sm:h-24 sm:w-20"
              />
            </div>
          </div>
        </div>
      </div>

      <HeroLandscape />
    </section>
  );
}
