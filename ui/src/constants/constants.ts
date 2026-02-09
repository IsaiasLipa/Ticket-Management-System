import type { Ticket } from "../types/types";

export const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"] as const;

export const STATUS_OPTIONS = [
  "Open",
  "In progress",
  "Blocked",
  "Resolved",
  "Closed",
] as const;

export const CATEGORY_OPTIONS = [
  "Bug",
  "Feature",
  "Infrastructure",
  "Enhancement",
  "Design",
] as const;

export const TABLE_HEADERS = [
  "Title",
  "Description",
  "Category",
  "Tags",
  "Priority",
  "AI response",
  "Status",
];

export const priorityStyles: Record<Ticket["priority"], string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-sky-200 bg-sky-50 text-sky-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Urgent: "border-rose-200 bg-rose-50 text-rose-700",
  "": "",
};
