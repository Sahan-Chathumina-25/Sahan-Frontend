"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";

export type FormStatus =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; simulated: boolean }
  | { status: "error"; error: string };

interface FormModalProps {
  readonly result: Extract<FormStatus, { status: "success" } | { status: "error" }> | null;
  readonly onClose: () => void;
}

export function FormModal({ result, onClose }: FormModalProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useFocusTrap<HTMLDivElement>(result !== null, onClose);
  const isSuccess = result?.status === "success";

  return (
    <AnimatePresence>
      {result && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          role="presentation"
          onClick={onClose}
        >
          <motion.div aria-hidden="true" className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="form-modal-title"
            aria-describedby="form-modal-desc"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-ink-800 p-6 text-center outline-none sm:p-8"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-paper-dim hover:text-paper"
            >
              <X size={16} />
            </button>
            {isSuccess ? (
              <CheckCircle2 size={44} className="mx-auto text-primary" aria-hidden="true" />
            ) : (
              <XCircle size={44} className="mx-auto text-red-400" aria-hidden="true" />
            )}
            <h3 id="form-modal-title" className="mt-4 font-display text-xl font-bold text-paper">
              {isSuccess ? "Message sent" : "Something went wrong"}
            </h3>
            <p id="form-modal-desc" className="mt-2 text-sm leading-relaxed text-paper-dim">
              {result.status === "success"
                ? result.simulated
                  ? "Thanks for reaching out — your message was recorded locally (email delivery is not configured yet)."
                  : "Thanks for reaching out — I'll get back to you as soon as I can."
                : result.error}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90"
            >
              {isSuccess ? "Done" : "Try again"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
