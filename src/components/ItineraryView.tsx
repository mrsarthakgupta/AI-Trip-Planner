import type { Itinerary, TripPreferences } from "../types";
import { DayCard } from "./DayCard";
import {
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ListChecks,
  Calendar,
  Users,
  Wallet,
  Gauge,
  MapPin,
  Plus,
  Compass,
} from "lucide-react";

interface ItineraryViewProps {
  itinerary: Itinerary;
  preferences: TripPreferences;
  onRegenerate: () => void;
  onPlanAnother: () => void;
  onToggleStopComplete: (dayId: string, stopId: string) => void;
  onRemoveStop: (dayId: string, stopId: string) => void;
  onMoveStop: (dayId: string, stopId: string, direction: "up" | "down") => void;
}

export function ItineraryView({
  itinerary,
  preferences,
  onRegenerate,
  onPlanAnother,
  onToggleStopComplete,
  onRemoveStop,
  onMoveStop,
}: ItineraryViewProps) {
  const totalStops = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0);
  const completedStops = itinerary.days.reduce(
    (sum, d) => sum + d.stops.filter((s) => s.completed).length,
    0
  );

  const destination = itinerary.destination || preferences.destination;

  const overviewStats = [
    { icon: Calendar, label: `${itinerary.totalDays || itinerary.days.length} ${itinerary.days.length === 1 ? "Day" : "Days"}` },
    { icon: Users, label: `${preferences.travelers} ${preferences.travelers === 1 ? "Traveler" : "Travelers"}` },
    { icon: Wallet, label: preferences.budget ? preferences.budget.charAt(0).toUpperCase() + preferences.budget.slice(1) + " Budget" : "Budget" },
    { icon: Gauge, label: preferences.pace ? preferences.pace.charAt(0).toUpperCase() + preferences.pace.slice(1) + " Pace" : "Pace" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-1">
              <Sparkles className="w-4 h-4" />
              Your AI-Generated Trip
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {itinerary.title}
            </h2>
            {destination && (
              <p className="mt-1 text-slate-500 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {destination}
              </p>
            )}
          </div>
        </div>

        <p className="mt-3 text-slate-600 leading-relaxed">{itinerary.summary}</p>

        {/* Overview card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {overviewStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        {totalStops > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                {completedStops} of {totalStops} stops completed
              </span>
              <span className="text-sm text-slate-400">
                {Math.round((completedStops / totalStops) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedStops / totalStops) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97]"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Itinerary
        </button>
        <button
          onClick={onPlanAnother}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:from-teal-600 hover:to-cyan-700 transition-all active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          Plan Another Trip
        </button>
      </div>

      {/* Days */}
      <div className="space-y-4">
        {itinerary.days.map((day, dIdx) => (
          <DayCard
            key={day.id}
            day={day}
            index={dIdx}
            onToggleStopComplete={(stopId) => onToggleStopComplete(day.id, stopId)}
            onRemoveStop={(stopId) => onRemoveStop(day.id, stopId)}
            onMoveStop={(stopId, dir) => onMoveStop(day.id, stopId, dir)}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ListChecks className="w-3.5 h-3.5" />
        Tap a circle to mark stops as completed. Use arrows to reorder. Hover a stop for more actions.
      </div>

      {/* Bottom action */}
      <div className="mt-6 text-center">
        <button
          onClick={onPlanAnother}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Start a new trip plan
        </button>
      </div>
    </div>
  );
}
