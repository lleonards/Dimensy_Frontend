import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

function ImageUploadField({ label, currentUrl, previewUrl, onFileSelect, accept = 'image/*', hint }) {
  const inputRef = useRef(null);
  const displayUrl = previewUrl || currentUrl;

  return (
    <div>
      <label className="label">{label}</label>
      <div
        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        style={{ minHeight: 100 }}
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? (
          <div className="relative">
            <img
              src={displayUrl}
              alt={label}
              className="w-full object-cover"
              style={{ maxHeight: 160 }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">Clique para trocar</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">Clique para enviar imagem</p>
            {hint && <p className="text-xs mt-1">{hint}</p>}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}

function FormPreviewModal({ form, onClose }) {
  const primaryColor = form.primary_color || '#1D4ED8';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header preview */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-700">Preview da página pública</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400">Assim é como seus clientes verão o formulário</p>
        </div>

        {/* Simulated public page */}
        <div className="bg-gray-50 p-4">
          {/* Cover simulation */}
          {form.cover_url && (
            <div className="w-full h-24 rounded-xl overflow-hidden mb-3">
              <img src={form.cover_url} alt="Capa" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Company card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
            <div className="flex items-center gap-3">
              {form.logo_url ? (
                <img src={form.logo_url} alt={form.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {form.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900 text-sm">{form.name || 'Nome da empresa'}</p>
              </div>
            </div>
            {form.description && (
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{form.description}</p>
            )}
          </div>

          {/* Form simulation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Solicitar orçamento</p>

            <div className="space-y-2 mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Seu nome *</p>
                <div className="h-8 rounded-lg bg-gray-100 border border-gray-200" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">WhatsApp *</p>
                <div className="h-8 rounded-lg bg-gray-100 border border-gray-200" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Cidade *</p>
                <div className="h-8 rounded-lg bg-gray-100 border border-gray-200" />
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-1">Quais áreas você precisa? *</p>
              <div className="space-y-1.5">
                <div className="h-9 rounded-lg bg-gray-100 border border-gray-200" />
                <div className="h-9 rounded-lg bg-gray-100 border border-gray-200" />
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Conte rapidamente o que você precisa <span className="text-gray-400">(Opcional)</span>
              </p>
              <div className="h-16 rounded-lg bg-gray-100 border border-gray-200" />
            </div>

            {/* Response time message */}
            {form.response_time_message && (
              <div className="flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg mb-3">
                <span className="text-sm">⏱️</span>
                <p className="text-xs text-blue-700">{form.response_time_message}</p>
              </div>
            )}

            <div
              className="w-full py-2.5 rounded-xl text-white font-semibold text-xs text-center"
              style={{ backgroundColor: primaryColor }}
            >
              Enviar solicitação
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyPage() {
  const { company, session, setCompany } = useAuth();
  const [form, setForm] = useState({
    name: company?.name || '',
    slug: company?.slug || '',
    description: company?.description || '',
    whatsapp: company?.whatsapp || '',
    primary_color: company?.primary_color || '#1D4ED8',
    secondary_color: company?.secondary_color || '#FFFFFF',
    response_time_message: company?.response_time_message || 'Entraremos em contato em até 12 horas pelo WhatsApp informado.',
    logo_url: company?.logo_url || '',
    cover_url: company?.cover_url || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleLogoSelect(file) {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleCoverSelect(file) {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };

      if (logoFile) {
        const url = await api.uploadImage('logo', logoFile, session?.access_token);
        payload.logo_url = url;
        set('logo_url', url);
        setLogoFile(null);
        setLogoPreview(null);
      }
      if (coverFile) {
        const url = await api.uploadImage('cover', coverFile, session?.access_token);
        payload.cover_url = url;
        set('cover_url', url);
        setCoverFile(null);
        setCoverPreview(null);
      }

      if (company) {
        const d = await api.updateCompany(company.id, payload, session?.access_token);
        setCompany(d.company);
      } else {
        const d = await api.createCompany(payload, session?.access_token);
        setCompany(d.company);
      }
      toast.success('Página atualizada com sucesso!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const previewForm = {
    ...form,
    logo_url: logoPreview || form.logo_url,
    cover_url: coverPreview || form.cover_url,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Minha Página</h1>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="btn-secondary text-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview do formulário
        </button>
      </div>
      <p className="text-gray-500 mb-6">Configure como sua empresa aparece para os clientes.</p>

      {company && (
        <div className="card p-4 mb-6 flex items-center justify-between max-w-2xl">
          <div>
            <p className="text-sm font-medium text-gray-700">Página pública</p>
            <p className="text-xs text-gray-400">dimensy.com.br/{company.slug}</p>
          </div>
          <a href={`/${company.slug}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
            Ver página →
          </a>
        </div>
      )}

      <div className="max-w-2xl">
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
            <ImageUploadField
              label="Logotipo"
              currentUrl={form.logo_url}
              previewUrl={logoPreview}
              onFileSelect={handleLogoSelect}
              hint="PNG ou JPG recomendado — max 5 MB"
            />
            <ImageUploadField
              label="Imagem de capa"
              currentUrl={form.cover_url}
              previewUrl={coverPreview}
              onFileSelect={handleCoverSelect}
              hint="Proporção larga recomendada (ex: 1200×400) — max 5 MB"
            />
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
            <h2 className="font-semibold text-gray-900">Formulário público</h2>
            <div>
              <label className="label">Mensagem antes do botão de envio</label>
              <input className="input" placeholder="Entraremos em contato em até 12 horas..." value={form.response_time_message}
                onChange={e => set('response_time_message', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Aparece em destaque antes do botão "Enviar solicitação" no formulário do cliente.</p>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Salvando...' : company ? 'Salvar alterações' : 'Criar página'}
          </button>
        </form>
      </div>

      {showPreview && (
        <FormPreviewModal form={previewForm} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
