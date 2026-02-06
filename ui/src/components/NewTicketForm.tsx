import { useState } from "react";
import { PRIORITY_OPTIONS } from "../constants/constants";
import newTicketApi from "../services/newTicket";
import type { Ticket, TicketPriority } from "../types/types";
export default function NewTicketForm({ onClose }: { onClose: () => void }) {
  const [newTicekt, setNewTicket] = useState<Ticket>({
    title: "",
    description: "",
    email: "",
    priority: "",
    department: "",
    id: "",
    status: "open",
    category: "",
    tags: [],
    ai_response: "",
  });

  const inputBase =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const getSuggestedAiResponse = async () => {
    const data = await newTicketApi(newTicekt);
    setNewTicket((prev) => {
      return {
        ...prev,
        category: data.category,
        tags: data.tags,
        priority: data.priority,
        ai_response: data.suggested_response,
      };
    });
    console.log(data);
    console.log(newTicekt);
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
            value={newTicekt.title}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
            className={inputBase}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Description
          <textarea
            placeholder="Describe the issue"
            value={newTicekt.description}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, description: e.target.value };
              })
            }
            className={`${inputBase} min-h-30`}
          />
        </label>
        {newTicekt.title && newTicekt.description && (
          <div className="flex justify-end">
            <button
              onClick={() => getSuggestedAiResponse()}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get AI suggestions
            </button>
          </div>
        )}
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            placeholder="name@company.com"
            value={newTicekt.email}
            onChange={(e) =>
              setNewTicket((prev) => {
                return { ...prev, email: e.target.value };
              })
            }
            className={inputBase}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Priority (optional)
            <select
              value={newTicekt.priority}
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
              value={newTicekt.department}
              onChange={(e) =>
                setNewTicket((prev) => {
                  return { ...prev, department: e.target.value };
                })
              }
              className={inputBase}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Tags
            <input
              placeholder="front end"
              value={newTicekt.tags}
              onChange={(e) =>
                setNewTicket((prev) => {
                  return { ...prev, tags: [...prev.tags, e.target.value] };
                })
              }
              className={inputBase}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Category
            <input
              placeholder="Networking"
              value={newTicekt.category}
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
      {newTicekt.ai_response && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Suggested AI solution
          </label>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {newTicekt.ai_response}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => onClose()}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Cancel
        </button>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Submit
        </button>
      </div>
    </div>
  );
}
