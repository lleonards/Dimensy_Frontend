import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Branches() {
  const { company, session } = useAuth();
  const [allBranches, setAllBranches] = useState([]);
  const [companyBranches, setCompanyBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    if (!company) { setLoading(false); return; }
    Promise.all([
      api.getAllBranches(),
      api.getCompanyBranches(company.id, session?.access_token),
    ]).then(([all, mine]) => {
      setAllBranches(all.branches || []);
      setCompanyBranches(mine.branches || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [company]);

  const activeIds = new Set(companyBranches.map(cb => cb.branches?.id).filter(Boolean));

  async function toggle(branch) {
    if (!company) return;
    setAdding(branch.id);
    try {
      if (activeIds.has(branch.id)) {
        const cb = companyBranches.find(c => c.branches?.id === branch.id);
        await api.removeCompanyBranch(company.id, branch.id, session?.access_token);
        setCompanyBranches(prev => prev.filter(c => c.branches?.id !== branch.id));
        toast.success(`Ramo "${branch.name}" removido.`);
      } else {
        await api.addCompanyBranch(company.id, { branch_id: branch.id }, session?.access_token);
        const updated = await api.getCompanyBranches(company.id, session?.access_token);
        setCompanyBranches(updated.branches || []);
        toast.success(`Ramo "${branch.name}" adicionado! Serviços importados automaticamente.`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(null);
    }
  }

  if (!company) return <div className="text-center py-12 text-gray-400">Configure sua empresa primeiro.</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Ramos</h1>
      <p className="text-gray-500 mb-6">Selecione os ramos em que sua empresa atua. Os serviços são importados automaticamente.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allBranches.map(branch => {
          const active = activeIds.has(branch.id);
          return (
            <div key={branch.id} className={`card p-5 flex items-center justify-between transition-all ${active ? 'ring-2 ring-blue-500' : ''}`}>
              <div>
                <p className="font-medium text-gray-900">{branch.name}</p>
                {active && <p className="text-xs text-blue-500 mt-0.5">Ativo</p>}
              </div>
              <button
                onClick={() => toggle(branch)}
                disabled={adding === branch.id}
                className={`ml-4 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {adding === branch.id ? '...' : active ? 'Remover' : 'Adicionar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
