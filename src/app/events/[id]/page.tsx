
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const EVENT_IMAGE = "/images/hero.svg";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Event {
  id?: string;
  _id?: string;
  title: string;
  thumbnailUrl?: string;
  image?: string;
  bannerUrl?: string;
  date?: string;
  eventDate?: string;
  startDate?: string;
  time?: string;
  category?: string;
  eventType?: string;
  description?: string;
  location?: string;
  venue?: string;
  organizer?: string;
  organizerName?: string;
  participants?: number;
  status?: string;
}

function formatDate(value?: string): string {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params?.id as string;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });

      window.setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    []
  );

  // FETCH EVENT DETAILS
  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;

    const fetchEvent = async () => {
      setLoading(true);

      try {
        let res = await fetch(`${API_URL}/events/${eventId}`, {
          cache: "no-store",
        });

        if (
          res.ok &&
          res.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await res.json();
          const found = data?.event || data;

          if (found && typeof found === "object" && !cancelled) {
            setEvent(found);
            return;
          }
        }

        res = await fetch(`${API_URL}/events`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          const events = Array.isArray(data)
            ? data
            : data?.events || data?.data || [];

          const found = events.find(
            (e: Event) => e._id === eventId || e.id === eventId
          );

          if (found && !cancelled) {
            setEvent(found);
            return;
          }
        }

        if (!cancelled) {
          setEvent(null);
        }
      } catch (error) {
        console.error("Fetch Event Error:", error);

        if (!cancelled) {
          setEvent(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // CHECK USER JOIN STATUS
  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !user?.id ||
      !eventId ||
      !event
    ) {
      setJoined(false);
      return;
    }

    let cancelled = false;

    const checkJoinStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/events/${eventId}/join-status?userId=${encodeURIComponent(
            user.id
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) {
          setJoined(Boolean(data.joined));
        }
      } catch (error) {
        console.error("Join Status Error:", error);
      }
    };

    checkJoinStatus();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user?.id, eventId, event]);

  // JOIN / LEAVE EVENT
  const handleJoinLeave = async () => {
    if (!isAuthenticated || !user?.id) {
      showToast("Please login to join this event.", "error");
      router.push("/login");
      return;
    }

    if (!eventId || !event) return;

    // Database events must have MongoDB ObjectIds.
    if (!/^[a-fA-F0-9]{24}$/.test(eventId)) {
      showToast(
        "This demo event is not available for registration.",
        "error"
      );
      return;
    }

    setJoinLoading(true);

    try {
      let response: Response;

      if (joined) {
        // LEAVE EVENT
        response = await fetch(`${API_URL}/leave-event/${eventId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });
      } else {
        // JOIN EVENT
        response = await fetch(`${API_URL}/join-event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId,
            userId: user.id,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setJoined(!joined);

      setEvent((previous) =>
        previous
          ? {
              ...previous,
              participants:
                typeof data.participants === "number"
                  ? data.participants
                  : Math.max(
                      0,
                      (previous.participants || 0) + (joined ? -1 : 1)
                    ),
            }
          : previous
      );

      if (joined) {
        showToast(
          "You have successfully left this event!",
          "success"
        );
      } else {
        showToast(
          "Successfully joined this event!",
          "success"
        );
      }
    } catch (error) {
      console.error("Join/Leave Event Error:", error);

      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setJoinLoading(false);
    }
  };

  const imageSrc =
    event?.thumbnailUrl ||
    event?.image ||
    event?.bannerUrl ||
    EVENT_IMAGE;

  const eventDate =
    event?.date || event?.eventDate || event?.startDate;

  const category = event?.category || event?.eventType;

  const organizer = event?.organizer || event?.organizerName;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <p className="ml-3 text-muted-foreground">
          Loading event details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Event not found.</p>

        <Button
          onClick={() => router.push("/events")}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] max-w-sm rounded-xl px-5 py-4 shadow-lg text-white ${
            toast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => router.push("/events")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Events
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
              <div className="relative h-64 sm:h-80 lg:h-[420px]">
                <Image
                  src={imageSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />

                {category && (
                  <Badge className="absolute top-4 left-4 bg-violet-600 text-white">
                    {category}
                  </Badge>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {(event.location || event.venue) && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || event.venue}</span>
                    </div>
                  )}

                  {eventDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(eventDate)}</span>
                    </div>
                  )}

                  {event.time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4">
                About This Event
              </h2>

              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description ||
                  "No description available for this event."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">
                Event Information
              </h3>

              <div className="space-y-4">
                {eventDate && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                      <Calendar className="h-5 w-5 text-violet-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Date & Time
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {formatDate(eventDate)}
                      </p>

                      {event.time && (
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(event.location || event.venue) && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Location
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {event.location || event.venue}
                      </p>
                    </div>
                  </div>
                )}

                {organizer && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Organizer
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {organizer}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Participants
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {event.participants ?? 0} people registered
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  onClick={handleJoinLeave}
                  disabled={joinLoading}
                  className={`w-full ${
                    joined
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-violet-600 hover:bg-violet-700"
                  }`}
                >
                  {joinLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : joined ? (
                    "Joined (Click to Leave)"
                  ) : (
                    "Join This Event"
                  )}
                </Button>

                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
