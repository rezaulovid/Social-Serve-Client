"use client"

import React, { Suspense, useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const API_URL = (`${process.env.NEXT_PUBLIC_API_URL}/events`);
const EVENT_IMAGE = "/images/hero.svg"

export interface Event {
  id?: string
  _id?: string
  title: string
  thumbnailUrl?: string
  image?: string
  bannerUrl?: string
  date?: string
  eventDate?: string
  startDate?: string
  endDate?: string
  category?: string
  eventType?: string
  categoryColor?: string
  description?: string
  location?: string
  venue?: string
  status?: string
  href?: string
}

const defaultEvents: Event[] = [
  {
    id: "winter-clothes",
    title: "Winter Clothes Distribution",
    category: "Donation",
    categoryColor: "bg-green-100 text-green-700",
    location: "Mirpur 10, Dhaka",
    date: "Nov 10, 2026",
    href: "/events/winter-clothes",
  },
  {
    id: "tree-plantation",
    title: "Tree Plantation Drive",
    category: "Plantation",
    categoryColor: "bg-green-100 text-green-700",
    location: "Banani, Dhaka",
    date: "Nov 15, 2026",
    href: "/events/tree-plantation",
  },
  {
    id: "blood-donation",
    title: "Blood Donation Camp",
    category: "Health",
    categoryColor: "bg-red-100 text-red-700",
    location: "Gulshan, Dhaka",
    date: "Nov 20, 2026",
    href: "/events/blood-donation",
  },
]

function getImageSrc(event: Event): string {
  return event.thumbnailUrl || event.image || event.bannerUrl || EVENT_IMAGE
}

function getHref(event: Event): string {
  if (event.href) return event.href
  const id = event._id || event.id
  return id ? `/events/${id}` : "#"
}

function getCategoryColor(category?: string): string {
  if (!category) return "bg-green-100 text-green-700"
  const cat = category.toLowerCase()
  if (cat.includes("health") || cat.includes("blood")) return "bg-red-100 text-red-700"
  if (cat.includes("plant") || cat.includes("tree")) return "bg-green-100 text-green-700"
  if (cat.includes("educat")) return "bg-blue-100 text-blue-700"
  if (cat.includes("relief") || cat.includes("donat")) return "bg-amber-100 text-amber-700"
  if (cat.includes("clean")) return "bg-cyan-100 text-cyan-700"
  return "bg-green-100 text-green-700"
}

function EventCard({ event }: { event: Event }) {
  const imageSrc = getImageSrc(event)
  const eventDate = event.date || event.eventDate || event.startDate
  const category = event.category || event.eventType
  const categoryColor = event.categoryColor || getCategoryColor(category)

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-border bg-background overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-48 lg:h-56 overflow-hidden">
        <Image
          src={imageSrc}
          alt={event.title}
          width={600}
          height={400}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {category && (
          <span
            className={cn(
              "absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm",
              categoryColor
            )}
          >
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5 lg:p-6">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {event.title || "Untitled Event"}
        </h3>

        {(event.location || event.venue) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location || event.venue}</span>
          </div>
        )}

        {eventDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{eventDate}</span>
          </div>
        )}

        <a
          href={getHref(event)}
          className="mt-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl shadow-lg hover:bg-violet-700 hover:shadow-violet-600/30 transition-all active:scale-95"
        >
          View Event <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </article>
  )
}

function EventsList({ events }: { events: Event[] }) {
  const displayEvents = events.length > 0 ? events : defaultEvents

  return (
    <div className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {displayEvents.map((event, index) => (
        <EventCard key={event._id || event.id || event.title || index} event={event} />
      ))}
    </div>
  )
}

function EventsEmpty() {
  return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Loading upcoming events...</p>
    </div>
  )
}

function EventsListFetcher() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events")
        return res.json()
      })
      .then((data: any) => {
        if (Array.isArray(data)) {
          setEvents(data)
        } else if (data?.events) {
          setEvents(data.events)
        } else if (data?.data) {
          setEvents(data.data)
        } else {
          setEvents([])
        }
      })
      .catch(() => {
        setEvents([])
      })
  }, [])

  return <EventsList events={events} />
}

export default function UpComingEventsPage() {
  return (
    <section className="py-16 lg:py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
           Explore inspiring social service initiatives happening near you. Discover upcoming events, meet passionate volunteers, and be part of meaningful changes that bring communities together.
          </p>
          <div className="mt-6">
            <a
              href="/create-event"
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-violet-700 hover:shadow-violet-600/30 active:scale-95"
            >
              Create New Event
            </a>
          </div>
        </div>

        <Suspense fallback={<EventsEmpty />}>
          <EventsListFetcher />
        </Suspense>
      </div>
    </section>
  )
}
