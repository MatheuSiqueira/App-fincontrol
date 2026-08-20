export type BudgetGroup = "necessidades" | "desejos" | "poupanca";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  group: BudgetGroup;
  date: string; // ISO yyyy-mm-dd
}

export interface AppState {
  income: number;
  transactions: Transaction[];
}

export const GROUP_INFO: Record<
  BudgetGroup,
  { label: string; percent: number; color: string; description: string }
> = {
  necessidades: {
    label: "Necessidades",
    percent: 50,
    color: "#3b82f6",
    description: "Moradia, contas, alimentação, transporte, saúde",
  },
  desejos: {
    label: "Desejos",
    percent: 30,
    color: "#a855f7",
    description: "Lazer, restaurantes, assinaturas, compras",
  },
  poupanca: {
    label: "Poupança / Dívidas",
    percent: 20,
    color: "#22c55e",
    description: "Investimentos, reserva de emergência, quitação de dívidas",
  },
};

export const GROUP_ORDER: BudgetGroup[] = ["necessidades", "desejos", "poupanca"];
