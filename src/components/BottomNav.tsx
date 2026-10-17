type Tab = "resumo" | "lancamentos" | "historico";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  count: number;
}

const ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "resumo", label: "Resumo", icon: "📊" },
  { id: "lancamentos", label: "Lançamentos", icon: "💳" },
  { id: "historico", label: "Histórico", icon: "🗓️" },
];

export function BottomNav({ active, onChange, count }: Props) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-3">
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-14 text-xs font-medium transition-colors"
            >
              <span className="relative inline-flex">
                <span className={`text-xl leading-none ${isActive ? "" : "opacity-50 grayscale"}`}>
                  {item.icon}
                </span>
                {item.id === "lancamentos" && count > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </span>
              <span
                className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
