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
