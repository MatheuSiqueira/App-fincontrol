import { useState } from "react";
import { GROUP_INFO, GROUP_ORDER, type BudgetGroup, type Transaction } from "../types";

interface Props {
  onAdd: (t: Transaction) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({ onAdd }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [group, setGroup] = useState<BudgetGroup>("necessidades");
  const [date, setDate] = useState(todayISO());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: value,
      group,
      date,
    });

    setDescription("");
    setAmount("");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-3"
    >
      <h3 className="font-semibold text-slate-900 dark:text-slate-50">Novo gasto</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Descrição (ex: Supermercado)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value as BudgetGroup)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GROUP_ORDER.map((g) => (
            <option key={g} value={g}>
              {GROUP_INFO[g].label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Adicionar gasto
      </button>
    </form>
  );
}
