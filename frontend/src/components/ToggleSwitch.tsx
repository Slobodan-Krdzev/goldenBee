import type { ReactNode } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label: ReactNode;
  id?: string;
}

export function ToggleSwitch({
  checked,
  onToggle,
  label,
  id = "toggle-render-price",
}: ToggleSwitchProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      <span className="text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      <span className="relative inline-block w-11 h-6 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className="block h-6 w-11 rounded-full bg-[var(--color-cardboard-dark)] 
            transition-colors duration-200 peer-checked:bg-[var(--color-accent)]"
        />
        <span
          className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-[var(--color-bg)] 
            shadow-sm transition-transform duration-200 peer-checked:translate-x-5"
        />
      </span>
    </label>
  );
}
