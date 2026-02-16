import type { ToastMessage } from "../types/types";

export default function ToastMessages({
  toastMessages,
}: {
  toastMessages: ToastMessage[];
}) {
  if (!toastMessages.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {toastMessages.map((toast, index) => (
        <div
          key={`${index}-${toast.message}`}
          className={`rounded-md border px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-950/40 dark:text-rose-200"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
