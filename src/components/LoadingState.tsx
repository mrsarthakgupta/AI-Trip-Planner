import { useEffect, useState } from "react";
import { Sparkles, Plane, MapPin, Calendar } from "lucide-react";

const MESSAGES = [
  "Planning your trip...",
  "Finding places that match your preferences...",
  "Organizing your days...",
  "Personalizing your itinerary...",
];

export function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl shadow-teal-500/20 animate-pulse">
        <Plane className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">{MESSAGES[msgIndex]}</h2>
      <p className="text-slate-400 text-sm mb-8">
        This usually takes 10-30 seconds.
      </p>

      {/* Animated skeleton */}
      <div className="space-y-4 text-left">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-14 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-14 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating icons animation */}
      <div className="flex items-center justify-center gap-6 mt-8 opacity-40">
        <MapPin className="w-5 h-5 text-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <Calendar className="w-5 h-5 text-teal-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <Sparkles className="w-5 h-5 text-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
