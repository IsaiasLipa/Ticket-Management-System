type InputWithAiProps<T> = {
  suggestion?: T;
  onAccept: (value: T) => void;
  onReject: () => void;
  children: React.ReactNode;
};

export default function InputWithAi<T>({
  suggestion,
  onAccept,
  onReject,
  children,
}: InputWithAiProps<T>) {
  const buttonBase =
    "rounded-md px-3 py-1 text-xs font-semibold shadow-sm transition";
  const buttonAccept = "bg-emerald-600 text-white hover:bg-emerald-700";
  const buttonReject =
    "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

  if (!suggestion) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-3">
      {children}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <p className="mt-1">{String(suggestion)}</p>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onAccept(suggestion)}
            className={`${buttonBase} ${buttonAccept}`}
          >
            Accept
          </button>

          <button
            type="button"
            onClick={onReject}
            className={`${buttonBase} ${buttonReject}`}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
