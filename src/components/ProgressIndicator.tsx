interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-slate-400">{stepLabels[currentStep]}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < currentStep
                ? "bg-teal-500"
                : i === currentStep
                ? "bg-teal-400"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
