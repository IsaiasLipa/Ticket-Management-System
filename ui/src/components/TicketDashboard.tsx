import Header from "./Header";
import FilterToolBar from "./FilterToolBar";
import TicketTable from "./TicketTable";
import { useState, useEffect } from "react";
import type { Ticket, FilterObject, ToastMessage } from "../types/types";
import NewTicketForm from "./NewTicketForm";
import Modal from "./Modal";
import getTickets from "../services/getTickets";
import ToastMessages from "./ToastMessages";
import useTicketStatusUpdate from "../hooks/useTicketStatusUpdate";

function filterTicekts(tickets: Ticket[], filters: FilterObject): Ticket[] {
  // Apply filters and search with AND semantics (case-insensitive).
  const search = filters.searchString.trim().toLowerCase();
  const categoryFilter = filters.categoryFilter.toLowerCase();
  const statusFilter = filters.statusFilter.toLowerCase();
  const priorityFilter = filters.priorityFilter.toLowerCase();

  const filtered = [...tickets].filter((item) => {
    const matchesFilters =
      item.category.toLowerCase().includes(categoryFilter) &&
      item.status.toLowerCase().includes(statusFilter) &&
      item.priority.toLowerCase().includes(priorityFilter);

    if (!matchesFilters) return false;

    if (!search) return true;

    const matchesSearch =
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.ai_response.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.status.toLowerCase().includes(search) ||
      item.priority.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.department.toLowerCase().includes(search) ||
      item.tags.some((tag) => tag.toLowerCase().includes(search));

    return matchesSearch;
  });

  return filtered;
}

export default function TicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  //polling to fetch new tickets
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
    if (toastMessages.length == 0) return;
    const timeoutId = setTimeout(() => {
      setToastMessages((prev) => [...prev].slice(0, -1));
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [toastMessages]);

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
    setToastMessages,
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

      <ToastMessages toastMessages={toastMessages} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewTicketForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
