import { useMemo } from "react";
import { IncomeSetup } from "./components/IncomeSetup";
import { BudgetSummary } from "./components/BudgetSummary";
import { BudgetCharts } from "./components/BudgetCharts";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { useAppState } from "./storage";
import type { Transaction } from "./types";

function App() {
  const [state, setState] = useAppState();

  const totalSpent = useMemo(
    () => state.transactions.reduce((sum, t) => sum + t.amount, 0),
    [state.transactions],
  );
  const remaining = state.income - totalSpent;

  function setIncome(income: number) {
    setState((prev) => ({ ...prev, income }));
  }

  function addTransaction(t: Transaction) {
    setState((prev) => ({ ...prev, transactions: [...prev.transactions, t] }));
  }

  function deleteTransaction(id: string) {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            FinControl 50/30/20
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Controle suas finanças com a metodologia 50% necessidades, 30% desejos, 20% poupança.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <IncomeSetup income={state.income} onChange={setIncome} />

        {state.income > 0 && (
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Total gasto:{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Saldo:{" "}
              <span
                className={`font-semibold ${remaining < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </span>
          </div>
        )}

        <BudgetSummary income={state.income} transactions={state.transactions} />
        <BudgetCharts income={state.income} transactions={state.transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <TransactionForm onAdd={addTransaction} />
          <TransactionList transactions={state.transactions} onDelete={deleteTransaction} />
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400">
        Seus dados são salvos apenas no seu navegador (localStorage).
      </footer>
    </div>
  );
}

export default App;
