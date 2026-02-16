import { useState, useCallback } from "react";
import type { Ticket, TicketStatus, ToastMessage } from "../types/types";
import updateTicket from "../services/updateTicket";

export default function useTicketStatusUpdate(
  tickets: Ticket[],
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
  setToastMessages: React.Dispatch<React.SetStateAction<ToastMessage[]>>,
) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleTicketStatusChange = useCallback(
    async (ticketId: string, nextStatus: TicketStatus) => {
      // Optimistically update the UI, then rollback if the API call fails.
      const previousStatus =
        tickets.find((t) => t.id === ticketId)?.status ?? nextStatus;

      if (previousStatus === nextStatus) return;

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t)),
      );

      setUpdatingId(ticketId);
      const updated = await updateTicket(ticketId, { status: nextStatus });
      setUpdatingId(null);

      if (!updated) {
        // revert to previous status when failed update
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId ? { ...t, status: previousStatus } : t,
          ),
        );
        // Ticket state update errors get a toast message as well
        setToastMessages((prev) => [
          ...prev,
          {
            type: "error",
            message: `Failed to update status of ticket to "${nextStatus}". Change reverted. Please try again.`,
          },
        ]);
        return;
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, ...updated } : t)),
      );
      setToastMessages((prev) => [
        ...prev,
        {
          type: "success",
          message: `Status updated to "${nextStatus}".`,
        },
      ]);
    },
    [tickets, setTickets],
  );

  return { handleTicketStatusChange, updatingId };
}
