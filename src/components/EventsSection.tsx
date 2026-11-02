
"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:8000/events";

type Event = {
  _id: {
    $oid: string;
  } | string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  thumbnailUrl: string;
  description: string;
  organizer?: string;
  createdBy?: string;
};

const categoryColors: Record<string, string> = {
  Donation: "bg-red-100 text-red-600",
  Cleanup: "bg-green-100 text-green-700",
  Plantation: "bg-emerald-100 text-emerald-700",
  "Winter Relief": "bg-sky-100 text-sky-700",
  "Food Drive": "bg-orange-100 text-orange-700",
  "Health Camp": "bg-pink-100 text-pink-700",
  Education: "bg-violet-100 text-violet-700",
};

function getEventId(event: Event) {
  return typeof event._id === "string"
    ? event._id
    : event._id.$oid;
}

function formatEventDate(date: string) {
  // Supports DD/MM/YYYY and ISO date formats.
  const parts = date.split("/");

  const parsedDate =
    parts.length === 3
      ? new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        )
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load events (${response.status})`
          );
        }

        const data = await response.json();

        // Supports both a plain array and { events: [...] }.
        const eventList: Event[] = Array.isArray(data)
          ? data
          : data.events ?? [];

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingEvents = eventList
          .filter((event) => {
            const parts = event.eventDate.split("/");

            const date =
              parts.length === 3
                ? new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                  )
                : new Date(event.eventDate);

            return !Number.isNaN(date.getTime()) && date >= now;
          })
          .sort((a, b) => {
            const getDate = (date: string) => {
              const parts = date.split("/");

              return parts.length === 3
                ? new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                  ).getTime()
                : new Date(date).getTime();
            };

            return (
              getDate(a.eventDate) - getDate(b.eventDate)
            );
          });

        setEvents(upcomingEvents.slice(0, 6));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Recent Upcoming Events
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Be a part of these upcoming community events
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[460px] animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Please check your server and try again.
            </p>
          </div>
        )}

        {/* Event Cards */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {events.map((event) => (
              <article
                key={getEventId(event)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden lg:h-56">
                  <img
                    src={event.thumbnailUrl || "/images/hero.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category Badge */}
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm",
                      categoryColors[event.eventType] ??
                        "bg-gray-100 text-gray-700"
                    )}
                  >
                    {event.eventType}
                  </span>

                  {/* Event Date */}
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-semibold text-white">
                    <Calendar className="h-3.5 w-3.5 text-teal-400" />
                    {formatEventDate(event.eventDate)}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex flex-1 flex-col gap-3 p-5 lg:p-6">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                    <span>{event.location}</span>
                  </div>

                  <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="mt-auto border-t border-border pt-4">
                    <a
                      href={`/events/${getEventId(event)}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-violet-700 active:scale-95"
                    >
                      View Event
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl bg-gray-50 py-16 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              No Upcoming Events
            </h3>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new community events.
            </p>
          </div>
        )}

        {/* View All Events */}
        <div className="mt-10 flex justify-center lg:mt-16">
          <a
            href="/events"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-600 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50"
          >
            View All Events
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
