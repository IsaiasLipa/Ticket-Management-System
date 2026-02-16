import { useContext } from "react";
import { ThemeContext } from "../App";
import { MdDarkMode, MdLightMode } from "react-icons/md";



export default function Header({ openModal }: { openModal: () => void }) {
  const theme = useContext(ThemeContext);
  return (
    <header className="flex flex-row items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Ticket Dashboard
      </h1>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-slate-900"
          onClick={() => theme?.changeTheme()}
        >
          {theme?.isDarkTheme ?  <MdLightMode/> : <MdDarkMode/>}
        </button>
        <button
          onClick={() => openModal()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-emerald-500 dark:text-slate-900 dark:hover:bg-emerald-400 dark:focus:ring-emerald-400 dark:focus:ring-offset-slate-900"
        >
          Add new Ticket
        </button>
      </div>
    </header>
  );
}
