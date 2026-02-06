import { useState } from "react";
import { PRIORITY_OPTIONS } from "../constants/constants";
export default function NewTicketForm({ onClose }: { onClose: () => void }) {
  const [newTicekt, setNewTicket] = useState({
    title: "",
    description: "",
    email: "",
    priority: "",
    department: "",
  });
  const inputBase =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

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
            className={`${inputBase} min-h-[120px]`}
          />
        </label>
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
                  return { ...prev, priority: e.target.value };
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
        </div>
      </div>
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
