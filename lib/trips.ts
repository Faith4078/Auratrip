import trips from "@/data/trips.json";

export type Trip = (typeof trips)[number];
export { trips };

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
