import type { ReactNode } from "react";

interface OptionCardProps {
  label: string;
  icon?: ReactNode;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ label, icon, description, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all text-center w-full h-full ${
        selected
          ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {icon && <div className={selected ? "text-teal-600" : "text-slate-400"}>{icon}</div>}
      <span className={`font-semibold text-sm ${selected ? "text-teal-700" : "text-slate-700"}`}>
        {label}
      </span>
      {description && (
        <span className="text-xs text-slate-400 leading-tight">{description}</span>
      )}
    </button>
  );
}
