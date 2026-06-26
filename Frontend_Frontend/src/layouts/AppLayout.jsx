import { BarChart3, LayoutPanelTop, ListChecks, LogOut, Menu, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const mobileItems = [
  { to: '/app', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/app/editor', label: 'Editor visual', icon: LayoutPanelTop },
  { to: '/app/categorias', label: 'Categorias', icon: Settings2 },
  { to: '/app/leads', label: 'Leads', icon: ListChecks },
];

export function AppLayout() {
  const { company, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      <Sidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-900 dark:bg-slate-950/90 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setMenuOpen((current) => !current)} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Dimensy</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">empresa</p>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{company?.name || 'Minha empresa'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="secondary" className="gap-2" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {menuOpen ? (
          <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-900 dark:bg-slate-950 lg:hidden">
            <nav className="grid gap-2">
              {mobileItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}

        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
