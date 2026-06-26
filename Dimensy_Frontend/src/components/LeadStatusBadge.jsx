import { cn } from '../lib/utils';

const statusStyles = {
  novo: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  em_atendimento: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  concluido: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  descartado: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

const labels = {
  novo: 'Novo',
  em_atendimento: 'Em atendimento',
  concluido: 'Concluído',
  descartado: 'Descartado',
};

export function LeadStatusBadge({ status }) {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', statusStyles[status] || statusStyles.novo)}>
      {labels[status] || 'Novo'}
    </span>
  );
}
