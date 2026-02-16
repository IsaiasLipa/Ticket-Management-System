import {
  CATEGORY_OPTIONS,
  type PRIORITY_OPTIONS,
  type STATUS_OPTIONS,
} from "../constants/constants";

export type TicketStatus = (typeof STATUS_OPTIONS)[number] | "";
export type TicketPriority = (typeof PRIORITY_OPTIONS)[number] | "";
export type TicketCategory = (typeof CATEGORY_OPTIONS)[number] | "";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: TicketCategory;
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

export type ToastMessage = {
  type: "success" | "error";
  message: string;
};

export type ThemeContextValue = {
  isDarkTheme: boolean;
  changeTheme: () => void;
};
