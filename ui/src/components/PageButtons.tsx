import { type Dispatch, type SetStateAction } from "react";

export default function PagesButtons({
  pageSelected,
  setPageNumber,
  totalTicketNum,
}: {
  pageSelected: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  totalTicketNum: number;
}) {
  const totalButtonNum = Math.ceil(totalTicketNum / 10);

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {Array(totalButtonNum)
        .fill(null)
        .map((_, index) => (
          <button
            key={index}
            onClick={() => setPageNumber(index + 1)}
            className={`min-w-9 rounded-md border px-3 py-1 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              pageSelected === index + 1
                ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
}
