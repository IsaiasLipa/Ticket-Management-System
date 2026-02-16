import { type Dispatch, type SetStateAction } from "react";

export default function PagesButtons({
  setPageNumber,
  totalTicketNum,
}: {
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
            className="min-w-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
}
