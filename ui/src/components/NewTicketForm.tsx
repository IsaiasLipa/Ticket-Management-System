import { useState } from "react";
import { PRIORITY_OPTIONS } from "../constants/constants";
import newTicketApi from "../services/getAiSuggestion";
import type { Ticket, TicketPriority } from "../types/types";
import createTicket from "../services/createTicket";
import InputWithAi from "./InputWithAi";

export default function NewTicketForm({ onClose }: { onClose: () => void }) {
  const [newTicket, setNewTicket] = useState<Ticket>({
    title: "",
    description: "",
    email: "",
    priority: "",
    department: "",
    id: "",
    status: "Open",
    category: "",
    tags: [],
    ai_response: "",
  });

  const [aiSuggestions, setAiSuggestions] = useState<Partial<Ticket> | null>(
    null,
  );

  const [isAiSuggestionLoading, setIsAiSuggestionLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const inputBase =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelBase = "text-sm font-medium text-slate-700";
  const buttonBase =
    "rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const buttonSecondary =
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
  const buttonPrimary = "bg-blue-600 text-white hover:bg-blue-700";

  const isSubmitDisabled =
    !newTicket.title.trim() ||
    !newTicket.description.trim() ||
    !newTicket.email.trim() ||
    !newTicket.department.trim();

  function createAiHandlers<K extends keyof Ticket>(field: K) {
    return {
      onAccept: (value: Ticket[K]) => {
        setNewTicket((prev) => ({
          ...prev,
          [field]: value,
        }));

        setAiSuggestions((prev) =>
          prev ? { ...prev, [field]: undefined } : null,
        );
      },

      onReject: () => {
        setAiSuggestions((prev) =>
          prev ? { ...prev, [field]: undefined } : null,
        );
      },
    };
  }

  const getSuggestedAiResponse = async () => {
    try {
      setIsAiSuggestionLoading(true);
      const data = await newTicketApi(newTicket);
      setAiSuggestions({
        category: data.category,
        tags: data.tags,
        priority: data.priority,
      });
      setNewTicket((prev) => {
        return { ...prev, ai_response: data.suggested_response };
      });
      setAiError(false);
    } catch (e) {
      console.error("Ai suggestions failed to load");
      setAiError(true);
    } finally {
      setIsAiSuggestionLoading(false);
    }
  };

  const submitNewTicket = async () => {
    await createTicket(newTicket);
    onClose();
  };

  return (
    <div className="max-h-[85vh] space-y-6 overflow-y-auto p-2 pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Create new Ticket
        </h2>
      </div>
      <div className="grid gap-4">
        <label className={labelBase}>
          Title
          <input
            placeholder="Ticket title"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
            required
            className={inputBase}
          />
        </label>
        <label className={labelBase}>
          Description
          <textarea
            placeholder="Describe the issue"
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, description: e.target.value };
              })
            }
            required
            className={`${inputBase} min-h-30`}
          />
        </label>
        {newTicket.title && newTicket.description && (
          <div className="flex justify-end">
            <button
              onClick={() => getSuggestedAiResponse()}
              disabled={isAiSuggestionLoading}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isAiSuggestionLoading
                  ? "cursor-wait border border-slate-200 bg-slate-100 text-slate-500"
                  : "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {isAiSuggestionLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
              )}
              {isAiSuggestionLoading ? "Loading..." : "Get AI suggestions"}
            </button>
          </div>
        )}
        {aiError && (
          <span className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            Ai suggestions failed to load. Please try again.
          </span>
        )}
        <label className={labelBase}>
          Email
          <input
            type="email"
            placeholder="name@company.com"
            value={newTicket.email}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, email: e.target.value };
              })
            }
            required
            className={inputBase}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelBase}>
            Priority (optional)
            <InputWithAi
              suggestion={aiSuggestions?.priority}
              {...createAiHandlers("priority")}
            >
              <select
                value={newTicket.priority}
                onChange={(e) =>
                  setNewTicket((prev) => {
                    return {
                      ...prev,
                      priority: e.target.value as TicketPriority,
                    };
                  })
                }
                className={inputBase}
              >
                <option value="">Select</option>
                {PRIORITY_OPTIONS.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </InputWithAi>
          </label>
          <label className={labelBase}>
            Department
            <input
              placeholder="Support"
              value={newTicket.department}
              onChange={(e) =>
                setNewTicket((prev) => {
                  return { ...prev, department: e.target.value };
                })
              }
              required
              className={inputBase}
            />
          </label>
          <label className={labelBase}>
            Tags
            <InputWithAi
              suggestion={aiSuggestions?.tags}
              {...createAiHandlers("tags")}
            >
              <input
                placeholder="front end"
                value={newTicket.tags.join(", ")}
                onChange={(e) => {
                  const newTags = e.target.value.split(", ");
                  setNewTicket((prev) => {
                    return { ...prev, tags: newTags };
                  });
                }}
                className={inputBase}
              />
            </InputWithAi>
          </label>

          <label className={labelBase}>
            Category
            <InputWithAi
              suggestion={aiSuggestions?.category}
              {...createAiHandlers("category")}
            >
              <input
                placeholder="Networking"
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket((prev) => {
                    return { ...prev, category: e.target.value };
                  })
                }
                className={inputBase}
              />
            </InputWithAi>
          </label>
        </div>
      </div>

      {newTicket.ai_response && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Suggested AI solution
            </label>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {newTicket.ai_response}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => onClose()}
          className={`${buttonBase} ${buttonSecondary}`}
        >
          Cancel
        </button>
        <button
          onClick={() => submitNewTicket()}
          disabled={isSubmitDisabled}
          className={`${buttonBase} focus:ring-blue-500 ${
            isSubmitDisabled ? "cursor-not-allowed bg-slate-300" : buttonPrimary
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
