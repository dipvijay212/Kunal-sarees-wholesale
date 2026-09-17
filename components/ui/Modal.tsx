"use client";

import { useId, type ReactNode } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { CloseIcon } from "./Icons";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Visually hide the header while keeping the title available to screen readers. */
  hideHeader?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  /** `top` suits search and command-style dialogs. */
  placement?: "center" | "top";
  /** Apply the default body padding. Disable for edge-to-edge content. */
  padded?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  hideHeader = false,
  size = "md",
  placement = "center",
  padded = true,
  footer,
  children,
  className,
  bodyClassName,
}: ModalProps) {
  const { ref, ...dialogHandlers } = useDialog(open, onClose);
  const titleId = useId();
  const descriptionId = useId();
  const isFull = size === "full";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "ks-dialog ks-modal",
        `ks-modal--${size}`,
        placement === "top" && !isFull && "ks-modal--top",
        className,
      )}
      {...dialogHandlers}
    >
      <div
        className={cn(
          "relative flex max-h-[inherit] flex-col overflow-hidden bg-surface",
          isFull ? "h-full" : "rounded-md border border-line shadow-lift",
        )}
      >
        <header
          className={cn(
            "flex items-start justify-between gap-6",
            hideHeader ? "sr-only" : "border-b border-line py-5 pr-16 pl-5 sm:pl-8",
          )}
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 id={titleId} className="type-h4 text-ink">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="type-small text-muted">
                {description}
              </p>
            ) : null}
          </div>
        </header>

        <IconButton
          label="Close"
          icon={<CloseIcon size={20} />}
          onClick={onClose}
          variant={isFull ? "overlay" : "ghost"}
          className="absolute top-2.5 right-2.5 z-10"
        />

        {children ? (
          <div className={cn("min-h-0 flex-1 overflow-y-auto", padded && !isFull && "px-5 py-6 sm:px-8", bodyClassName)}>
            {children}
          </div>
        ) : null}

        {footer ? (
          <footer
            className={cn(
              "flex flex-col-reverse gap-3 px-5 py-5 sm:flex-row sm:justify-end sm:px-8",
              children ? "border-t border-line" : undefined,
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
