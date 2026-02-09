import { useState, useCallback } from "react";
import type { Ticket, TicketStatus } from "../types/types";
import updateTicket from "../services/updateTicket";

export default function useTicketStatusUpdate(
  tickets: Ticket[],
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
  setStatusError: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleTicketStatusChange = useCallback(
    async (ticketId: string, nextStatus: TicketStatus) => {
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
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId ? { ...t, status: previousStatus } : t,
          ),
        );
        setStatusError((prev: any) => [
          ...prev,
          `Failed to update status of ticket to "${nextStatus}". Change reverted. Please try again.`,
        ]);
        return;
      }

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, ...updated } : t)),
      );
    },
    [tickets, setTickets],
  );

  return { handleTicketStatusChange, updatingId };
}
