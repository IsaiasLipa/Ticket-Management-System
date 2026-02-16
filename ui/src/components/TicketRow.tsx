import { STATUS_OPTIONS, priorityStyles } from "../constants/constants";
import type { Ticket, TicketStatus } from "../types/types";

export default function TicketRow({
  ticket,
  onStatusChange,
  isUpdating = false,
}: {
  ticket: Ticket;
  onStatusChange: (ticketId: string, nextStatus: TicketStatus) => void;
  isUpdating?: boolean;
}) {
  const cellBase = "px-4 py-3";

  return (
    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800">
      <td
        className={`${cellBase} font-medium text-slate-900 dark:text-slate-100`}
      >
        {ticket.title}
      </td>
      <td className={`${cellBase} max-w-md text-slate-600 dark:text-slate-300`}>
        {ticket.description}
      </td>

      <td className={`${cellBase} text-slate-700 dark:text-slate-200`}>
        {ticket.category}
      </td>
      <td className={`${cellBase}`}>
        <div className="flex flex-wrap gap-2">
          {ticket.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
      <td className={`${cellBase} max-w-md text-slate-600 dark:text-slate-300`}>
        {ticket.ai_response}
      </td>
      <td className={`${cellBase}`}>
        <select
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isUpdating
              ? "cursor-wait border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              : "border-slate-300 bg-white text-slate-700 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          }`}
          value={ticket.status}
          aria-label="Ticket status"
          onChange={(e) =>
            onStatusChange(ticket.id, e.target.value as TicketStatus)
          }
          disabled={isUpdating}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
