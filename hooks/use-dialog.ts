import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from "react";

/**
 * Drives a native <dialog> element from a controlled `open` prop.
 *
 * The native element provides focus trapping, inert background content,
 * Escape handling and focus restoration. The parent's `open` state stays the
 * single source of truth: Escape and backdrop clicks call `onClose`.
 * `onClose` may run more than once per close, so keep it idempotent.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return {
    ref,
    onCancel(event: SyntheticEvent<HTMLDialogElement>) {
      event.preventDefault();
      onClose();
    },
    // Some browsers close the dialog directly after repeated Escape presses.
    onClose() {
      onClose();
    },
    onClick(event: MouseEvent<HTMLDialogElement>) {
      // Clicks on the ::backdrop target the dialog element itself.
      if (event.target === event.currentTarget) onClose();
    },
  };
}
