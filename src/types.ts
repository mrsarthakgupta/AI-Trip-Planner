export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelerType: string;
  budget: string;
  pace: string;
  tripType: string;
  interests: string[];
  transportation: string;
  accommodation: string;
  dietary: string;
  crowdPreference: string;
  mustVisit: string;
  avoid: string;
  additionalNotes: string;
}

export type StopCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "shopping"
  | "activity"
  | "rest"
  | "nightlife"
  | "nature"
  | "culture"
  | "beach"
  | "adventure"
  | string;

export interface Stop {
  id: string;
  name: string;
  category: StopCategory;
  time: string;
  duration: string;
  description: string;
  estimatedCost: string;
  transport: string;
  completed: boolean;
}

export interface Day {
  id: string;
  day: number;
  title: string;
  summary: string;
  stops: Stop[];
}

export interface Itinerary {
  title: string;
  destination: string;
  summary: string;
  totalDays: number;
  days: Day[];
}
