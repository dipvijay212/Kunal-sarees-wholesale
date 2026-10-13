"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Client-side paging for admin tables. `resetKey` sends the list back to page 1 when filters change. */
export function usePagination<T>(items: T[], pageSize = 10, resetKey = "") {
  const [state, setState] = useState({ page: 1, key: resetKey });
  // A page chosen under different filters no longer applies.
  const requestedPage = state.key === resetKey ? state.page : 1;
  const setPage = (next: number) => setState({ page: next, key: resetKey });

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  // Deleting the last row of the last page must not leave an empty page.
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;

  return {
    page,
    setPage,
    totalPages,
    pageSize,
    totalItems: items.length,
    pageItems: items.slice(start, start + pageSize),
  };
}

/** Page numbers to show, with gaps collapsed: 1 … 4 5 6 … 12 */
function pageList(page: number, totalPages: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "gap") {
      pages.push("gap");
    }
  }
  return pages;
}

const buttonClass =
  "min-w-8 rounded-xs border border-line bg-canvas px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink";

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row"
    >
      <p>
        Showing <strong className="text-ink">{from}–{to}</strong> of{" "}
        <strong className="text-ink">{totalItems}</strong> {itemLabel}
      </p>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button type="button" className={buttonClass} disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          {pageList(page, totalPages).map((p, index) =>
            p === "gap" ? (
              <span key={`gap-${index}`} className="px-1">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === page ? "page" : undefined}
                className={cn(buttonClass, p === page && "border-maroon bg-maroon text-cream hover:text-cream")}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            className={buttonClass}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  );
}
