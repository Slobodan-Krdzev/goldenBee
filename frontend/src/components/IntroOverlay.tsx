import { useState, useEffect } from "react";

const LOGO_DURATION_MS = 2500;

export function IntroOverlay() {
  const [phase, setPhase] = useState<"logo" | "modal" | "done">("logo");

  useEffect(() => {
    const t = setTimeout(() => setPhase("modal"), LOGO_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (phase === "done") return null;

  if (phase === "logo") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]"
        style={{ animation: "intro-logo-fade 2.5s ease-out forwards" }}
        aria-hidden
      >
        <img
          src="/logo.png"
          alt="Golden Bee Fresh Bar"
          className="h-24 w-auto md:h-32"
          style={{ animation: "intro-logo-fade-in 1s ease-out 0.3s forwards" }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={() => setPhase("done")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="allergen-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/logo.png"
          alt="Golden Bee Fresh Bar"
          className="h-12 w-auto mx-auto mb-4"
        />
        <p
          id="allergen-modal-title"
          className="text-[var(--color-ink)] text-base leading-relaxed"
        >
          „Иако внимаваме при подготовката, не можеме целосно да ја исклучиме
          можноста од присуство на траги од алергени поради заедничка подготовка."
        </p>
        <p className="text-[var(--color-ink-muted)] text-sm mt-3">
          Состојките кои се наведени со * се алергени.
        </p>
        <button
          type="button"
          onClick={() => setPhase("done")}
          className="mt-6 py-2.5 px-6 rounded-lg font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
        >
          Во ред
        </button>
      </div>
    </div>
  );
}
