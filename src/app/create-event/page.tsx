"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ImageIcon,
  MapPinIcon,
  MegaphoneIcon,
  TagIcon,
  TypeIcon,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

const EVENT_TYPES = [
  "Donation",
  "Relief Drive",
  "Cleanup",
  "Tree Plantation",
  "Health Camp",
  "Education",
  "Plantation",
  "Health",
]

type FormData = {
  title: string
  eventType: string
  eventDate: string
  location: string
  thumbnailUrl: string
  description: string
}

const EMPTY_FORM: FormData = {
  title: "",
  eventType: "",
  eventDate: "",
  location: "",
  thumbnailUrl: "",
  description: "",
}

export default function CreateEventPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { show } = useToast()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  )
  const [submitting, setSubmitting] = useState(false)
  const [published, setPublished] = useState(false)

  const setField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const isFutureDate = (value: string): boolean => {
    if (!value) return false
    const normalized = value.replace(/-/g, "/")
    const parts = normalized.split("/")
    let date: Date
    if (parts.length === 3 && parts[0].length <= 2) {
      // dd/mm/yyyy
      const [d, m, y] = parts.map(Number)
      date = new Date(y, m - 1, d)
    } else {
      date = new Date(value)
    }
    if (Number.isNaN(date.getTime())) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  const isValidUrl = (value: string): boolean => {
    try {
      const url = new URL(value)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      show({ title: "Login required", description: "Please login to create an event", type: "error" })
      router.push("/login")
      return
    }

    const nextErrors: Partial<Record<keyof FormData, string>> = {}

    if (!form.title.trim()) nextErrors.title = "Event title is required"
    if (!form.eventType) nextErrors.eventType = "Event type is required"
    if (!form.eventDate) nextErrors.eventDate = "Event date is required"
    else if (!isFutureDate(form.eventDate))
      nextErrors.eventDate = "Date must be today or later"
    if (!form.location.trim()) nextErrors.location = "Location is required"
    if (!form.thumbnailUrl.trim())
      nextErrors.thumbnailUrl = "Thumbnail image URL is required"
    else if (!isValidUrl(form.thumbnailUrl))
      nextErrors.thumbnailUrl = "Enter a valid URL"
    if (!form.description.trim())
      nextErrors.description = "Event description is required"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch("http://localhost:8000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          eventType: form.eventType,
          category: form.eventType,
          eventDate: form.eventDate,
          date: form.eventDate,
          location: form.location,
          venue: form.location,
          thumbnailUrl: form.thumbnailUrl,
          image: form.thumbnailUrl,
          description: form.description,
          organizerEmail: user?.email,
          createdBy: user?.email,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create event")
      }

      show({ title: "Event created!", description: "Your event has been published", type: "success" })
      setSubmitting(false)
      setPublished(true)
      setTimeout(() => {
        router.push("/events")
      }, 1000)
    } catch (err: any) {
      show({ title: "Failed to create event", description: err.message || "Something went wrong", type: "error" })
      setSubmitting(false)
    }
  }

  const publishedContent = (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-teal-100 p-3 mb-4">
          <ArrowRightIcon className="size-6 text-teal-600" />
        </div>
        <h2 className="text-2xl font-semibold">Event Published</h2>
        <p className="mt-2 text-muted-foreground">
          Your community event is now live.
        </p>
        <Button
          onClick={() => {
            setPublished(false)
            setForm(EMPTY_FORM)
          }}
          className="mt-4"
        >
          Create Another Event
        </Button>
      </div>
    </div>
  )

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto"
      noValidate
    >
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60">
        <div
          className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 mb-4"
        >
          <MegaphoneIcon className="size-4" />
          Social Service Drive
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Create a Community Event
        </h1>
        <p className="text-muted-foreground mb-8">
          Organize a local relief effort, environmental cleanup, or community
          support drive.
        </p>

        <div className="grid gap-6">
          {/* Event Title */}
          <div className="col-span-full relative">
            <TypeIcon
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            />
            <Label className="text-sm font-medium">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={cn(
                errors.title ? "border-destructive pl-8" : "pl-8"
              )}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <Separator className="my-6" />

          {/* Event Type + Event Date */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative">
              <TagIcon
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              />
              <Label className="text-sm font-medium">
                Event Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.eventType}
                onValueChange={(value) => setField("eventType", value ?? "")}
              >
                <SelectTrigger
                  className={cn(
                    errors.eventType ? "border-destructive" : undefined,
                    "pl-8"
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <SelectValue
                      placeholder="Select event type"
                      className="flex-1"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.eventType}
                </p>
              )}
            </div>

            <div className="relative">
              <CalendarIcon
                className="absolute inset-y-0 right-2.5 size-4 text-muted-foreground pointer-events-none"
              />
              <Label className="text-sm font-medium">
                Event Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="dd / mm / yyyy"
                value={form.eventDate}
                onChange={(e) => setField("eventDate", e.target.value)}
                className={cn(
                  errors.eventDate ? "border-destructive pr-10" : "pr-10"
                )}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Dates must be in the future (today or later)
              </p>
              {errors.eventDate && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.eventDate}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Location / Venue */}
          <div className="col-span-full relative">
            <MapPinIcon
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            />
            <Label className="text-sm font-medium">
              Location / Venue <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Mohammadpur Town Hall, Dhaka"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              className={cn(
                errors.location ? "border-destructive pl-8" : "pl-8"
              )}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-destructive">
                {errors.location}
              </p>
            )}
          </div>

          {/* Thumbnail Image URL */}
          <div className="col-span-full relative">
            <ImageIcon
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            />
            <Label className="text-sm font-medium">
              Thumbnail Image URL <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="https://images.unsplash.com/photo-..."
              value={form.thumbnailUrl}
              onChange={(e) => setField("thumbnailUrl", e.target.value)}
              className={cn(
                errors.thumbnailUrl ? "border-destructive pl-8" : "pl-8",
                "border-teal-500 focus-visible:border-teal-500 focus-visible:ring-teal-500/50"
              )}
            />
            {errors.thumbnailUrl && (
              <p className="mt-1 text-xs text-destructive">
                {errors.thumbnailUrl}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Quick photo presets:{" "}
              <span
                className="ml-1 text-teal-600 hover:underline cursor-pointer"
                onClick={() =>
                  setField(
                    "thumbnailUrl",
                    "https://images.unsplash.com/photo-1518947813861-d37907eb9929"
                  )
                }
              >
                Winter Clothes
              </span>{" "}
              <span className="mx-1 text-muted-foreground">·</span>{" "}
              <span
                className="ml-1 text-teal-600 hover:underline cursor-pointer"
                onClick={() =>
                  setField(
                    "thumbnailUrl",
                    "https://images.unsplash.com/photo-1587203971102-63a9e899e468"
                  )
                }
              >
                Blanket Relief
              </span>{" "}
              <span className="mx-1 text-muted-foreground">·</span>{" "}
              <span
                className="ml-1 text-teal-600 hover:underline cursor-pointer"
                onClick={() =>
                  setField(
                    "thumbnailUrl",
                    "https://images.unsplash.com/photo-1532983731860-4a14776e2728"
                  )
                }
              >
                Cleanup
              </span>{" "}
              <span className="mx-1 text-muted-foreground">·</span>{" "}
              <span
                className="ml-1 text-teal-600 hover:underline cursor-pointer"
                onClick={() =>
                  setField(
                    "thumbnailUrl",
                    "https://images.unsplash.com/photo-1473656727196-237c0991e566"
                  )
                }
              >
                Tree Plantation
              </span>
            </p>
          </div>

          <Separator className="my-6" />

          {/* Event Description */}
          <div className="col-span-full">
            <Label className="text-sm font-medium">
              Event Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Explain the purpose of the drive, volunteers required, items being distributed or tasks to complete..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={errors.description ? "border-destructive" : undefined}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* Organizer Email */}
          <div className="col-span-full">
            <div className="rounded-lg border border-input bg-muted px-3 py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Organizer Email attached:
              </span>
              <span className="text-sm font-medium">
                mypti@mailinator.com
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            className="w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <ArrowRightIcon className="size-4 mr-2" />
                Publish Event
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.push("/events")}
          className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary underline-offset-4"
        >
          <ChevronLeftIcon className="size-4" />
          Back to Upcoming Events
        </button>
      </nav>
      {published ? publishedContent : formContent}
    </div>
  )
}
