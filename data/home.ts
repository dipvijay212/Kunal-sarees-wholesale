import { hi } from "@/lib/translations";
import type { Highlight, ProcessStep } from "@/types";

export const wholesaleHighlights: Highlight[] = [...hi.highlights];

export const orderingSteps: ProcessStep[] = [...hi.process.steps];
