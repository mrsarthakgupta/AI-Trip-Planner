import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100 mb-5">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Could not generate itinerary
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:from-teal-600 hover:to-cyan-700 transition-all active:scale-[0.97]"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
