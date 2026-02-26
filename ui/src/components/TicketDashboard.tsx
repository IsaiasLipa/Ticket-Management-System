import Header from "./Header";
import FilterToolBar from "./FilterToolBar";
import TicketTable from "./TicketTable";
import { useState, useEffect, useRef } from "react";
import type { Ticket, FilterObject, ToastMessage } from "../types/types";
import NewTicketForm from "./NewTicketForm";
import Modal from "./Modal";
import getTickets from "../services/getTickets";
import ToastMessages from "./ToastMessages";
import useTicketStatusUpdate from "../hooks/useTicketStatusUpdate";
import PagesButtons from "./PageButtons";

export default function TicketDashboard() {
  const pageSize = 10;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalTicketNum, setTotalTicketNum] = useState<number>(0);
  const [filters, setFilters] = useState<FilterObject>({
    searchString: "",
    categoryFilter: "",
    statusFilter: "",
    priorityFilter: "",
  });

  const filtersKey = JSON.stringify(filters);
  const prevFiltersKeyRef = useRef(filtersKey);
  const filtersRef = useRef(filters);
  const pageRef = useRef(pageNumber);
  const seenTicketIdsRef = useRef(new Set<string>());

  const getAllTickets = async () => {
      try {
        const { tickets, total } = await getTickets(pageNumber, filters);
        setTickets(tickets);
        setTotalTicketNum(total);
      } catch (e) {
        setToastMessages((prev) => [
          ...prev,
          { type: "error", message: "Failed to load tickets." },
        ]);
        setTickets([]);
        setTotalTicketNum(0);
      }
    };

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    pageRef.current = pageNumber;
  }, [pageNumber]);

  useEffect(() => {
    tickets.forEach((ticket) => {
      seenTicketIdsRef.current.add(ticket.id);
    });
  }, [tickets]);

  const matchesFilters = (ticket: Ticket, currentFilters: FilterObject) => {
    const normalize = (value: string) => value.toLowerCase();
    const matchesField = (value: string, filter: string) =>
      !filter || normalize(value).includes(normalize(filter));

    const matchesCategory = matchesField(
      ticket.category,
      currentFilters.categoryFilter,
    );
    const matchesStatus = matchesField(
      ticket.status,
      currentFilters.statusFilter,
    );
    const matchesPriority = matchesField(
      ticket.priority,
      currentFilters.priorityFilter,
    );

    if (!matchesCategory || !matchesStatus || !matchesPriority) {
      return false;
    }

    const search = currentFilters.searchString.trim().toLowerCase();
    if (!search) {
      return true;
    }

    const containsSearch = (value: string) =>
      normalize(value).includes(search);

    return (
      containsSearch(ticket.title) ||
      containsSearch(ticket.description) ||
      containsSearch(ticket.category) ||
      containsSearch(ticket.priority) ||
      containsSearch(ticket.status) ||
      containsSearch(ticket.ai_response) ||
      containsSearch(ticket.email) ||
      containsSearch(ticket.department) ||
      containsSearch(ticket.id) ||
      ticket.tags.some((tag) => containsSearch(tag))
    );
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/tickets");

    socket.onmessage = (event) => {
      let payload: { type?: string; ticket?: Ticket } | null = null;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!payload || payload.type !== "ticket_created" || !payload.ticket) {
        return;
      }

      const incomingTicket = payload.ticket;
      if (seenTicketIdsRef.current.has(incomingTicket.id)) {
        return;
      }

      const currentFilters = filtersRef.current;
      if (!matchesFilters(incomingTicket, currentFilters)) {
        return;
      }

      seenTicketIdsRef.current.add(incomingTicket.id);
      setTotalTicketNum((prev) => prev + 1);

      if (pageRef.current !== 1) {
        return;
      }

      setTickets((prev) => {
        if (prev.some((ticket) => ticket.id === incomingTicket.id)) {
          return prev;
        }
        const next = [incomingTicket, ...prev];
        return next.slice(0, pageSize);
      });
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const filtersChanged = prevFiltersKeyRef.current !== filtersKey;
    if (filtersChanged && pageNumber !== 1) {
      prevFiltersKeyRef.current = filtersKey;
      setPageNumber(1);
      return;
    }
    prevFiltersKeyRef.current = filtersKey;
    getAllTickets();
  }, [pageNumber, filtersKey]);

  useEffect(() => {
    if (toastMessages.length == 0) return;
    const timeoutId = setTimeout(() => {
      setToastMessages((prev) => [...prev].slice(0, -1));
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [toastMessages]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleTicketStatusChange, updatingId } = useTicketStatusUpdate(
    tickets,
    setTickets,
    setToastMessages,
  );

  return (
    <div className="px-6 py-4">
      <Header openModal={() => setIsModalOpen(true)} />
      <FilterToolBar filters={filters} setFilters={setFilters} />
      <TicketTable
        tickets={tickets}
        onStatusChange={handleTicketStatusChange}
        updatingId={updatingId}
      />
      <PagesButtons
        pageSelected={pageNumber}
        setPageNumber={setPageNumber}
        totalTicketNum={totalTicketNum}
      />
      <ToastMessages toastMessages={toastMessages} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewTicketForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
