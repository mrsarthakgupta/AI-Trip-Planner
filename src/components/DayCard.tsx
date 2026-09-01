import { useState } from "react";
import type { Day } from "../types";
import { StopCard } from "./StopCard";
import { ChevronDown, Calendar, MapPin } from "lucide-react";

interface DayCardProps {
  day: Day;
  index: number;
  onToggleStopComplete: (stopId: string) => void;
  onRemoveStop: (stopId: string) => void;
  onMoveStop: (stopId: string, direction: "up" | "down") => void;
}

export function DayCard({
  day,
  index,
  onToggleStopComplete,
  onRemoveStop,
  onMoveStop,
}: DayCardProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const completedCount = day.stops.filter((s) => s.completed).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-500/20">
            {day.day}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 text-base sm:text-lg truncate">
              {day.title}
            </h3>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Day {day.day}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {day.stops.length} {day.stops.length === 1 ? "stop" : "stops"}
              </span>
              {completedCount > 0 && (
                <span className="text-teal-600 font-medium">
                  {completedCount}/{day.stops.length} done
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-2.5">
          {day.summary && (
            <p className="text-sm text-slate-500 leading-relaxed px-1 pb-1">{day.summary}</p>
          )}
          {day.stops.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-6">
              No stops left. Try regenerating the itinerary.
            </p>
          ) : (
            day.stops.map((stop, sIdx) => (
              <StopCard
                key={stop.id}
                stop={stop}
                index={sIdx}
                totalStops={day.stops.length}
                onToggleComplete={() => onToggleStopComplete(stop.id)}
                onRemove={() => onRemoveStop(stop.id)}
                onMove={(dir) => onMoveStop(stop.id, dir)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
