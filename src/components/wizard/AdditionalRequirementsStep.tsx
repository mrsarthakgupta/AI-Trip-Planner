import type { TripPreferences } from "../../types";
import { MessageSquare } from "lucide-react";

interface AdditionalRequirementsStepProps {
  preferences: TripPreferences;
  update: (patch: Partial<TripPreferences>) => void;
}

const MAX_CHARS = 1000;

export function AdditionalRequirementsStep({ preferences, update }: AdditionalRequirementsStepProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
        <MessageSquare className="w-4 h-4 text-teal-500" />
        Anything else you'd like us to know?
      </label>
      <p className="text-sm text-slate-400 mb-4">
        Share any personal requirements, preferences, or special requests. This will be sent to the AI along with your structured preferences.
      </p>

      <div className="relative">
        <textarea
          value={preferences.additionalNotes}
          onChange={(e) =>
            update({ additionalNotes: e.target.value.slice(0, MAX_CHARS) })
          }
          placeholder="I prefer relaxed mornings, authentic local food, less crowded places, and don't want to spend too much time travelling between locations."
          rows={6}
          maxLength={MAX_CHARS}
          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-400">
          {preferences.additionalNotes.length}/{MAX_CHARS}
        </div>
      </div>
    </div>
  );
}
