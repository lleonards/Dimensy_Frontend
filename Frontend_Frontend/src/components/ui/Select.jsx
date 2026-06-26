import { cn } from '../../lib/utils';

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
