import type { FilterObject } from "../types/types";

export default async function getTickets(
  pageNum: number = 1,
  filters: FilterObject,
) {
  const params = new URLSearchParams({
    pageNum: String(pageNum),
    category: filters.categoryFilter,
    status: filters.statusFilter,
    priority: filters.priorityFilter,
    searchString: filters.searchString,
  });

  const response = await fetch(
    `http://localhost:8000/tickets?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Can not fetch tickets");
  }
  return await response.json();
}
