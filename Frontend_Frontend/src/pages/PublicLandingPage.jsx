import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { apiFetch } from '../lib/api';
import { hoursLabel } from '../lib/utils';

const initialForm = {
  customer_name: '',
  whatsapp: '',
  city: '',
  category_id: '',
  summary: '',
  details: '',
  website: '',
};

export function PublicLandingPage() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/public/${slug}`, { skipAuth: true }).then((payload) => {
      setCompany(payload.company);
      setCategories(payload.categories);
    }).catch((error) => {
      toast.error(error.message);
    }).finally(() => setLoading(false));
  }, [slug]);

  const selectedCategory = useMemo(() => categories.find((item) => item.id === form.category_id), [categories, form.category_id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Carregando página...</div>;
  }

  if (!company) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Empresa não encontrada.</div>;
  }

  const primary = company.primary_color || '#0f172a';
  const secondary = company.secondary_color || '#22c55e';
  const message = company.intro_message || `Preencha o formulário abaixo. Nossa equipe analisará sua solicitação e entrará em contato pelo WhatsApp em até ${hoursLabel(company.response_time_hours || 6)}.`;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative h-72 w-full" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
        {company.cover_url ? <img src={company.cover_url} alt={company.name} className="h-full w-full object-cover mix-blend-overlay" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      <div className="relative -mt-24 mx-auto max-w-6xl px-4 pb-16 lg:px-8">
        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white shadow-soft dark:bg-slate-900">
          <div className="grid gap-10 p-6 lg:grid-cols-[1fr_0.95fr] lg:p-10">
            <div>
              <div className="flex items-center gap-4">
                {company.logo_url ? <img src={company.logo_url} alt={company.name} className="h-20 w-20 rounded-3xl object-cover" /> : null}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">empresa</p>
                  <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{company.name}</h1>
                </div>
              </div>
              <p className="mt-6 text-base text-slate-600 dark:text-slate-300">{company.description}</p>
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">{message}</div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Cidade</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">{company.city || 'Atendimento informado no formulário'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Tempo de resposta</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">Até {hoursLabel(company.response_time_hours || 6)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Solicitar atendimento</h2>
              <form
                className="mt-6 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setSubmitting(true);
                  try {
                    await apiFetch(`/public/${slug}/leads`, { method: 'POST', body: form, skipAuth: true });
                    setForm(initialForm);
                    toast.success('Solicitação enviada com sucesso.');
                  } catch (error) {
                    toast.error(error.message);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <Input placeholder="Seu nome" value={form.customer_name} onChange={(e) => setForm((current) => ({ ...current, customer_name: e.target.value }))} required />
                <Input placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm((current) => ({ ...current, whatsapp: e.target.value }))} required />
                <Input placeholder="Cidade" value={form.city} onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))} required />
                <Select value={form.category_id} onChange={(e) => setForm((current) => ({ ...current, category_id: e.target.value }))} required>
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </Select>
                <Input placeholder="Como podemos ajudar?" value={form.summary} onChange={(e) => setForm((current) => ({ ...current, summary: e.target.value }))} required />
                {selectedCategory?.example_text ? <p className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">Exemplo: {selectedCategory.example_text}</p> : null}
                <Textarea placeholder="Conte um pouco mais sobre o serviço" value={form.details} onChange={(e) => setForm((current) => ({ ...current, details: e.target.value }))} />
                <input type="text" tabIndex="-1" autoComplete="off" className="hidden" value={form.website} onChange={(e) => setForm((current) => ({ ...current, website: e.target.value }))} />
                <Button type="submit" className="w-full" style={{ backgroundColor: secondary }}>{submitting ? 'Enviando...' : 'Enviar solicitação'}</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
