import {
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
} from "../constants/constants";
import type { FilterObject } from "../types/types";

export default function FilterToolBar({
  filters,
  setFilters,
}: {
  filters: FilterObject;
  setFilters: React.Dispatch<React.SetStateAction<FilterObject>>;
}) {
  const controlBase =
    "ml-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";
  const inputBase = `${controlBase} w-72 placeholder:text-slate-400`;

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          Search:{" "}
          <input
            type="text"
            placeholder="e.g Title, Description, Tag, Email..."
            value={filters.searchString}
            onChange={(e) =>
              setFilters((prev) => {
                return { ...prev, searchString: e.target.value };
              })
            }
            className={inputBase}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-200">
          <label className="flex items-center">
            Category:
            <select
              className={controlBase}
              defaultValue={"Select"}
              onChange={(e) =>
                setFilters((prev) => {
                  return { ...prev, categoryFilter: e.target.value };
                })
              }
            >
              <option value={""}>Select</option>
              {CATEGORY_OPTIONS.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center">
            Status:
            <select
              className={controlBase}
              defaultValue={"Select"}
              onChange={(e) =>
                setFilters((prev) => {
                  return { ...prev, statusFilter: e.target.value };
                })
              }
            >
              <option value={""}>Select</option>
              {STATUS_OPTIONS.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center">
            Priority:
            <select
              className={controlBase}
              defaultValue={"Select"}
              onChange={(e) =>
                setFilters((prev) => {
                  return { ...prev, priorityFilter: e.target.value };
                })
              }
            >
              <option value={""}>Select</option>
              {PRIORITY_OPTIONS.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
