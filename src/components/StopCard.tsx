import { useState } from "react";
import type { Stop } from "../types";
import { getCategoryConfig } from "./categoryConfig";
import {
  ChevronDown,
  Clock,
  Timer,
  Check,
  Circle,
  Trash2,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  Car,
} from "lucide-react";

interface StopCardProps {
  stop: Stop;
  index: number;
  totalStops: number;
  onToggleComplete: () => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

export function StopCard({
  stop,
  index,
  totalStops,
  onToggleComplete,
  onRemove,
  onMove,
}: StopCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cat = getCategoryConfig(stop.category);
  const Icon = cat.icon;

  return (
    <div
      className={`group relative rounded-xl border transition-all ${
        stop.completed
          ? "border-slate-200 bg-slate-50/50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Category icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4
                className={`font-semibold text-slate-800 truncate ${
                  stop.completed ? "line-through text-slate-400" : ""
                }`}
              >
                {stop.name}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                {stop.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stop.time}
                  </span>
                )}
                {stop.duration && (
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {stop.duration}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full ${cat.bg} ${cat.color} font-medium`}>
                  {cat.label}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={onToggleComplete}
                className={`p-1.5 rounded-lg transition-colors ${
                  stop.completed
                    ? "text-teal-600 hover:bg-teal-50"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
                title={stop.completed ? "Mark as not done" : "Mark as completed"}
              >
                {stop.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title={expanded ? "Collapse" : "Expand"}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Expandable details */}
          {expanded && (
            <div className="mt-3 space-y-2">
              {stop.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{stop.description}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {stop.estimatedCost && (
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    {stop.estimatedCost}
                  </span>
                )}
                {stop.transport && (
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {stop.transport}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar — reorder + delete */}
      <div className="flex items-center justify-between px-4 pb-3 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === totalStops - 1}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-medium"
          title="Remove stop"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}
