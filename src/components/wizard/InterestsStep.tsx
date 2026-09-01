import type { TripPreferences } from "../../types";
import { INTEREST_OPTIONS } from "../wizardConfig";
import { Sparkles } from "lucide-react";

interface InterestsStepProps {
  preferences: TripPreferences;
  update: (patch: Partial<TripPreferences>) => void;
}

export function InterestsStep({ preferences, update }: InterestsStepProps) {
  const toggleInterest = (id: string) => {
    const current = preferences.interests;
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    update({ interests: next });
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
        <Sparkles className="w-4 h-4 text-teal-500" />
        What are you interested in?
      </label>
      <p className="text-sm text-slate-400 mb-4">Select all that apply. The AI will prioritize these in your itinerary.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {INTEREST_OPTIONS.map((opt) => {
          const selected = preferences.interests.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleInterest(opt.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                selected
                  ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
              <span className={`font-semibold text-sm ${selected ? "text-teal-700" : "text-slate-700"}`}>
                {opt.label}
              </span>
              {selected && (
                <span className="ml-auto w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {preferences.interests.length > 0 && (
        <p className="mt-4 text-sm text-teal-600 font-medium">
          {preferences.interests.length} {preferences.interests.length === 1 ? "interest" : "interests"} selected
        </p>
      )}
    </div>
  );
}
