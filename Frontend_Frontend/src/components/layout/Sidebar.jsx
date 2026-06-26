import { BarChart3, LayoutPanelTop, ListChecks, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const items = [
  { to: '/app', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/app/editor', label: 'Editor visual', icon: LayoutPanelTop },
  { to: '/app/categorias', label: 'Categorias', icon: Settings2 },
  { to: '/app/leads', label: 'Leads', icon: ListChecks },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white/80 p-6 backdrop-blur dark:border-slate-900 dark:bg-slate-950/80 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-lg font-black text-white">D</div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Dimensy</p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Painel do prestador</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
