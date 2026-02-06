import { STATUS_OPTIONS, priorityStyles } from "../constants/constants";
import type { Ticket } from "../types/types";

export default function TicketRow({ ticket }: { ticket: Ticket }) {
  const cellBase = "px-4 py-3";

  return (
    <tr className="hover:bg-slate-50">
      <td className={`${cellBase} font-medium text-slate-900`}>
        {ticket.title}
      </td>
      <td className={`${cellBase} max-w-md text-slate-600`}>
        {ticket.description}
      </td>
      <td className={`${cellBase}`}>
        <select
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={ticket.status}
          aria-label="Ticket status"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
      <td className={`${cellBase} text-slate-700`}>{ticket.category}</td>
      <td className={`${cellBase}`}>
        <div className="flex flex-wrap gap-2">
          {ticket.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className={`${cellBase}`}>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[ticket.priority]}`}
        >
          {ticket.priority}
        </span>
      </td>
      <td className={`${cellBase} max-w-md text-slate-600`}>
        {ticket.ai_response}
      </td>
    </tr>
  );
}
