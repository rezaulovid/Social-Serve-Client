"use client";

import { useEffect, useState, useMemo } from "react";
import { MapPin, Calendar, ChevronRight, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/events`;

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

const categories = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

function getEventId(event: Event) {
  return typeof event._id === "string" ? event._id : event._id.$oid;
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

  // New States for filtering and searching
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
            const getDate = (dateStr: string) => {
              const parts = dateStr.split("/");

              return parts.length === 3
                ? new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                  ).getTime()
                : new Date(dateStr).getTime();
            };

            return (
              getDate(a.eventDate) - getDate(b.eventDate)
            );
          });

        setEvents(upcomingEvents);
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

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.eventType === selectedCategory;
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Heading & Create Event Button */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 lg:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-3">
              <Calendar className="h-3.5 w-3.5" />
              Future Community Drives
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Upcoming Events
            </h2>

            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              Discover verified volunteer initiatives scheduled for upcoming dates. Past events are automatically excluded so you can focus on active drives that need support.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-teal-700 active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </div>

        {/* Filters and Search Bar Section */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all",
                  selectedCategory === category
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
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
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredEvents.map((event) => (
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
                    <Link
                      href={`/events/${getEventId(event)}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-teal-700 active:scale-95"
                    >
                      View Event
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-2xl bg-gray-50 py-16 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              No Events Found
            </h3>
            <p className="mt-2 text-muted-foreground">
              Try changing your search keywords or filter category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}