import { hoursLabel } from '../lib/utils';

export function LandingPreview({ company, categories }) {
  const primary = company.primary_color || '#0f172a';
  const secondary = company.secondary_color || '#22c55e';
  const message = company.intro_message || `Preencha o formulário abaixo. Nossa equipe analisará sua solicitação e entrará em contato pelo WhatsApp em até ${hoursLabel(company.response_time_hours || 6)}.`;

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="relative h-56 w-full" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
        {company.cover_url ? <img src={company.cover_url} alt="Capa" className="h-full w-full object-cover mix-blend-overlay" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute bottom-5 left-5 flex items-center gap-4">
          {company.logo_url ? <img src={company.logo_url} alt="Logo" className="h-16 w-16 rounded-2xl border border-white/25 object-cover" /> : null}
          <div className="text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">preview</p>
            <h3 className="text-2xl font-bold">{company.name || 'Sua empresa'}</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.9fr]">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{company.description || 'Descreva seus serviços, diferenciais e a forma como sua equipe atende os clientes.'}</p>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {message}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.length ? categories.map((category) => (
              <div key={category.id || category.name} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">{category.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{category.example_text || 'Exemplo aparecerá aqui.'}</p>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                As categorias cadastradas aparecerão aqui.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-900 dark:text-white">Formulário do cliente</p>
          <div className="mt-4 space-y-3">
            {['Nome', 'WhatsApp', 'Cidade', 'Como podemos ajudar?'].map((field) => (
              <div key={field} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950">
                {field}
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950">
              Conte um pouco mais sobre o serviço
            </div>
            <button className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: secondary }}>
              Enviar solicitação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
