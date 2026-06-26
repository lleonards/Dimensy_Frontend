import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '../components/EmptyState';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { apiFetch } from '../lib/api';
import { formatDateTime, whatsappUrl } from '../lib/utils';

const defaultStatus = 'todos';

export function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== defaultStatus) query.set('status', statusFilter);
      if (search) query.set('search', search);
      const payload = await apiFetch(`/leads?${query.toString()}`);
      setLeads(payload.leads);
      if (selectedLead) {
        const detail = await apiFetch(`/leads/${selectedLead.id}`);
        setSelectedLead(detail.lead);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => null);
  }, [statusFilter]);

  const statusOptions = useMemo(() => [
    { value: 'novo', label: 'Novo' },
    { value: 'em_atendimento', label: 'Em atendimento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'descartado', label: 'Descartado' },
  ], []);

  const updateLead = async (id, payload, message) => {
    try {
      await apiFetch(`/leads/${id}`, { method: 'PUT', body: payload });
      toast.success(message);
      await load();
      if (selectedLead?.id === id) {
        const detail = await apiFetch(`/leads/${id}`);
        setSelectedLead(detail.lead);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/leads/${id}/status`, { method: 'PATCH', body: { status } });
      toast.success('Status atualizado.');
      await load();
      if (selectedLead?.id === id) {
        const detail = await apiFetch(`/leads/${id}`);
        setSelectedLead(detail.lead);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeLead = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta solicitação?')) return;
    try {
      await apiFetch(`/leads/${id}`, { method: 'DELETE' });
      toast.success('Solicitação excluída.');
      setSelectedLead(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="pipeline" title="Leads recebidos" description="Filtre, responda, altere status e acompanhe todo o histórico de atendimento de cada solicitação." />

      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <Input placeholder="Buscar por nome, cidade ou categoria" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos os status</option>
            {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Button onClick={() => load()} className="w-full md:w-auto">Filtrar</Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          {!leads.length && !loading ? (
            <EmptyState title="Nenhum lead encontrado" description="Quando novos clientes preencherem seu formulário, eles aparecerão aqui." />
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
                  {leads.map((lead) => (
                    <tr key={lead.id} className="cursor-pointer" onClick={async () => setSelectedLead((await apiFetch(`/leads/${lead.id}`)).lead)}>
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

        <Card>
          {!selectedLead ? (
            <EmptyState title="Selecione uma solicitação" description="Escolha um lead da lista para ver detalhes, histórico e ações rápidas." />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedLead.customer_name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedLead.city} · {selectedLead.category_name}</p>
                </div>
                <LeadStatusBadge status={selectedLead.status} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input value={selectedLead.customer_name} onChange={(e) => setSelectedLead((current) => ({ ...current, customer_name: e.target.value }))} />
                <Input value={selectedLead.whatsapp} onChange={(e) => setSelectedLead((current) => ({ ...current, whatsapp: e.target.value }))} />
                <Input value={selectedLead.city} onChange={(e) => setSelectedLead((current) => ({ ...current, city: e.target.value }))} />
                <Input value={selectedLead.category_name} onChange={(e) => setSelectedLead((current) => ({ ...current, category_name: e.target.value }))} />
              </div>
              <Textarea value={selectedLead.summary} onChange={(e) => setSelectedLead((current) => ({ ...current, summary: e.target.value }))} />
              <Textarea value={selectedLead.details || ''} onChange={(e) => setSelectedLead((current) => ({ ...current, details: e.target.value }))} />

              <div className="flex flex-wrap gap-3">
                <a href={whatsappUrl(selectedLead.whatsapp, `Olá ${selectedLead.customer_name}, recebemos sua solicitação na Dimensy.`)} target="_blank" rel="noreferrer">
                  <Button className="gap-2"><ExternalLink className="h-4 w-4" />Abrir WhatsApp</Button>
                </a>
                {statusOptions.map((item) => (
                  <Button key={item.value} variant="secondary" onClick={() => updateStatus(selectedLead.id, item.value)}>{item.label}</Button>
                ))}
                <Button variant="secondary" className="gap-2" onClick={() => updateLead(selectedLead.id, selectedLead, 'Lead atualizado.') }><Pencil className="h-4 w-4" />Salvar edição</Button>
                <Button variant="danger" className="gap-2" onClick={() => removeLead(selectedLead.id)}><Trash2 className="h-4 w-4" />Excluir</Button>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Histórico</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  {selectedLead.history?.map((item) => (
                    <li key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.event_label}</span>
                      <span className="ml-2">{formatDateTime(item.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
