export function nairaRange(from: number, to: number) {
  const fmt = (n: number) => `\u20a6${(n / 1000).toFixed(0)}k`;
  return `${fmt(from)}\u2013${fmt(to)}`;
}

export function naira(amount: number) {
  return `\u20a6${amount.toLocaleString()}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}