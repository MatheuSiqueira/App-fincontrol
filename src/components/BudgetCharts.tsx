import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GROUP_INFO, GROUP_ORDER, type Transaction } from "../types";
import { spentByGroup } from "./BudgetSummary";

interface Props {
  income: number;
  transactions: Transaction[];
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tooltipFormatter(value: unknown) {
  return formatBRL(Number(value ?? 0));
}

export function BudgetCharts({ income, transactions }: Props) {
  const totals = spentByGroup(transactions);

  const pieData = GROUP_ORDER.map((group) => ({
    name: GROUP_INFO[group].label,
    value: (income * GROUP_INFO[group].percent) / 100,
    color: GROUP_INFO[group].color,
  }));

  const barData = GROUP_ORDER.map((group) => ({
    name: GROUP_INFO[group].label,
    orcado: Math.round(((income * GROUP_INFO[group].percent) / 100) * 100) / 100,
    gasto: Math.round(totals[group] * 100) / 100,
    color: GROUP_INFO[group].color,
  }));

  if (income <= 0) {
    return (
      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400 shadow-sm">
        Defina sua renda mensal para visualizar os gráficos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">
          Distribuição ideal (50/30/20)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">Orçado vs. Gasto</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="orcado" name="Orçado" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gasto" name="Gasto" radius={[4, 4, 0, 0]}>
              {barData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
