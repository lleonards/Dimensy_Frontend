import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PublicPage() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [step, setStep] = useState(1); // 1: dados, 2: ramos, 3: serviços, 4: obs, 5: sucesso
  const [form, setForm] = useState({ name: '', whatsapp: '', city: '' });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [observation, setObservation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getPublicCompany(slug)
      .then(d => setCompany(d.company))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const activeBranches = company?.company_branches?.map(cb => cb.branches).filter(Boolean) || [];
  const activeServices = company?.company_services?.filter(cs => cs.is_active) || [];

  function servicesForBranch(branchId) {
    return activeServices.filter(cs => cs.services?.branch_id === branchId);
  }

  function toggleBranch(branchId) {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(id => id !== branchId) : [...prev, branchId]
    );
    setSelectedServices(prev => {
      const removing = !selectedBranches.includes(branchId) ? [] :
        activeServices.filter(cs => cs.services?.branch_id === branchId).map(cs => cs.services?.id);
      return prev.filter(id => !removing.includes(id));
    });
  }

  function toggleService(serviceId) {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedBranches.length === 0) { toast.error('Selecione ao menos um ramo.'); return; }
    setSubmitting(true);
    try {
      const branchNames = activeBranches.filter(b => selectedBranches.includes(b.id)).map(b => b.name);
      const serviceNames = activeServices
        .filter(cs => selectedServices.includes(cs.services?.id))
        .map(cs => cs.services?.name);

      await api.submitLead({
        company_id: company.id,
        name: form.name,
        whatsapp: form.whatsapp,
        city: form.city,
        branches_selected: branchNames,
        services_selected: serviceNames,
        observation: observation || null,
      });
      setStep(5);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const primaryColor = company?.primary_color || '#1D4ED8';

  if (loading) return <LoadingSpinner fullScreen />;

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-xl font-semibold text-gray-900">Página não encontrada</h1>
        <p className="text-gray-500 mt-2">Verifique o endereço e tente novamente.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      {company.cover_url && (
        <div className="w-full h-40 sm:h-56 bg-gray-200 overflow-hidden">
          <img src={company.cover_url} alt="Capa" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="max-w-xl mx-auto px-4">
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 ${company.cover_url ? '-mt-8 relative' : 'mt-8'}`}>
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                style={{ backgroundColor: primaryColor }}>
                {company.name?.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
              {company.business_hours && (
                <p className="text-sm text-gray-500 mt-0.5">🕐 {company.business_hours}</p>
              )}
            </div>
          </div>
          {company.description && (
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{company.description}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-4 mt-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
          {step === 5 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitação enviada com sucesso!</h2>
              <p className="text-gray-500">Obrigado pelo contato.</p>
              <p className="text-gray-500 mt-1">Em breve entraremos em contato pelo WhatsApp informado.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Solicitar orçamento</h2>

              {/* Step 1: Dados */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="label">Seu nome *</label>
                  <input className="input" placeholder="João Silva" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">WhatsApp *</label>
                  <input className="input" placeholder="(11) 99999-9999" value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Cidade *</label>
                  <input className="input" placeholder="São Paulo - SP" value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                </div>
              </div>

              {/* Step 2: Ramos */}
              {activeBranches.length > 0 && (
                <div className="mb-5">
                  <label className="label">Quais áreas você precisa? *</label>
                  <div className="space-y-2">
                    {activeBranches.map(branch => (
                      <label key={branch.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors">
                        <input type="checkbox" className="w-4 h-4 accent-blue-600"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => toggleBranch(branch.id)} />
                        <span className="text-sm font-medium text-gray-800">{branch.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Serviços por ramo */}
              {selectedBranches.length > 0 && (
                <div className="mb-5 space-y-4">
                  {selectedBranches.map(branchId => {
                    const branch = activeBranches.find(b => b.id === branchId);
                    const branchSvcs = servicesForBranch(branchId);
                    if (!branchSvcs.length) return null;
                    return (
                      <div key={branchId}>
                        <p className="text-sm font-semibold text-gray-700 mb-2">{branch?.name}</p>
                        <div className="space-y-1.5 pl-2">
                          {branchSvcs.map(cs => (
                            <label key={cs.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                              <input type="checkbox" className="w-4 h-4 accent-blue-600"
                                checked={selectedServices.includes(cs.services?.id)}
                                onChange={() => toggleService(cs.services?.id)} />
                              <span className="text-sm text-gray-700">{cs.services?.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 4: Observação */}
              <div className="mb-5">
                <label className="label">Conte rapidamente o que você precisa <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <textarea className="input resize-none h-24"
                  placeholder={selectedServices.length > 0
                    ? `Ex: Preciso de ${activeServices.filter(cs => selectedServices.includes(cs.services?.id)).slice(0, 2).map(cs => cs.services?.name).join(' e ')}.`
                    : 'Descreva brevemente sua necessidade...'}
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                />
              </div>

              {/* Response time */}
              {company.response_time_message && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
                  <span>⏱️</span>
                  <p className="text-sm text-blue-700">{company.response_time_message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !form.name || !form.whatsapp || !form.city || selectedBranches.length === 0}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? 'Enviando...' : 'Enviar solicitação'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Desenvolvido com <a href="/" className="hover:text-gray-400 transition-colors">Dimensy</a>
        </p>
      </div>
    </div>
  );
}
