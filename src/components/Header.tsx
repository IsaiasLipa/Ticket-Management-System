export default function Header({ openModal }: { openModal: () => void }) {
  return (
    <header className="flex flex-row items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Ticket Dashboard
      </h1>
      <button
        onClick={() => openModal()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add new Ticket
      </button>
    </header>
  );
}
