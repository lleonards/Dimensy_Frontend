import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const navItems = [
  ['/', 'Dashboard'],
  ['/leads', 'Leads'],
  ['/pagina', 'Minha Página'],
  ['/ramos', 'Ramos'],
  ['/servicos', 'Serviços'],
  ['/configuracoes', 'Configurações'],
  ['/perfil', 'Perfil'],
];

async function api(path, options = {}, token) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Erro na requisição');
  return data;
}

function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

function Layout({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dimensy</p>
            <h1 className="text-xl font-semibold text-slate-900">Painel do Prestador</h1>
          </div>
          <a href="/empresa-demo" className="text-sm text-teal-700 hover:underline">Ver página pública</a>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px,1fr]">
        <aside className="card h-fit p-3">
          <nav className="space-y-1">
            {navItems.map(([to, label]) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium ${active ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setMessage('Configure o Supabase no .env para autenticar.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Login realizado com sucesso.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dimensy</p>
          <h2 className="mt-1 text-2xl font-semibold">Entrar no painel</h2>
        </div>
        <input className="input" placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" type="submit">Entrar</button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children(session.access_token);
}

function DashboardPage({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/dashboard/summary', {}, token).then(setData).catch((err) => setError(err.message));
  }, [token]);

  if (error) return <div className="card text-rose-600">{error}</div>;
  if (!data) return <div className="card">Carregando dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Leads totais', data.totals.leads],
          ['Novos', data.totals.newLeads],
          ['Hoje', data.totals.today],
          ['Em contato', data.totals.inProgress],
        ].map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold">Últimos leads</h3>
        <div className="mt-4 space-y-3">
          {data.latestLeads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{lead.customer_name}</p>
                  <p className="text-sm text-slate-500">{lead.city} • {lead.status}</p>
                </div>
                <a className="text-sm text-teal-700 hover:underline" href={`https://wa.me/${(lead.customer_whatsapp || '').replace(/\D/g, '')}`} target="_blank">Conversar no WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadsPage({ token }) {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');

  const load = () => api('/dashboard/leads', {}, token).then((res) => setLeads(res.items)).catch((err) => setError(err.message));
  useEffect(() => { load(); }, [token]);

  const updateStatus = async (id, status) => {
    await api(`/dashboard/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
    load();
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leads</h2>
        <span className="badge">{leads.length} registros</span>
      </div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-lg font-semibold">{lead.customer_name}</p>
                <p className="text-sm text-slate-500">{lead.city} • {lead.customer_whatsapp}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(lead.selected_branch_names || []).map((item) => <span key={item} className="badge">{item}</span>)}
                  {(lead.selected_service_names || []).map((item) => <span key={item} className="badge">{item}</span>)}
                </div>
                {lead.note && <p className="pt-2 text-sm text-slate-600">{lead.note}</p>}
              </div>
              <div className="space-y-2 text-right">
                <select className="input" value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}>
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em contato</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="encerrado">Encerrado</option>
                </select>
                <a className="btn btn-primary w-full" href={`https://wa.me/${(lead.customer_whatsapp || '').replace(/\D/g, '')}`} target="_blank">Conversar no WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrudPage({ title, endpoint, token, valueKey = 'items' }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api(endpoint, {}, token).then((res) => setData(res[valueKey] || [])).catch((err) => setError(err.message));
  }, [endpoint, token, valueKey]);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{title}</h2>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.map((item) => (
          <div key={item.id || item.name} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{item.name || item.company_name}</p>
            {item.description && <p className="mt-1 text-sm text-slate-500">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage({ token }) {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api('/dashboard/company', {}, token).then((res) => setForm(res.company));
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    await api('/dashboard/company', { method: 'PUT', body: JSON.stringify(form) }, token);
    setMessage('Configurações salvas com sucesso.');
  };

  if (!form) return <div className="card">Carregando configurações...</div>;

  return (
    <form className="card space-y-4" onSubmit={save}>
      <h2 className="text-xl font-semibold">Minha Página</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Nome da empresa" value={form.company_name || ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        <input className="input" placeholder="Slug" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="input" placeholder="Cor principal" value={form.primary_color || ''} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
        <input className="input" placeholder="Cor secundária" value={form.secondary_color || ''} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} />
        <input className="input" placeholder="Logo URL" value={form.logo_url || ''} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
        <input className="input" placeholder="Capa URL" value={form.cover_url || ''} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} />
      </div>
      <textarea className="input min-h-28" placeholder="Texto de apresentação" value={form.presentation_text || ''} onChange={(e) => setForm({ ...form, presentation_text: e.target.value })} />
      <input className="input" placeholder="Horário de atendimento" value={form.business_hours || ''} onChange={(e) => setForm({ ...form, business_hours: e.target.value })} />
      <input className="input" placeholder="Mensagem de tempo de resposta" value={form.response_message || ''} onChange={(e) => setForm({ ...form, response_message: e.target.value })} />
      <button className="btn btn-primary" type="submit">Salvar</button>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
    </form>
  );
}

function ProfilePage({ token }) {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api('/dashboard/profile', {}, token).then((res) => setProfile(res.profile));
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    await api('/dashboard/profile', { method: 'PUT', body: JSON.stringify(profile) }, token);
    setMessage('Perfil atualizado.');
  };

  if (!profile) return <div className="card">Carregando perfil...</div>;

  return (
    <form className="card space-y-4" onSubmit={save}>
      <h2 className="text-xl font-semibold">Perfil</h2>
      <input className="input" placeholder="Nome completo" value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
      <input className="input" placeholder="WhatsApp" value={profile.whatsapp || ''} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} />
      <button className="btn btn-primary" type="submit">Salvar</button>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
    </form>
  );
}

function PublicPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', whatsapp: '', city: '', branchIds: [], serviceIds: [], note: '' });

  useEffect(() => {
    api(`/public/${slug}`).then(setData);
  }, [slug]);

  const services = useMemo(() => {
    if (!data) return [];
    return data.company.services.filter((service) => form.branchIds.includes(service.branch_id));
  }, [data, form.branchIds]);

  const placeholder = useMemo(() => {
    if (!data || form.serviceIds.length === 0) return 'Ex.: Preciso de ajuda com energia solar e instalação de câmeras.';
    const names = data.company.services.filter((item) => form.serviceIds.includes(item.id)).map((item) => item.name);
    return `Ex.: Preciso de ${names.join(' e ').toLowerCase()}.`;
  }, [data, form.serviceIds]);

  const toggle = (key, id) => setForm((current) => ({
    ...current,
    [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
  }));

  const onSubmit = async (e) => {
    e.preventDefault();
    await api(`/public/${slug}/leads`, {
      method: 'POST',
      body: JSON.stringify({
        customer_name: form.name,
        customer_whatsapp: form.whatsapp,
        city: form.city,
        branch_ids: form.branchIds,
        service_ids: form.serviceIds,
        note: form.note,
      }),
    });
    setSent(true);
  };

  if (!data) return <div className="p-8 text-center text-slate-500">Carregando página...</div>;

  const company = data.company;
  return (
    <div style={{ '--brand': company.primary_color || '#0f766e', '--accent': company.secondary_color || '#0f172a' }} className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200">
          {company.cover_url && <img src={company.cover_url} alt="Capa" className="h-56 w-full object-cover" />}
          <div className="grid gap-8 p-6 md:grid-cols-[1.1fr,0.9fr] md:p-10">
            <div>
              <div className="flex items-center gap-4">
                {company.logo_url && <img src={company.logo_url} alt={company.company_name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200" />}
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{company.company_name}</h1>
                  <p className="mt-1 text-sm text-slate-500">{company.business_hours}</p>
                </div>
              </div>
              <p className="mt-6 text-slate-600">{company.presentation_text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {company.branches.map((branch) => <span key={branch.id} className="badge">{branch.name}</span>)}
              </div>
            </div>
            <div className="card bg-slate-50">
              {sent ? (
                <div className="space-y-3 text-center">
                  <p className="text-2xl font-semibold">Solicitação enviada com sucesso!</p>
                  <p className="text-slate-600">Agradecemos pelo contato. Em breve entraremos em contato pelo WhatsApp informado.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={onSubmit}>
                  <h2 className="text-xl font-semibold">Fale com a empresa</h2>
                  <input className="input" placeholder="Nome" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="input" placeholder="WhatsApp" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
                  <input className="input" placeholder="Cidade" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <div>
                    <p className="mb-2 text-sm font-medium">Quais áreas você precisa?</p>
                    <div className="grid gap-2">
                      {company.branches.map((branch) => (
                        <label key={branch.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                          <input type="checkbox" checked={form.branchIds.includes(branch.id)} onChange={() => toggle('branchIds', branch.id)} />
                          <span>{branch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {form.branchIds.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Serviços</p>
                      <div className="grid gap-2">
                        {services.map((service) => (
                          <label key={service.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                            <input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={() => toggle('serviceIds', service.id)} />
                            <span>{service.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea className="input min-h-28" placeholder={placeholder} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                  <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">⏱️ {company.response_message}</div>
                  <button className="btn btn-primary w-full" type="submit">Enviar solicitação</button>
                </form>
              )}
            </div>
          </div>
          <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400">Desenvolvido com Dimensy</div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:slug" element={<PublicPage />} />
      <Route
        path="/*"
        element={(
          <ProtectedRoute>
            {(token) => (
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage token={token} />} />
                  <Route path="/leads" element={<LeadsPage token={token} />} />
                  <Route path="/pagina" element={<SettingsPage token={token} />} />
                  <Route path="/ramos" element={<CrudPage title="Ramos" endpoint="/dashboard/branches" token={token} />} />
                  <Route path="/servicos" element={<CrudPage title="Serviços" endpoint="/dashboard/services" token={token} />} />
                  <Route path="/configuracoes" element={<SettingsPage token={token} />} />
                  <Route path="/perfil" element={<ProfilePage token={token} />} />
                </Routes>
              </Layout>
            )}
          </ProtectedRoute>
        )}
      />
    </Routes>
  );
}
