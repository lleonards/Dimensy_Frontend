import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { InstallPwaCard } from '../components/InstallPwaCard';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { NotificationPermissionCard } from '../components/NotificationPermissionCard';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { apiFetch } from '../lib/api';
import { formatDateTime } from '../lib/utils';

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/dashboard/summary').then(setSummary).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="visão geral"
        title="Sua operação em tempo real"
        description="Acompanhe volume de solicitações, taxa de conversão, status de atendimento e acesso rápido à sua landing page pública."
        actions={summary?.publicUrl ? <a href={summary.publicUrl} target="_blank" rel="noreferrer"><Button className="gap-2">Abrir landing page <ExternalLink className="h-4 w-4" /></Button></a> : null}
      />

      <NotificationPermissionCard />
      <InstallPwaCard />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Solicitações hoje" value={loading ? '...' : summary?.today || 0} />
        <StatCard label="Solicitações na semana" value={loading ? '...' : summary?.week || 0} />
        <StatCard label="Solicitações no mês" value={loading ? '...' : summary?.month || 0} />
        <StatCard label="Taxa de conversão" value={loading ? '...' : `${summary?.conversionRate || 0}%`} hint="Concluídos ÷ total de solicitações" />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Novas" value={loading ? '...' : summary?.statuses?.novo || 0} />
        <StatCard label="Em atendimento" value={loading ? '...' : summary?.statuses?.em_atendimento || 0} />
        <StatCard label="Concluídas" value={loading ? '...' : summary?.statuses?.concluido || 0} />
        <StatCard label="Descartadas" value={loading ? '...' : summary?.statuses?.descartado || 0} />
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Últimas solicitações</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Veja rapidamente os últimos leads captados pela sua página.</p>
          </div>
          <Link to="/app/leads"><Button variant="secondary">Gerenciar leads</Button></Link>
        </div>

        {!summary?.recentLeads?.length ? (
          <EmptyState title="Nenhuma solicitação ainda" description="Assim que um cliente preencher sua landing page, ele aparecerá aqui." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Cidade</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Recebido em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {summary.recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-4 font-medium text-slate-900 dark:text-white">{lead.customer_name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{lead.category_name}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{lead.city}</td>
                    <td className="py-4"><LeadStatusBadge status={lead.status} /></td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{formatDateTime(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
