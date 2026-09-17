"use client";

import { useId, type ReactNode } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { CloseIcon } from "./Icons";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: "left" | "right";
  id?: string;
  /** Replaces the visible title (e.g. with a logo); `title` remains the accessible name. */
  headerContent?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = "right",
  id,
  headerContent,
  footer,
  children,
  className,
  bodyClassName,
}: DrawerProps) {
  const { ref, ...dialogHandlers } = useDialog(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn("ks-dialog ks-drawer", `ks-drawer--${side}`, className)}
      {...dialogHandlers}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col bg-surface",
          side === "right" ? "border-l border-line" : "border-r border-line",
        )}
      >
        <header className="flex h-header shrink-0 items-center justify-between gap-4 border-b border-line px-4 sm:px-6">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 id={titleId} className={cn("type-h4 truncate text-ink", headerContent ? "sr-only" : undefined)}>
              {title}
            </h2>
            {headerContent}
            {description ? (
              <p id={descriptionId} className="type-caption truncate text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Close" icon={<CloseIcon size={20} />} onClick={onClose} className="-mr-2" />
        </header>

        <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6", bodyClassName)}>
          {children}
        </div>

        {footer ? (
          <footer className="shrink-0 border-t border-line px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
