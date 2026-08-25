export function currency(n: string | number) {
  const num = Number(n || 0);
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}