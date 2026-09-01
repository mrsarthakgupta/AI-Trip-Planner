import type { StopCategory } from "../types";
import {
  Utensils,
  Camera,
  Bus,
  ShoppingBag,
  Activity,
  Moon,
  Wine,
  Trees,
  Landmark,
  MapPin,
  Waves,
  Mountain,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  StopCategory,
  { icon: typeof Utensils; label: string; color: string; bg: string; ring: string }
> = {
  sightseeing: { icon: Camera, label: "Sightseeing", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" },
  food: { icon: Utensils, label: "Food", color: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-200" },
  transport: { icon: Bus, label: "Transport", color: "text-slate-600", bg: "bg-slate-100", ring: "ring-slate-200" },
  shopping: { icon: ShoppingBag, label: "Shopping", color: "text-pink-600", bg: "bg-pink-50", ring: "ring-pink-200" },
  activity: { icon: Activity, label: "Activity", color: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-200" },
  rest: { icon: Moon, label: "Rest", color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-200" },
  nightlife: { icon: Wine, label: "Nightlife", color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200" },
  nature: { icon: Trees, label: "Nature", color: "text-green-600", bg: "bg-green-50", ring: "ring-green-200" },
  culture: { icon: Landmark, label: "Culture", color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200" },
  beach: { icon: Waves, label: "Beach", color: "text-cyan-600", bg: "bg-cyan-50", ring: "ring-cyan-200" },
  adventure: { icon: Mountain, label: "Adventure", color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" },
};

export function getCategoryConfig(category: string) {
  const key = (category || "activity").toLowerCase() as StopCategory;
  return CATEGORY_CONFIG[key] ?? {
    icon: MapPin,
    label: category || "Activity",
    color: "text-slate-600",
    bg: "bg-slate-100",
    ring: "ring-slate-200",
  };
}
