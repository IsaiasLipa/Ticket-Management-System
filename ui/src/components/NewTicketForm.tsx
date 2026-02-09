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


  const inputBase =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const isSubmitDisabled =
    !newTicket.title.trim() ||
    !newTicket.description.trim() ||
    !newTicket.email.trim() ||
    !newTicket.department.trim();

  const [isAiSuggestionLoading, setIsAiSuggestionLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const getSuggestedAiResponse = async () => {
    try {
      setIsAiSuggestionLoading(true);
      const data = await newTicketApi(newTicket);
      setNewTicket((prev) => {
        return {
          ...prev,
          category: data.category,
          tags: data.tags,
          priority: data.priority,
          ai_response: data.suggested_response,
        };
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Create new Ticket
        </h2>
      </div>
      <div className="grid gap-4">
        <label className="text-sm font-medium text-slate-700">
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
        <label className="text-sm font-medium text-slate-700">
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
        <label className="text-sm font-medium text-slate-700">
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
          <label className="text-sm font-medium text-slate-700">
            Priority (optional)

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

          </label>
          <label className="text-sm font-medium text-slate-700">
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
          <label className="text-sm font-medium text-slate-700">
            Tags

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

          </label>

          <label className="text-sm font-medium text-slate-700">
            Category

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
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => submitNewTicket()}
          disabled={isSubmitDisabled}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitDisabled
              ? "cursor-not-allowed bg-slate-300"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
