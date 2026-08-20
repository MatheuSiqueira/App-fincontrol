import { useState } from "react";

interface Props {
  income: number;
  onChange: (income: number) => void;
}

export function IncomeSetup({ income, onChange }: Props) {
  const [draft, setDraft] = useState(income ? String(income) : "");
  const [editing, setEditing] = useState(income === 0);

  function save() {
    const value = Number(draft.replace(",", "."));
    if (!Number.isFinite(value) || value < 0) return;
    onChange(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Renda líquida mensal</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {income.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <button
          onClick={() => {
            setDraft(String(income));
            setEditing(true);
          }}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Editar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-4 shadow-sm">
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        Qual é a sua renda líquida mensal?
      </label>
      <div className="flex gap-2">
        <input
          autoFocus
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Ex: 5000"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={save}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Use o valor que sobra depois dos impostos, é a base do método 50/30/20.
      </p>
    </div>
  );
}
