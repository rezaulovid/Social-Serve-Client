
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/events";
const GALLERY_IMAGE = "/images/gallery-1.svg";

type Event = {
  _id: {
    $oid: string;
  } | string;
  title: string;
  thumbnailUrl?: string;
  eventDate?: string;
  location?: string;
};

function getEventId(event: Event) {
  return typeof event._id === "string"
    ? event._id
    : event._id.$oid;
}

export default function OurGallery() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load gallery (${response.status})`
          );
        }

        const data = await response.json();

        const eventList: Event[] = Array.isArray(data)
          ? data
          : data.events ?? [];

        // Show up to 10 event images.
        setEvents(eventList.slice(0, 10));
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
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

    fetchGallery();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Our Gallery
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Snapshots from our community initiatives
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200"
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

        {/* Gallery Images */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {events.map((event) => (
              <div
                key={getEventId(event)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-base-200 shadow-sm transition-shadow hover:shadow-lg"
              >
                <Image width={200}height={200}
                  src={event.thumbnailUrl || GALLERY_IMAGE}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = GALLERY_IMAGE;
                  }}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-sm font-semibold text-white">
                    {event.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-xl bg-gray-50 py-16 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              No Gallery Images Yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Community event photos will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
