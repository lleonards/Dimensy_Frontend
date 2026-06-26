import { Card } from './ui/Card';

export function StatCard({ label, value, hint }) {
  return (
    <Card className="space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </Card>
  );
}
