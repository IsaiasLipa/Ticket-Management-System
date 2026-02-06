import { mockTickets } from "../mockData/mockTickets";

import Header from "./Header";
import FilterToolBar from "./FilterToolBar";
import TicektTable from "./TicketTable";
import { useState } from "react";
import type { Ticket, FilterObject } from "../types/types";
import NewTicketForm from "./NewTicketForm";
import Modal from "../Modal";

function filterTicekts(tickets: Ticket[], filters: FilterObject): Ticket[] {
  const filtered = [...tickets].filter(
    (item) =>
      item.category.includes(filters.categoryFilter) &&
      item.status.includes(filters.statusFilter) &&
      item.priority.includes(filters.priorityFilter) &&
      (item.title
        .toLocaleLowerCase()
        .includes(filters.searchString.toLocaleLowerCase()) ||
        item.description
          .toLocaleLowerCase()
          .includes(filters.searchString.toLocaleLowerCase()) ||
        item.ai_response
          .toLocaleLowerCase()
          .includes(filters.searchString.toLocaleLowerCase()) ||
        item.tags.some(
          (word) =>
            word.includes(filters.searchString.toLocaleLowerCase()) ||
            item.category.includes(filters.searchString.toLocaleLowerCase()) ||
            item.status.includes(filters.searchString.toLocaleLowerCase()) ||
            item.priority.includes(filters.searchString.toLocaleLowerCase()),
        )),
  );

  return filtered;
}

export default function TicketDashboard() {
  const tickets = mockTickets;

  const [filters, setFilters] = useState<FilterObject>({
    searchString: "",
    categoryFilter: "",
    statusFilter: "",
    priorityFilter: "",
  });

  const filteredTickets = filterTicekts(tickets, filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="mx-6 my-4">
      <Header openModal={() => setIsModalOpen(true)} />
      <FilterToolBar filters={filters} setFilters={setFilters} />
      <TicektTable tickets={filteredTickets} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewTicketForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
