"use client";

import { useEffect } from "react";
import { Check, Info, X } from "lucide-react";

export type ToastData = {
  id: number;
  kind: "success" | "error";
  title: string;
  text: string;
};

type Props = {
  toast: ToastData | null;
  onClose: () => void;
};

export default function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(onClose, 6500);
    return () => window.clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.kind === "error";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        key={toast.id}
        role={isError ? "alert" : "status"}
        className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-gold/60 bg-jade p-4 text-ivory shadow-2xl"
      >
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isError ? "bg-ivory/15 text-ivory" : "bg-gold-foil text-jade-deep"
          }`}
        >
          {isError ? (
            <Info className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg leading-tight">{toast.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ivory/85">{toast.text}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ivory/70"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
