 "use client";

import { useState } from "react";
import {
  CalendarDays,
  Eye,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Tag,
  Trash2,
  Type,
  X,
} from "lucide-react";

type EventItem = {
  id: number;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  thumbnailUrl: string;
  description: string;
};

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "Community Clean-Up Campaign",
    eventType: "Environment",
    eventDate: "2026-11-12",
    location: "Dhaka, Bangladesh",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Join volunteers to clean public spaces and create a healthier environment for everyone.",
  },
  {
    id: 2,
    title: "Free Education for Children",
    eventType: "Education",
    eventDate: "2026-11-04",
    location: "Mirpur, Dhaka, Bangladesh",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Volunteer to teach underprivileged children and help them build a brighter future.",
  },
  {
    id: 3,
    title: "Winter Clothes Distribution",
    eventType: "Clothes Distribution",
    eventDate: "2026-12-10",
    location: "Mirpur 10, Dhaka",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Help distribute warm clothes to families who need support during winter.",
  },
  {
    id: 4,
    title: "Food Support for Families",
    eventType: "Food Distribution",
    eventDate: "2026-12-18",
    location: "Mohammadpur, Dhaka",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Work with local volunteers to provide essential food packages to families.",
  },
];
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export default function ManageMyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);

  const updateField = (field: keyof EventItem, value: string) => {
    if (!editingEvent) return;
    setEditingEvent({ ...editingEvent, [field]: value });
  };

  const saveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEvent) return;
    setEvents((current) =>
      current.map((item) =>
        item.id === editingEvent.id ? editingEvent : item
      )
    );
    setEditingEvent(null);
  };

  const confirmDelete = () => {
    if (!deletingEvent) return;
    setEvents((current) =>
      current.filter((item) => item.id !== deletingEvent.id)
    );
    setDeletingEvent(null);
  };
 return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            Organizer Dashboard
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Manage My Events
          </h1>
          <p className="mt-2 max-w-4xl text-base leading-7 text-slate-500 sm:text-lg">
            View, edit, and manage the social drives you have published. Only
            you have permission to edit or delete your created initiatives.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">No events found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Events you create will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-h-40 px-5 py-4">
                  <h2 className="text-lg font-semibold text-teal-600">
                    {event.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {event.location}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setViewingEvent(event)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                  >
                    <Eye size={17} /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEvent({ ...event })}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    <Pencil size={17} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingEvent(event)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-100 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-200"
                  >
                    <Trash2 size={17} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditingEvent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-event-title"
            className="my-6 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <h2
                  id="update-event-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  Update Event
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Modify the details for your social service initiative
                </p>
              </div>
              <button
                type="button"
                aria-label="Close update form"
                onClick={() => setEditingEvent(null)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={22} />
              </button>
            </div><form onSubmit={saveChanges} className="pt-6">
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Title
                  </span>
                  <span className="relative block">
                    <Type
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      required
                      value={editingEvent.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </span>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">
                      Event Type
                    </span>
                    <span className="relative block">
                      <Tag
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <select
                        required
                        value={editingEvent.eventType}
                        onChange={(e) =>
                          updateField("eventType", e.target.value)
                        }
                        className={`${inputClass} appearance-none pl-11`}
                      >
                        <option>Education</option>
                        <option>Environment</option>
                        <option>Food Distribution</option>
                        <option>Clothes Distribution</option>
                        <option>Healthcare</option>
                        <option>Other</option>
                      </select>
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">
                      Event Date
                    </span>
                    <span className="relative block">
                      <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        required
                        type="date"
                        value={editingEvent.eventDate}
                        onChange={(e) =>
                          updateField("eventDate", e.target.value)
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </span>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Location
                  </span>
                  <span className="relative block">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      required
                      value={editingEvent.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Thumbnail Image URL
                  </span>
                  <span className="relative block">
                    <ImageIcon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      required
                      type="url"
                      value={editingEvent.thumbnailUrl}
                      onChange={(e) =>
                        updateField("thumbnailUrl", e.target.value)
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">
                    Description
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={editingEvent.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>
 <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeletingEvent(null);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Trash2 size={25} />
            </div>
            <h2
              id="delete-event-title"
              className="mt-4 text-center text-xl font-bold text-slate-900"
            >
              Delete Event?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-600">
              Are you sure you want to delete this event? This action cannot be
              undone and will also remove all volunteer registrations.
            </p>
            <p className="mt-3 text-center text-sm font-semibold text-slate-800">
              {deletingEvent.title}
            </p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewingEvent.thumbnailUrl}
              alt={viewingEvent.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold">{viewingEvent.title}</h2>
                <button
                  type="button"
                  onClick={() => setViewingEvent(null)}
                  aria-label="Close event details"
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {viewingEvent.description}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                {viewingEvent.location} · {viewingEvent.eventDate}
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
