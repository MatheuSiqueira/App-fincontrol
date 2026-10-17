import { useState } from "react";
import { BudgetSummary } from "./BudgetSummary";
import { TransactionList } from "./TransactionList";
import { currentMonthKey, formatMonthLabel, groupByMonth } from "../utils";
import type { Transaction } from "../types";

interface Props {
  income: number;
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MonthHistory({ income, transactions, onDelete }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const pastMonths = groupByMonth(transactions).filter(
    (group) => group.monthKey !== currentMonthKey(),
  );

  if (pastMonths.length === 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400 shadow-sm">
        Nenhum histórico ainda. Os gastos de meses anteriores aparecerão aqui
        assim que o mês atual virar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pastMonths.map((group) => {
        const isOpen = expanded === group.monthKey;
        return (
          <div
            key={group.monthKey}
            className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : group.monthKey)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {formatMonthLabel(group.monthKey)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {group.transactions.length}{" "}
                  {group.transactions.length === 1 ? "gasto" : "gastos"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {formatBRL(group.total)}
                </span>
                <span
                  className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 px-4 py-4">
                <BudgetSummary income={income} transactions={group.transactions} />
                <TransactionList
                  transactions={group.transactions}
                  onDelete={onDelete}
                  title="Gastos registrados"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
