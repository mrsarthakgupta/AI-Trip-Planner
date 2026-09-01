import type { TripPreferences } from "../../types";
import { TRAVELER_TYPES, calculateDuration } from "../wizardConfig";
import { MapPin, Calendar, Users, Minus, Plus, Clock } from "lucide-react";

interface DestinationStepProps {
  preferences: TripPreferences;
  update: (patch: Partial<TripPreferences>) => void;
  errors: Record<string, string>;
}

export function DestinationStep({ preferences, update, errors }: DestinationStepProps) {
  const duration = calculateDuration(preferences.startDate, preferences.endDate);

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="w-4 h-4 text-teal-500" />
          Destination
        </label>
        <input
          type="text"
          value={preferences.destination}
          onChange={(e) => update({ destination: e.target.value })}
          placeholder="e.g. Goa, India"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
        {errors.destination && (
          <p className="mt-1.5 text-sm text-red-500">{errors.destination}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="w-4 h-4 text-teal-500" />
            Start Date
          </label>
          <input
            type="date"
            value={preferences.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          {errors.startDate && (
            <p className="mt-1.5 text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="w-4 h-4 text-teal-500" />
            End Date
          </label>
          <input
            type="date"
            value={preferences.endDate}
            onChange={(e) => update({ endDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          {errors.endDate && (
            <p className="mt-1.5 text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      {duration > 0 && (
        <div className="flex items-center gap-2 text-sm font-medium text-teal-600 bg-teal-50 px-4 py-3 rounded-xl">
          <Clock className="w-4 h-4" />
          {duration} {duration === 1 ? "day" : "days"} trip
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Users className="w-4 h-4 text-teal-500" />
          Number of Travelers
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => update({ travelers: Math.max(1, preferences.travelers - 1) })}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xl font-bold text-slate-800 w-12 text-center">
            {preferences.travelers}
          </span>
          <button
            type="button"
            onClick={() => update({ travelers: Math.min(20, preferences.travelers + 1) })}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Traveler Type</label>
        <div className="flex flex-wrap gap-2">
          {TRAVELER_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update({ travelerType: type })}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                preferences.travelerType === type
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
