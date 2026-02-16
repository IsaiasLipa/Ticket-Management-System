import { TABLE_HEADERS } from "../constants/constants";
import type { Ticket, TicketStatus } from "../types/types";
import TicketRow from "./TicketRow";

export default function TicketTable({
  tickets,
  onStatusChange,
  updatingId,
}: {
  tickets: Ticket[];
  onStatusChange: (ticketId: string, nextStatus: TicketStatus) => void;
  updatingId?: string | null;
}) {
  const cellBase = "px-4 py-3";

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {TABLE_HEADERS.map((item, index) => (
                <th
                  key={index}
                  className={`${cellBase} text-left font-semibold text-slate-700 dark:text-slate-200`}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onStatusChange={onStatusChange}
                isUpdating={updatingId === ticket.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
