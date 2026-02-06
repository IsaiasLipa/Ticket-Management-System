export const ticketStatusOptions = [
  "open",
  "in_progress",
  "blocked",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof ticketStatusOptions)[number];
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: string;
  tags: string[];
  priority: TicketPriority;
  ai_response: string;
};

export type FilterObject = {
  searchString: string;
  categoryFilter: string;
  statusFilter: string;
  priorityFilter: string;
};
