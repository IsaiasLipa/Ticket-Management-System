import type { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../constants/constants";

export type TicketStatus = (typeof STATUS_OPTIONS)[number] | "";
export type TicketPriority = (typeof PRIORITY_OPTIONS)[number] | "";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: string;
  tags: string[];
  priority: TicketPriority;
  email: string;
  department: string;
  ai_response: string;
};

export type FilterObject = {
  searchString: string;
  categoryFilter: string;
  statusFilter: string;
  priorityFilter: string;
};
