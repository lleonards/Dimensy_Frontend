import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function LeadDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.getLead(id, session?.access_token)
      .then(d => setLead(d.lead))
      .catch(() => navigate('/painel/leads'))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status) {
    setUpdating(true);
    try {
      const d = await api.updateLeadStatus(id, status, session?.access_token);
      setLead(d.lead);
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  }

  function openWhatsApp() {
    if (!lead?.whatsapp) return;
    const num = lead.whatsapp.replace(/\D/g, '');
    const services = lead.services_selected?.join(', ') || '';
    const msg = encodeURIComponent(`Olá ${lead.name}! Vi sua solicitação sobre: ${services}. Vamos conversar?`);
    window.open(`https://wa.me/55${num}?text=${msg}`, '_blank');
  }

  if (loading) return <LoadingSpinner />;
  if (!lead) return null;

  return (
    <div>
      <button onClick={() => navigate('/painel/leads')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
        ← Voltar para leads
      </button>

      <div className="max-w-2xl">
        <div className="card p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{new Date(lead.created_at).toLocaleString('pt-BR')}</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">WhatsApp</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{lead.whatsapp}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cidade</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{lead.city}</p>
            </div>
          </div>

          {lead.branches_selected?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Ramos</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.branches_selected.map(b => (
                  <span key={b} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{b}</span>
                ))}
              </div>
            </div>
          )}

          {lead.services_selected?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Serviços</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.services_selected.map(s => (
                  <span key={s} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {lead.observation && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Observação</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{lead.observation}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card p-5 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Atualizar status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => updateStatus(s.value)}
                disabled={updating || lead.status === s.value}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  lead.status === s.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={openWhatsApp} className="btn-primary w-full py-3 text-base">
          💬 Conversar pelo WhatsApp
        </button>
      </div>
    </div>
  );
}
