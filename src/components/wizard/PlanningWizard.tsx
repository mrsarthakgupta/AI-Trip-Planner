import { useState, useCallback } from "react";
import type { TripPreferences } from "../../types";
import { DEFAULT_PREFERENCES, STEP_LABELS, calculateDuration } from "../wizardConfig";
import { ProgressIndicator } from "../ProgressIndicator";
import { DestinationStep } from "./DestinationStep";
import { BudgetStep } from "./BudgetStep";
import { InterestsStep } from "./InterestsStep";
import { PreferencesStep } from "./PreferencesStep";
import { AdditionalRequirementsStep } from "./AdditionalRequirementsStep";
import { ReviewStep } from "./ReviewStep";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface PlanningWizardProps {
  onGenerate: (preferences: TripPreferences) => void;
}

const TOTAL_STEPS = 6;

export function PlanningWizard({ onGenerate }: PlanningWizardProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<TripPreferences>(DEFAULT_PREFERENCES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = useCallback((patch: Partial<TripPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }));
    setErrors({});
  }, []);

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (stepNum === 0) {
      if (!preferences.destination.trim()) {
        newErrors.destination = "Please enter a destination";
      } else if (preferences.destination.trim().length < 2) {
        newErrors.destination = "Destination must be at least 2 characters";
      }
      if (!preferences.startDate) {
        newErrors.startDate = "Please select a start date";
      }
      if (!preferences.endDate) {
        newErrors.endDate = "Please select an end date";
      }
      if (preferences.startDate && preferences.endDate) {
        const duration = calculateDuration(preferences.startDate, preferences.endDate);
        if (duration <= 0) {
          newErrors.endDate = "End date cannot be before start date";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleEditFromReview = (targetStep: number) => {
    setStep(targetStep);
  };

  const stepLabels = [...STEP_LABELS, "Review"];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-4 shadow-lg shadow-teal-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Plan Your Perfect Trip
        </h1>
        <p className="mt-3 text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          Tell us what you want from your trip, and AI will create a personalized itinerary for you.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} />

          <div className="mt-8">
            {step === 0 && (
              <DestinationStep preferences={preferences} update={update} errors={errors} />
            )}
            {step === 1 && <BudgetStep preferences={preferences} update={update} />}
            {step === 2 && <InterestsStep preferences={preferences} update={update} />}
            {step === 3 && <PreferencesStep preferences={preferences} update={update} />}
            {step === 4 && (
              <AdditionalRequirementsStep preferences={preferences} update={update} />
            )}
            {step === 5 && (
              <ReviewStep preferences={preferences} onEdit={handleEditFromReview} />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-200/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:from-teal-600 hover:to-cyan-700 transition-all active:scale-[0.97]"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onGenerate(preferences)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:from-teal-600 hover:to-cyan-700 transition-all active:scale-[0.97]"
            >
              <Sparkles className="w-4 h-4" />
              Create My Itinerary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
