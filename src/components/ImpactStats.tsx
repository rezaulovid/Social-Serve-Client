import { cn } from "@/lib/utils";
import { Users, Calendar, Plus, Activity, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Community Impact",
    description: "Make a difference together",
    icon: Users,
  },
  {
    title: "Join Events",
    description: "Be part of local activities",
    icon: Calendar,
    badge: "NEW",
  },
  {
    title: "Track Progress",
    description: "See your contribution",
    icon: Activity,
  },
  {
    title: "Grow Together",
    description: "Build a stronger community",
    icon: TrendingUp,
  },
];

export default function ImpactStats() {
  return (
    <section className="py-10 lg:py-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "grid gap-6 lg:gap-8",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/30 p-6 lg:p-8 text-center transition-all hover:bg-muted/50 relative"
              )}
            >
              <div className="flex items-center 
              justify-center h-10 w-10 rounded-lg
               bg-white/60 text-primary shadow-sm">
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.badge && (
                <span className="absolute -top-2 -right-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Plus className="h-3 w-3" />
                  {stat.badge}
                </span>
              )}
              <h3 className="text-sm font-semibold text-foreground">
                {stat.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
