import { GROUP_INFO, GROUP_ORDER, type BudgetGroup, type Transaction } from "../types";

interface Props {
  income: number;
  transactions: Transaction[];
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function spentByGroup(transactions: Transaction[]): Record<BudgetGroup, number> {
  const totals: Record<BudgetGroup, number> = { necessidades: 0, desejos: 0, poupanca: 0 };
  for (const t of transactions) {
    totals[t.group] += t.amount;
  }
  return totals;
}

export function BudgetSummary({ income, transactions }: Props) {
  const totals = spentByGroup(transactions);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {GROUP_ORDER.map((group) => {
        const info = GROUP_INFO[group];
        const budget = (income * info.percent) / 100;
        const spent = totals[group];
        const pct = budget > 0 ? (spent / budget) * 100 : 0;
        const over = spent > budget;

        return (
          <div
            key={group}
            className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">{info.label}</h3>
              <span
                className="text-xs font-medium rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${info.color}22`, color: info.color }}
              >
                {info.percent}%
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{info.description}</p>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {formatBRL(spent)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                de {formatBRL(budget)}
              </span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: over ? "#ef4444" : info.color,
                }}
              />
            </div>
            <p className={`mt-1 text-xs ${over ? "text-red-500 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
              {over
                ? `Ultrapassou em ${formatBRL(spent - budget)}`
                : `Restam ${formatBRL(budget - spent)}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
