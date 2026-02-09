import { type Dispatch, type JSX, type SetStateAction } from "react";
import type { Ticket, TicketPriority } from "../types/types";

export default function InputWithAi({
  children,
  isAiSuggesting,
isAiSuggestionLoading,
  previousAiFields,
  field,
  setNewTicketVal,
  setPreviousAiFields,
}: {
  children: JSX.Element;
  isAiSuggesting: boolean;
  isAiSuggestionLoading: boolean;
  previousAiFields: {
    priority: TicketPriority;
    tags: string[] | '';
    category: string;
  };
  field: "category" | "priority" | "tags";
  setNewTicketVal: Dispatch<SetStateAction<Ticket>>;
  setPreviousAiFields: Dispatch<
    SetStateAction<{
      priority: TicketPriority;
      tags: string[] | '';
      category: string;
    }>
  >;
}) {

  console.log(`previous ${field}`, previousAiFields[field]);
  return (
    <div>
      {children}
      {previousAiFields && !isAiSuggestionLoading && (
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPreviousAiFields((prev) => {
                return { ...prev, [field]: "" };
              })
            }
            className="inline-flex items-center justify-center rounded-md border border-emerald-600 bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            aria-label="Apply AI suggestion for priority"
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => {
              setNewTicketVal((prev) => {
                return { ...prev, [field]: previousAiFields[field] };
              });
              setPreviousAiFields((prev) => {
                return { ...prev, [field]: "" };
              });
            }}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            aria-label="Revert priority to previous value"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
