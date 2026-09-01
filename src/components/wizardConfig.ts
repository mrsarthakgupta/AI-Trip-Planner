import type { TripPreferences } from "../types";

export const INTEREST_OPTIONS = [
  { id: "beaches", label: "Beaches", emoji: "🏖" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "history", label: "History", emoji: "🏛" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "nightlife", label: "Nightlife", emoji: "🎉" },
  { id: "shopping", label: "Shopping", emoji: "🛍" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "adventure", label: "Adventure", emoji: "🥾" },
  { id: "culture", label: "Culture", emoji: "🎨" },
  { id: "cafes", label: "Cafes", emoji: "☕" },
  { id: "scenic", label: "Scenic Places", emoji: "🏞" },
  { id: "entertainment", label: "Entertainment", emoji: "🎭" },
] as const;

export const BUDGET_OPTIONS = [
  { id: "budget", label: "Budget", description: "Hostels, street food, free activities" },
  { id: "moderate", label: "Moderate", description: "Mid-range hotels, local restaurants" },
  { id: "premium", label: "Premium", description: "Nice hotels, sit-down dining" },
  { id: "luxury", label: "Luxury", description: "5-star stays, fine dining" },
] as const;

export const PACE_OPTIONS = [
  { id: "relaxed", label: "Relaxed", description: "Fewer stops, more downtime" },
  { id: "balanced", label: "Balanced", description: "Moderate activities per day" },
  { id: "packed", label: "Packed", description: "Maximize every moment" },
] as const;

export const TRIP_TYPE_OPTIONS = [
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends" },
  { id: "business", label: "Business" },
] as const;

export const TRANSPORT_OPTIONS = [
  { id: "public", label: "Public Transport" },
  { id: "taxi", label: "Taxi/Cab" },
  { id: "rental-car", label: "Rental Car" },
  { id: "rental-bike", label: "Rental Bike" },
  { id: "mix", label: "Mix" },
] as const;

export const ACCOMMODATION_OPTIONS = [
  { id: "budget", label: "Budget" },
  { id: "mid-range", label: "Mid-range" },
  { id: "luxury", label: "Luxury" },
] as const;

export const DIETARY_OPTIONS = [
  { id: "no-preference", label: "No Preference" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "jain", label: "Jain" },
] as const;

export const CROWD_OPTIONS = [
  { id: "popular", label: "Popular Tourist Places" },
  { id: "mix", label: "Mix of Popular and Local" },
  { id: "less-crowded", label: "Prefer Less Crowded" },
] as const;

export const TRAVELER_TYPES = ["Adults", "Children", "Seniors"] as const;

export const DEFAULT_PREFERENCES: TripPreferences = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  travelerType: "Adults",
  budget: "",
  pace: "",
  tripType: "",
  interests: [],
  transportation: "",
  accommodation: "",
  dietary: "",
  crowdPreference: "",
  mustVisit: "",
  avoid: "",
  additionalNotes: "",
};

export const STEP_LABELS = [
  "Destination & Dates",
  "Budget & Style",
  "Interests",
  "Preferences",
  "Requirements",
];

export function calculateDuration(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return 0;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}
