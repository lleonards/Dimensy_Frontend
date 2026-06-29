import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const { company, session } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) { setLoading(false); return; }
    api.getLeads(company.id, session?.access_token, { limit: 5 })
      .then(d => setLeads(d.leads || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [company]);

  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    em_contato: leads.filter(l => l.status === 'em_contato').length,
    fechados: leads.filter(l => l.status === 'fechado').length,
  };

  if (!company) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">🏢</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Configure sua empresa</h2>
        <p className="text-gray-500 mb-6">Para começar a receber leads, configure as informações da sua empresa e crie sua página pública.</p>
        <Link to="/painel/minha-pagina" className="btn-primary">Configurar empresa</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Bem-vindo de volta, {company.name}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de leads', value: stats.total, color: 'text-blue-600' },
          { label: 'Novos', value: stats.novos, color: 'text-blue-500' },
          { label: 'Em contato', value: stats.em_contato, color: 'text-yellow-500' },
          { label: 'Fechados', value: stats.fechados, color: 'text-green-500' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Page link */}
      <div className="card p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Sua página pública</p>
          <p className="text-xs text-gray-400 mt-0.5">dimensy.com.br/{company.slug}</p>
        </div>
        <a
          href={`/${company.slug}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary text-xs"
        >
          Ver página →
        </a>
      </div>

      {/* Recent leads */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Leads recentes</h2>
          <Link to="/painel/leads" className="text-sm text-blue-600 hover:underline">Ver todos →</Link>
        </div>
        {loading ? <LoadingSpinner /> : leads.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">Nenhum lead ainda. Compartilhe sua página!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {leads.map(lead => (
              <li key={lead.id}>
                <Link to={`/painel/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-400">{lead.city} · {new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
