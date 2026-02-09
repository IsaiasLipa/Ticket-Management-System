import Header from "./Header";
import FilterToolBar from "./FilterToolBar";
import TicketTable from "./TicketTable";
import { useState, useEffect } from "react";
import type { Ticket, FilterObject } from "../types/types";
import NewTicketForm from "./NewTicketForm";
import Modal from "./Modal";
import getTickets from "../services/getTickets";
import ErrorToast from "./ErrorToast";
import useTicketStatusUpdate from "../hooks/useTicketStatusUpdate";

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
  // TODO: look if we need a state for the tickets since we dont use the setter directly
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusError, setStatusError] = useState<string[]>([]);
  useEffect(() => {
    const getAllTickets = async () => {
      const existingTickets = await getTickets();
      setTickets(existingTickets.reverse());
    };
    getAllTickets();
    const intervalId = setInterval(getAllTickets, 8000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (statusError.length == 0) return;
    const timeoutId = setTimeout(() => {
      setStatusError((prev) => [...prev].slice(0, -1));
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [statusError]);

  const [filters, setFilters] = useState<FilterObject>({
    searchString: "",
    categoryFilter: "",
    statusFilter: "",
    priorityFilter: "",
  });

  const filteredTickets = filterTicekts(tickets, filters);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleTicketStatusChange, updatingId } = useTicketStatusUpdate(
    tickets,
    setTickets,
    setStatusError,
  );

  return (
    <div className="mx-6 my-4">
      <Header openModal={() => setIsModalOpen(true)} />
      <FilterToolBar filters={filters} setFilters={setFilters} />
      <TicketTable
        tickets={filteredTickets}
        onStatusChange={handleTicketStatusChange}
        updatingId={updatingId}
      />

      <ErrorToast errorMessages={statusError} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewTicketForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
