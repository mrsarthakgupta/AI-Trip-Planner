import { useCallback, useRef, useState } from "react";
import { PlanningWizard } from "./components/wizard/PlanningWizard";
import { ItineraryView } from "./components/ItineraryView";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { generateItinerary, ApiError } from "./api";
import type { Itinerary, TripPreferences } from "./types";

type Status = "idle" | "loading" | "error" | "success";

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string>("");
  const [lastPreferences, setLastPreferences] = useState<TripPreferences | null>(null);

  // Request token to prevent stale responses from overwriting newer ones.
  // Each request gets a unique token; only the latest request can update state.
  const requestTokenRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async (preferences: TripPreferences) => {
    // Cancel any in-flight request so its response is discarded
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Increment token so only the latest request can update state
    const myToken = ++requestTokenRef.current;
    setLastPreferences(preferences);
    setStatus("loading");
    setError("");

    try {
      const result = await generateItinerary(preferences, controller.signal);

      // Only apply if this is still the latest request
      if (myToken !== requestTokenRef.current) return;

      setItinerary(result);
      setStatus("success");
    } catch (err) {
      // Only apply error if this is still the latest request
      if (myToken !== requestTokenRef.current) return;

      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setStatus("error");
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastPreferences) {
      handleGenerate(lastPreferences);
    }
  }, [lastPreferences, handleGenerate]);

  const handlePlanAnother = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestTokenRef.current++;
    setStatus("idle");
    setItinerary(null);
    setError("");
    setLastPreferences(null);
  }, []);

  // --- Itinerary mutation handlers (local state only, no re-fetch) ---

  const toggleStopComplete = useCallback((dayId: string, stopId: string) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((d) =>
          d.id === dayId
            ? {
                ...d,
                stops: d.stops.map((s) =>
                  s.id === stopId ? { ...s, completed: !s.completed } : s
                ),
              }
            : d
        ),
      };
    });
  }, []);

  const removeStop = useCallback((dayId: string, stopId: string) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map((d) =>
          d.id === dayId
            ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) }
            : d
        ),
      };
    });
  }, []);

  const moveStop = useCallback(
    (dayId: string, stopId: string, direction: "up" | "down") => {
      setItinerary((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          days: prev.days.map((d) => {
            if (d.id !== dayId) return d;
            const stops = [...d.stops];
            const idx = stops.findIndex((s) => s.id === stopId);
            if (idx === -1) return d;
            const swapIdx = direction === "up" ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= stops.length) return d;
            [stops[idx], stops[swapIdx]] = [stops[swapIdx], stops[idx]];
            return { ...d, stops };
          }),
        };
      });
    },
    []
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-teal-50 via-slate-50 to-slate-50" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[400px] bg-gradient-to-br from-teal-100/40 to-cyan-100/30 rounded-full blur-3xl" />

      <div className="relative px-4 py-8 sm:py-12">
        {status === "success" && itinerary && lastPreferences ? (
          <ItineraryView
            itinerary={itinerary}
            preferences={lastPreferences}
            onRegenerate={handleRegenerate}
            onPlanAnother={handlePlanAnother}
            onToggleStopComplete={toggleStopComplete}
            onRemoveStop={removeStop}
            onMoveStop={moveStop}
          />
        ) : status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <ErrorState message={error} onRetry={handleRegenerate} />
        ) : (
          <PlanningWizard onGenerate={handleGenerate} />
        )}
      </div>
    </div>
  );
}
