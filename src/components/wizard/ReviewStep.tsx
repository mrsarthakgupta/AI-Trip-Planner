import type { TripPreferences } from "../../types";
import {
  BUDGET_OPTIONS,
  PACE_OPTIONS,
  TRIP_TYPE_OPTIONS,
  TRANSPORT_OPTIONS,
  ACCOMMODATION_OPTIONS,
  DIETARY_OPTIONS,
  CROWD_OPTIONS,
  INTEREST_OPTIONS,
  calculateDuration,
} from "../wizardConfig";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Gauge,
  Car,
  Bed,
  Utensils,
  Sparkles,
  Star,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface ReviewStepProps {
  preferences: TripPreferences;
  onEdit: (step: number) => void;
}

function getLabel(options: readonly { id: string; label: string }[], id: string): string {
  const match = options.find((o) => o.id === id);
  return match ? match.label : "Not specified";
}

function getInterestLabels(ids: string[]): string[] {
  return ids
    .map((id) => INTEREST_OPTIONS.find((o) => o.id === id))
    .filter((o): o is (typeof INTEREST_OPTIONS)[number] => o !== undefined)
    .map((o) => `${o.emoji} ${o.label}`);
}

export function ReviewStep({ preferences, onEdit }: ReviewStepProps) {
  const dateRange =
    preferences.startDate && preferences.endDate
      ? `${preferences.startDate} → ${preferences.endDate}`
      : preferences.startDate
      ? `From ${preferences.startDate}`
      : "Not specified";

  const duration = calculateDuration(preferences.startDate, preferences.endDate);
  const durationLabel = duration > 0 ? ` (${duration} ${duration === 1 ? "day" : "days"})` : "";

  const interestLabels = getInterestLabels(preferences.interests);

  const cards: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    step: number;
  }> = [
    {
      icon: <MapPin className="w-4 h-4 text-teal-500" />,
      label: "Destination",
      value: preferences.destination || "Not specified",
      step: 0,
    },
    {
      icon: <Calendar className="w-4 h-4 text-teal-500" />,
      label: "Dates / Duration",
      value: `${dateRange}${durationLabel}`,
      step: 0,
    },
    {
      icon: <Users className="w-4 h-4 text-teal-500" />,
      label: "Travelers",
      value: `${preferences.travelers} ${preferences.travelerType}`,
      step: 0,
    },
    {
      icon: <Wallet className="w-4 h-4 text-teal-500" />,
      label: "Budget",
      value: getLabel(BUDGET_OPTIONS, preferences.budget) || "Not specified",
      step: 1,
    },
    {
      icon: <Gauge className="w-4 h-4 text-teal-500" />,
      label: "Travel Pace",
      value: getLabel(PACE_OPTIONS, preferences.pace) || "Not specified",
      step: 1,
    },
    {
      icon: <Users className="w-4 h-4 text-teal-500" />,
      label: "Trip Type",
      value: getLabel(TRIP_TYPE_OPTIONS, preferences.tripType) || "Not specified",
      step: 1,
    },
    {
      icon: <Sparkles className="w-4 h-4 text-teal-500" />,
      label: "Interests",
      value: interestLabels.length > 0 ? interestLabels.join(", ") : "None selected",
      step: 2,
    },
    {
      icon: <Car className="w-4 h-4 text-teal-500" />,
      label: "Transportation",
      value: getLabel(TRANSPORT_OPTIONS, preferences.transportation) || "Not specified",
      step: 3,
    },
    {
      icon: <Bed className="w-4 h-4 text-teal-500" />,
      label: "Accommodation",
      value: getLabel(ACCOMMODATION_OPTIONS, preferences.accommodation) || "Not specified",
      step: 3,
    },
    {
      icon: <Utensils className="w-4 h-4 text-teal-500" />,
      label: "Dietary",
      value: getLabel(DIETARY_OPTIONS, preferences.dietary) || "Not specified",
      step: 3,
    },
    {
      icon: <Users className="w-4 h-4 text-teal-500" />,
      label: "Crowd Preference",
      value: getLabel(CROWD_OPTIONS, preferences.crowdPreference) || "Not specified",
      step: 3,
    },
    {
      icon: <Star className="w-4 h-4 text-teal-500" />,
      label: "Must-Visit Places",
      value: preferences.mustVisit || "None specified",
      step: 3,
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-teal-500" />,
      label: "Places to Avoid",
      value: preferences.avoid || "None specified",
      step: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Review Your Trip</h3>
        <p className="text-sm text-slate-400">
          Make sure everything looks right before generating your itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex-shrink-0 mt-0.5">{card.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-sm text-slate-700 mt-0.5 break-words">{card.value}</p>
            </div>
            <button
              onClick={() => onEdit(card.step)}
              className="flex-shrink-0 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {preferences.additionalNotes && (
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-teal-500" />
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Additional Requirements
            </p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{preferences.additionalNotes}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-teal-600">
        <CheckCircle2 className="w-4 h-4" />
        <span>Ready to generate your personalized itinerary</span>
      </div>
    </div>
  );
}
