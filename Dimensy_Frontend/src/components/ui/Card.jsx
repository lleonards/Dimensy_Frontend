import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-900 dark:bg-slate-925 dark:bg-slate-900/80',
        className
      )}
      {...props}
    />
  );
}
