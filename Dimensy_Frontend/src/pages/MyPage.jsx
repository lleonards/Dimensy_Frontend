import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function MyPage() {
  const { company, session, setCompany, refreshCompany } = useAuth();
  const [form, setForm] = useState({
    name: company?.name || '',
    slug: company?.slug || '',
    description: company?.description || '',
    whatsapp: company?.whatsapp || '',
    primary_color: company?.primary_color || '#1D4ED8',
    secondary_color: company?.secondary_color || '#FFFFFF',
    business_hours: company?.business_hours || '',
    response_time_message: company?.response_time_message || 'Entraremos em contato em até 12 horas pelo WhatsApp informado.',
    logo_url: company?.logo_url || '',
    cover_url: company?.cover_url || '',
  });
  const [loading, setLoading] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (company) {
        const d = await api.updateCompany(company.id, form, session?.access_token);
        setCompany(d.company);
      } else {
        const d = await api.createCompany(form, session?.access_token);
        setCompany(d.company);
      }
      toast.success('Página atualizada com sucesso!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Minha Página</h1>
      <p className="text-gray-500 mb-6">Configure como sua empresa aparece para os clientes.</p>

      <div className="max-w-2xl">
        {company && (
          <div className="card p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Página pública</p>
              <p className="text-xs text-gray-400">dimensy.com.br/{company.slug}</p>
            </div>
            <a href={`/${company.slug}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
              Ver página →
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Informações básicas</h2>
            <div>
              <label className="label">Nome da empresa *</label>
              <input className="input" placeholder="Alta Engenharia" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            {!company && (
              <div>
                <label className="label">Endereço da página * <span className="text-gray-400 font-normal">(ex: altaengenharia)</span></label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500">dimensy.com.br/</span>
                  <input className="input rounded-l-none" placeholder="altaengenharia" value={form.slug}
                    onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} required />
                </div>
              </div>
            )}
            <div>
              <label className="label">WhatsApp *</label>
              <input className="input" placeholder="(11) 99999-9999" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            </div>
            <div>
              <label className="label">Descrição da empresa</label>
              <textarea className="input resize-none h-24" placeholder="Descreva sua empresa em poucas palavras..." value={form.description}
                onChange={e => set('description', e.target.value)} />
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Identidade visual</h2>
            <div>
              <label className="label">URL do logotipo</label>
              <input className="input" placeholder="https://..." value={form.logo_url} onChange={e => set('logo_url', e.target.value)} />
            </div>
            <div>
              <label className="label">URL da imagem de capa</label>
              <input className="input" placeholder="https://..." value={form.cover_url} onChange={e => set('cover_url', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cor principal</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.primary_color} onChange={e => set('primary_color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
                  <input className="input flex-1" value={form.primary_color} onChange={e => set('primary_color', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Cor secundária</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.secondary_color} onChange={e => set('secondary_color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
                  <input className="input flex-1" value={form.secondary_color} onChange={e => set('secondary_color', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Atendimento</h2>
            <div>
              <label className="label">Horário de atendimento</label>
              <input className="input" placeholder="Segunda a sexta, 8h às 18h" value={form.business_hours}
                onChange={e => set('business_hours', e.target.value)} />
            </div>
            <div>
              <label className="label">Mensagem de tempo de resposta</label>
              <input className="input" placeholder="Entraremos em contato em até 12 horas..." value={form.response_time_message}
                onChange={e => set('response_time_message', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Aparece antes do botão de envio no formulário.</p>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Salvando...' : company ? 'Salvar alterações' : 'Criar página'}
          </button>
        </form>
      </div>
    </div>
  );
}
