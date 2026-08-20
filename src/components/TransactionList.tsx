import { GROUP_INFO, type Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function TransactionList({ transactions, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
        Gastos do mês ({transactions.length})
      </h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum gasto registrado ainda.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-96 overflow-y-auto">
          {sorted.map((t) => {
            const info = GROUP_INFO[t.group];
            return (
              <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                    {t.description}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className="text-xs font-medium rounded-full px-2 py-0.5"
                      style={{ backgroundColor: `${info.color}22`, color: info.color }}
                    >
                      {info.label}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {formatBRL(t.amount)}
                  </span>
                  <button
                    onClick={() => onDelete(t.id)}
                    aria-label="Excluir gasto"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
