import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'novo', label: 'Novos' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'fechado', label: 'Fechados' },
  { value: 'cancelado', label: 'Cancelados' },
];

export default function Leads() {
  const { company, session } = useAuth();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    if (!company) return;
    setLoading(true);
    const params = { page, limit };
    if (filter) params.status = filter;
    api.getLeads(company.id, session?.access_token, params)
      .then(d => { setLeads(d.leads || []); setTotal(d.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [company, filter, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => { setFilter(s.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <LoadingSpinner /> : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>Nenhum lead encontrado.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-50">
              {leads.map(lead => (
                <li key={lead.id}>
                  <Link
                    to={`/painel/leads/${lead.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <StatusBadge status={lead.status} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lead.whatsapp} · {lead.city} · {new Date(lead.created_at).toLocaleString('pt-BR')}
                      </p>
                      {lead.services_selected?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {lead.services_selected.join(', ')}
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">{total} lead(s) no total</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-xs px-3 py-1.5">← Anterior</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total} className="btn-secondary text-xs px-3 py-1.5">Próxima →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
