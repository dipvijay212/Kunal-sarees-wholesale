import type { FaqItem, Highlight } from "@/types";

export const wholesaleTerms: Highlight[] = [
  {
    title: "Minimum orders",
    description:
      "Bridal couture from a single piece. Silks in sets of two or four, and lighter fabrics in sets of six to twelve. Each design lists its minimum.",
  },
  {
    title: "Pricing",
    description:
      "Every design shows its per-piece wholesale rate, excluding GST. Final pricing is confirmed with you before anything is packed.",
  },
  {
    title: "Payment",
    description:
      "No online payments. Payment terms are agreed directly with our team when your order is confirmed, with a GST invoice for every order.",
  },
  {
    title: "Dispatch",
    description:
      "In-stock designs are packed and dispatched after confirmation. Made-to-order pieces take 10–15 working days.",
  },
];

export const wholesaleAudiences: string[] = [
  "Boutiques and designer studios",
  "Multi-brand saree stores",
  "Online and social media resellers",
  "Wedding and trousseau stylists",
];

export const wholesaleFaqs: FaqItem[] = [
  {
    question: "Do I need a GST number to order?",
    answer:
      "A GSTIN helps us issue a business invoice, but it is not required to start a conversation. Share your details and our team will guide you.",
  },
  {
    question: "Can I mix designs in one order?",
    answer:
      "Yes. Add as many designs as you like to your order list. Each design only needs to meet its own minimum quantity.",
  },
  {
    question: "Can I see a design before ordering?",
    answer:
      "Ask on WhatsApp for a live video or additional photos of any design, including close-ups of the weave and border.",
  },
  {
    question: "Do you ship outside Gujarat?",
    answer:
      "We dispatch across India through trusted courier and transport partners. Shipping costs are confirmed with your order.",
  },
  {
    question: "What if a piece arrives damaged?",
    answer:
      "Tell us within 48 hours of delivery with photos of the parcel and product, and we will arrange a replacement or credit.",
  },
];
