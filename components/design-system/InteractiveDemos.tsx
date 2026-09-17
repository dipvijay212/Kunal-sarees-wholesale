"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function QuantityDemo() {
  const [quantity, setQuantity] = useState(6);

  return (
    <div className="flex flex-wrap items-end gap-8">
      <QuantitySelector value={quantity} onChange={setQuantity} min={6} max={120} step={6} label="Pieces" showLabel />
      <QuantitySelector value={quantity} onChange={setQuantity} min={6} max={120} step={6} size="sm" label="Pieces (small)" showLabel />
      <p className="text-sm text-muted">
        Value: <span className="type-price text-ink">{quantity}</span> · min 6 · step 6
      </p>
    </div>
  );
}

export function DialogDemo() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setModalOpen(true)} aria-haspopup="dialog">
        Open modal
      </Button>
      <Button variant="secondary" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
        Open drawer
      </Button>

      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal title"
        description="Supporting description for the dialog."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-muted">
          Modals use the native dialog element: focus is trapped, the page behind is inert, and Escape or a backdrop
          click closes it.
        </p>
      </Modal>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Drawer title"
        description="Slides in from the right"
        footer={
          <Button fullWidth onClick={() => setDrawerOpen(false)}>
            Done
          </Button>
        }
      >
        <p className="text-muted">Drawers are used for the enquiry list, mobile navigation and catalogue filters.</p>
      </Drawer>
    </div>
  );
}
