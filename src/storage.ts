import { useEffect, useState } from "react";
import type { AppState } from "./types";

const STORAGE_KEY = "fincontrol-50-30-20";

const DEFAULT_STATE: AppState = {
  income: 0,
  transactions: [],
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      income: typeof parsed.income === "number" ? parsed.income : 0,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
}
