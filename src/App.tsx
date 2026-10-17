import { useMemo, useState } from "react";
import { IncomeSetup } from "./components/IncomeSetup";
import { BudgetSummary } from "./components/BudgetSummary";
import { BudgetCharts } from "./components/BudgetCharts";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { MonthHistory } from "./components/MonthHistory";
import { BottomNav } from "./components/BottomNav";
import { useAppState } from "./storage";
import { currentMonthKey, formatMonthLabel, monthKeyOf } from "./utils";
import type { Transaction } from "./types";

type Tab = "resumo" | "lancamentos" | "historico";

function App() {
  const [state, setState] = useAppState();
  const [tab, setTab] = useState<Tab>("resumo");

  const currentMonth = currentMonthKey();
  const currentMonthTransactions = useMemo(
    () => state.transactions.filter((t) => monthKeyOf(t.date) === currentMonth),
    [state.transactions, currentMonth],
  );

  const totalSpent = useMemo(
    () => currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0),
    [currentMonthTransactions],
  );
  const remaining = state.income - totalSpent;

  function setIncome(income: number) {
    setState((prev) => ({ ...prev, income }));
  }

  function addTransaction(t: Transaction) {
    setState((prev) => ({ ...prev, transactions: [...prev.transactions, t] }));
    setTab(monthKeyOf(t.date) === currentMonth ? "lancamentos" : "historico");
  }

  function deleteTransaction(id: string) {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-3">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            FinControl 50/30/20
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 pb-28 space-y-4">
        {tab === "resumo" && (
          <>
            <IncomeSetup income={state.income} onChange={setIncome} />

            {state.income > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Total gasto em {formatMonthLabel(currentMonth)}:{" "}
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

            <BudgetSummary income={state.income} transactions={currentMonthTransactions} />
            <BudgetCharts income={state.income} transactions={currentMonthTransactions} />
          </>
        )}

        {tab === "lancamentos" && (
          <>
            <TransactionForm onAdd={addTransaction} />
            <TransactionList
              transactions={currentMonthTransactions}
              onDelete={deleteTransaction}
              title={`Gastos de ${formatMonthLabel(currentMonth)}`}
            />
          </>
        )}

        {tab === "historico" && (
          <MonthHistory
            income={state.income}
            transactions={state.transactions}
            onDelete={deleteTransaction}
          />
        )}

        <p className="pt-4 text-center text-xs text-slate-400">
          Seus dados são salvos apenas neste aparelho (localStorage).
        </p>
      </main>

      <BottomNav active={tab} onChange={setTab} count={currentMonthTransactions.length} />
    </div>
  );
}

export default App;
