import type { Transaction } from "./types";

/** Chave no formato "AAAA-MM" extraída de uma data ISO (AAAA-MM-DD). */
export function monthKeyOf(dateISO: string): string {
  return dateISO.slice(0, 7);
}

export function currentMonthKey(): string {
  return monthKeyOf(new Date().toISOString());
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export interface MonthGroup {
  monthKey: string;
  transactions: Transaction[];
  total: number;
}

/** Agrupa transações por mês, ordenadas da mais recente para a mais antiga. */
export function groupByMonth(transactions: Transaction[]): MonthGroup[] {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const key = monthKeyOf(t.date);
    const list = groups.get(key);
    if (list) list.push(t);
    else groups.set(key, [t]);
  }

  return Array.from(groups.entries())
    .map(([monthKey, monthTransactions]) => ({
      monthKey,
      transactions: monthTransactions,
      total: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
    }))
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}
