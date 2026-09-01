import type { TripPreferences } from "../../types";
import { BUDGET_OPTIONS, PACE_OPTIONS, TRIP_TYPE_OPTIONS } from "../wizardConfig";
import { OptionCard } from "../OptionCard";
import { Wallet, Gauge, Users } from "lucide-react";

interface BudgetStepProps {
  preferences: TripPreferences;
  update: (patch: Partial<TripPreferences>) => void;
}

export function BudgetStep({ preferences, update }: BudgetStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Wallet className="w-4 h-4 text-teal-500" />
          Budget
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUDGET_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              description={opt.description}
              selected={preferences.budget === opt.id}
              onClick={() => update({ budget: opt.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Gauge className="w-4 h-4 text-teal-500" />
          Travel Pace
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PACE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              description={opt.description}
              selected={preferences.pace === opt.id}
              onClick={() => update({ pace: opt.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Users className="w-4 h-4 text-teal-500" />
          Trip Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TRIP_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              selected={preferences.tripType === opt.id}
              onClick={() => update({ tripType: opt.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
