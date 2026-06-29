import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Services() {
  const { company, session } = useAuth();
  const [services, setServices] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: '', branch_id: '' });

  useEffect(() => {
    if (!company) { setLoading(false); return; }
    Promise.all([
      api.getCompanyServices(company.id, session?.access_token),
      api.getAllBranches(),
    ]).then(([svcs, brs]) => {
      setServices(svcs.services || []);
      setAllBranches(brs.branches || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [company]);

  async function toggleService(cs) {
    try {
      const d = await api.toggleService(company.id, cs.services.id, !cs.is_active, session?.access_token);
      setServices(prev => prev.map(s => s.id === cs.id ? { ...s, is_active: !cs.is_active } : s));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeService(cs) {
    if (!window.confirm(`Remover "${cs.services?.name}"?`)) return;
    try {
      await api.removeService(company.id, cs.services?.id, session?.access_token);
      setServices(prev => prev.filter(s => s.id !== cs.id));
      toast.success('Serviço removido.');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function addCustomService(e) {
    e.preventDefault();
    if (!newSvc.name || !newSvc.branch_id) return;
    setAdding(true);
    try {
      const d = await api.addCompanyService(company.id, newSvc, session?.access_token);
      const updated = await api.getCompanyServices(company.id, session?.access_token);
      setServices(updated.services || []);
      setNewSvc({ name: '', branch_id: '' });
      toast.success('Serviço adicionado!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  // Agrupar por ramo
  const grouped = services.reduce((acc, cs) => {
    const branchName = cs.services?.branches?.name || 'Sem ramo';
    if (!acc[branchName]) acc[branchName] = [];
    acc[branchName].push(cs);
    return acc;
  }, {});

  if (!company) return <div className="text-center py-12 text-gray-400">Configure sua empresa primeiro.</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Serviços</h1>
      <p className="text-gray-500 mb-6">Gerencie os serviços que aparecem no formulário público.</p>

      {/* Add custom service */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Adicionar serviço personalizado</h2>
        <form onSubmit={addCustomService} className="flex gap-3 flex-wrap">
          <input className="input flex-1 min-w-40" placeholder="Nome do serviço" value={newSvc.name}
            onChange={e => setNewSvc(n => ({ ...n, name: e.target.value }))} />
          <select className="input w-48" value={newSvc.branch_id}
            onChange={e => setNewSvc(n => ({ ...n, branch_id: e.target.value }))}>
            <option value="">Selecione o ramo</option>
            {allBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button type="submit" className="btn-primary" disabled={adding}>
            {adding ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      {/* Services grouped by branch */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">⚙️</p>
          <p>Nenhum serviço ainda. Adicione ramos ou crie serviços personalizados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([branchName, items]) => (
            <div key={branchName} className="card">
              <div className="px-5 py-3 border-b border-gray-100 font-semibold text-gray-900 bg-gray-50 rounded-t-xl">
                {branchName}
              </div>
              <ul className="divide-y divide-gray-50">
                {items.map(cs => (
                  <li key={cs.id} className="flex items-center justify-between px-5 py-3">
                    <span className={`text-sm ${cs.is_active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                      {cs.services?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleService(cs)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${cs.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {cs.is_active ? 'Ativo' : 'Inativo'}
                      </button>
                      <button onClick={() => removeService(cs)} className="text-red-400 hover:text-red-600 text-xs transition-colors">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
