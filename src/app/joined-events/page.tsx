
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Loader2,
  LogIn,
  Heart,
  LogOut,
} from "lucide-react";

interface JoinedEvent {
  _id: string;
  id?: string;
  title: string;
  eventType?: string;
  eventDate?: string;
  date?: string;
  location: string;
  thumbnailUrl?: string;
  description?: string;
  participants?: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function JoinedEventsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchJoinedEvents = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/joined-events?userId=${encodeURIComponent(user.id)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load joined events.");
      }

      const joinedEvents = Array.isArray(data)
        ? data
        : data.events || data.data || [];

      setEvents(joinedEvents);
    } catch (err) {
      console.error("Joined Events Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading events."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }

    fetchJoinedEvents();
  }, [authLoading, isAuthenticated, user?.id, fetchJoinedEvents]);

  const handleLeaveEvent = async (eventId: string) => {
    if (!user?.id || !eventId) {
      showToast("Please login to leave this event.", "error");
      return;
    }

    setLeavingId(eventId);

    try {
      const response = await fetch(
        `${API_URL}/leave-event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave event.");
      }

      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) => (event._id || event.id) !== eventId
        )
      );

      showToast(
        "You have successfully left this event!",
        "success"
      );
    } catch (err) {
      console.error("Leave Event Error:", err);

      showToast(
        err instanceof Error
          ? err.message
          : "Failed to leave event.",
        "error"
      );
    } finally {
      setLeavingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading your joined events...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <LogIn className="w-14 h-14 text-violet-600 mx-auto mb-5" />

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Login Required
          </h1>

          <p className="text-gray-500 mb-6">
            Please login to see your joined events.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-4 rounded-xl shadow-lg text-white flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-violet-600 mb-3">
            <Heart size={22} />
            <span className="font-semibold tracking-wide uppercase text-sm">
              My Activities
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            My Joined Events
          </h1>

          <p className="text-gray-600 max-w-2xl">
            Manage the events you have joined and stay connected
            with your community activities.
          </p>
        </div>

        {/* Event Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            You have joined{" "}
            <span className="font-bold text-violet-600">
              {events.length}
            </span>{" "}
            {events.length === 1 ? "event" : "events"}.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
            <p className="text-red-600 font-medium">{error}</p>

            <button
              onClick={fetchJoinedEvents}
              className="mt-3 text-red-700 underline font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && events.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-violet-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Joined Events Yet
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-7">
              You have not joined any events yet. Explore
              upcoming events and become part of a positive
              community.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Joined Events Grid */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {events.map((event) => {
              const eventId = event._id || event.id || "";
              const eventDate = event.eventDate || event.date;

              return (
                <div
                  key={eventId}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition duration-300"
                >
                  {/* Event Image */}
                  <div className="relative h-52 bg-gray-100">
                    {event.thumbnailUrl ? (
                      <Image
                        src={event.thumbnailUrl}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}

                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      JOINED
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="p-6">
                    <span className="inline-block text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full mb-3">
                      {event.eventType || "Community Event"}
                    </span>

                    <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                      {event.title}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <Calendar
                          size={17}
                          className="text-violet-600 shrink-0"
                        />
                        <span>
                          {eventDate
                            ? new Date(eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Date not available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <MapPin
                          size={17}
                          className="text-violet-600 shrink-0"
                        />
                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <Users
                          size={17}
                          className="text-violet-600 shrink-0"
                        />
                        <span>
                          {event.participants || 0} Volunteers
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/events/${eventId}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-violet-600 text-violet-600 hover:bg-violet-50 py-3 rounded-lg font-semibold transition text-sm"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>

                      <button
                        onClick={() => handleLeaveEvent(eventId)}
                        disabled={leavingId === eventId}
                        className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {leavingId === eventId ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <LogOut size={17} />
                        )}
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
