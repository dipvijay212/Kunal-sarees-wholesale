const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

/** Formats a rupee amount in the Indian numbering system, e.g. ₹1,16,400. */
export function formatPrice(amount: number | string): string {
  const num = typeof amount === "number" ? amount : Number(amount) || 0;
  return inrFormatter.format(num);
}


export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

export function formatPieces(count: number): string {
  return `${formatNumber(count)} पीस`;
}
