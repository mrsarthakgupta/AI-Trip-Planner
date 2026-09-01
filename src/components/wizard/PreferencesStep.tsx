import type { TripPreferences } from "../../types";
import {
  TRANSPORT_OPTIONS,
  ACCOMMODATION_OPTIONS,
  DIETARY_OPTIONS,
  CROWD_OPTIONS,
} from "../wizardConfig";
import { OptionCard } from "../OptionCard";
import { Car, Bed, Utensils, Users, Star, MapPin } from "lucide-react";

interface PreferencesStepProps {
  preferences: TripPreferences;
  update: (patch: Partial<TripPreferences>) => void;
}

export function PreferencesStep({ preferences, update }: PreferencesStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Car className="w-4 h-4 text-teal-500" />
          Transportation
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRANSPORT_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              selected={preferences.transportation === opt.id}
              onClick={() => update({ transportation: opt.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Bed className="w-4 h-4 text-teal-500" />
          Accommodation Preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ACCOMMODATION_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              selected={preferences.accommodation === opt.id}
              onClick={() => update({ accommodation: opt.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Utensils className="w-4 h-4 text-teal-500" />
          Dietary Preference
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DIETARY_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              selected={preferences.dietary === opt.id}
              onClick={() => update({ dietary: opt.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Users className="w-4 h-4 text-teal-500" />
          Crowd Preference
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CROWD_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              selected={preferences.crowdPreference === opt.id}
              onClick={() => update({ crowdPreference: opt.id })}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Star className="w-4 h-4 text-teal-500" />
            Places I definitely want to visit
          </label>
          <input
            type="text"
            value={preferences.mustVisit}
            onChange={(e) => update({ mustVisit: e.target.value })}
            placeholder="e.g. Fort Aguada, Anjuna Flea Market"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <MapPin className="w-4 h-4 text-teal-500" />
            Places or activities to avoid
          </label>
          <input
            type="text"
            value={preferences.avoid}
            onChange={(e) => update({ avoid: e.target.value })}
            placeholder="e.g. Crowded markets, water sports"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}
