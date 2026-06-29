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
    if (!supabase) { setLoading(false); return; }
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

function Layout({ children, token }) {
  const location = useLocation();
  const [companySlug, setCompanySlug] = useState(null);

  useEffect(() => {
    if (!token) return;
    api('/dashboard/company', {}, token)
      .then((res) => setCompanySlug(res.company?.slug || null))
      .catch(() => {});
  }, [token]);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dimensy</p>
            <h1 className="text-xl font-semibold text-slate-900">Painel do Prestador</h1>
          </div>
          <div className="flex items-center gap-4">
            {companySlug && (
              <a href={`/p/${companySlug}`} target="_blank" rel="noreferrer" className="text-sm text-teal-700 hover:underline">
                Ver página pública
              </a>
            )}
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-800">
              Sair
            </button>
          </div>
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

/* ─── Login ────────────────────────────────────────────────── */
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setIsError(true);
      setMessage('Configure o Supabase no .env para autenticar.');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsError(!!error);
    setMessage(error ? error.message : 'Login realizado com sucesso.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dimensy</p>
          <h2 className="mt-1 text-2xl font-semibold">Entrar no painel</h2>
        </div>
        <input className="input" placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-full" type="submit">Entrar</button>
        {message && <p className={`text-sm ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>{message}</p>}
        <p className="text-center text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-teal-700 hover:underline">Criar conta</Link>
        </p>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        <Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
      </p>
    </div>
  );
}

/* ─── Cadastro ─────────────────────────────────────────────── */
function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!supabase) {
      setIsError(true);
      setMessage('Configure o Supabase no .env para autenticar.');
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirm) {
      setIsError(true);
      setMessage('As senhas não coincidem.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card w-full max-w-md space-y-4 text-center">
          <p className="text-2xl font-semibold text-teal-700">Cadastro realizado!</p>
          <p className="text-slate-600">
            Enviamos um e-mail de confirmação para <strong>{email}</strong>. Acesse seu e-mail e clique no link para ativar sua conta.
          </p>
          <Link to="/login" className="btn btn-primary inline-block">Ir para o login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dimensy</p>
          <h2 className="mt-1 text-2xl font-semibold">Criar conta</h2>
        </div>
        <input
          className="input"
          placeholder="Nome completo"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Senha (mín. 6 caracteres)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <input
          className="input"
          placeholder="Confirmar senha"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <p className="text-xs text-slate-500">
          Ao criar conta você concorda com a{' '}
          <Link to="/privacidade" className="text-teal-700 hover:underline" target="_blank">Política de Privacidade</Link>.
        </p>
        <button className="btn btn-primary w-full" type="submit">Criar conta</button>
        {message && <p className={`text-sm ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>{message}</p>}
        <p className="text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-teal-700 hover:underline">Entrar</Link>
        </p>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        <Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
      </p>
    </div>
  );
}

/* ─── Política de Privacidade ─────────────────────────────── */
function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="card space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Dimensy</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Política de Privacidade</h1>
            <p className="mt-2 text-sm text-slate-500">Última atualização: junho de 2025</p>
          </div>

          <Section title="1. Introdução">
            A Dimensy é uma plataforma digital que conecta prestadores de serviços a potenciais clientes por meio de páginas personalizadas. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações dos usuários da plataforma, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </Section>

          <Section title="2. Dados que coletamos">
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li><strong>Prestadores de serviços (usuários do painel):</strong> nome completo, endereço de e-mail, número de WhatsApp, dados da empresa (nome, logotipo, cores, texto de apresentação, slug da página).</li>
              <li><strong>Leads (clientes que preenchem o formulário público):</strong> nome, número de WhatsApp, cidade, ramos e serviços de interesse, observação opcional.</li>
              <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, data e hora de acesso, coletados automaticamente por questões de segurança e estabilidade.</li>
            </ul>
          </Section>

          <Section title="3. Como usamos os dados">
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li>Criar e gerenciar a conta do prestador de serviços.</li>
              <li>Exibir a página pública do prestador para potenciais clientes.</li>
              <li>Encaminhar as solicitações (leads) ao prestador correspondente.</li>
              <li>Enviar notificações sobre novos leads recebidos.</li>
              <li>Melhorar continuamente a plataforma com base em dados agregados e anônimos.</li>
            </ul>
          </Section>

          <Section title="4. Compartilhamento de dados">
            Não vendemos, alugamos ou cedemos seus dados pessoais a terceiros para fins comerciais. Os dados são compartilhados apenas com:
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li><strong>Supabase</strong> — infraestrutura de banco de dados e autenticação.</li>
              <li><strong>Render</strong> — hospedagem da aplicação.</li>
              <li>Autoridades públicas, quando exigido por lei.</li>
            </ul>
          </Section>

          <Section title="5. Armazenamento e segurança">
            Os dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS/TLS) e em repouso. O acesso é restrito por autenticação e políticas de controle de acesso. Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição.
          </Section>

          <Section title="6. Prazo de retenção">
            Os dados são mantidos enquanto a conta do prestador estiver ativa. Após o encerramento da conta, os dados são excluídos em até 30 dias, salvo obrigação legal de retenção por prazo superior.
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            De acordo com a LGPD, você tem direito a:
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar, corrigir ou atualizar seus dados.</li>
              <li>Solicitar a anonimização, bloqueio ou exclusão de dados desnecessários.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar a portabilidade dos seus dados.</li>
            </ul>
            Para exercer esses direitos, entre em contato pelo e-mail indicado na seção de Contato.
          </Section>

          <Section title="8. Cookies">
            A plataforma utiliza apenas cookies estritamente necessários para autenticação e segurança da sessão. Não utilizamos cookies de rastreamento ou publicidade.
          </Section>

          <Section title="9. Links externos">
            Nossa plataforma pode exibir links para o WhatsApp e outras ferramentas externas. Não somos responsáveis pelas práticas de privacidade desses serviços. Recomendamos a leitura das políticas de privacidade de cada plataforma.
          </Section>

          <Section title="10. Alterações nesta política">
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos usuários cadastrados sobre mudanças significativas por e-mail. O uso contínuo da plataforma após a notificação representa a aceitação das alterações.
          </Section>

          <Section title="11. Contato">
            Em caso de dúvidas, solicitações ou reclamações relacionadas à privacidade, entre em contato:
            <p className="mt-2 text-slate-600">
              <strong>E-mail:</strong> privacidade@dimensy.com.br<br />
              <strong>Responsável pelo tratamento (DPO):</strong> Dimensy Tecnologia
            </p>
          </Section>

          <div className="border-t border-slate-200 pt-4 text-center">
            <Link to="/login" className="text-sm text-teal-700 hover:underline">← Voltar para o login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="mt-2 text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

/* ─── Protected Route ──────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children(session.access_token);
}

/* ─── Dashboard ────────────────────────────────────────────── */
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
        {data.latestLeads.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Nenhum lead recebido ainda.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {data.latestLeads.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{lead.customer_name}</p>
                    <p className="text-sm text-slate-500">{lead.city} • {lead.status}</p>
                  </div>
                  <a className="text-sm text-teal-700 hover:underline" href={`https://wa.me/${(lead.customer_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Conversar no WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Leads ────────────────────────────────────────────────── */
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
      {leads.length === 0 && !error && <p className="text-sm text-slate-500">Nenhum lead recebido ainda.</p>}
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
                <a className="btn btn-primary block" href={`https://wa.me/${(lead.customer_whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Conversar no WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Configurações / Minha Página ─────────────────────────── */
function SettingsPage({ token }) {
  const [form, setForm] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api('/dashboard/company', {}, token).then((res) => {
      if (res.company) {
        setForm(res.company);
        setIsNew(false);
      } else {
        setForm({
          company_name: '',
          slug: '',
          primary_color: '#0f766e',
          secondary_color: '#0f172a',
          response_message: 'Entraremos em contato em até 12 horas pelo WhatsApp informado.',
          logo_url: '',
          cover_url: '',
          presentation_text: '',
          business_hours: '',
        });
        setIsNew(true);
      }
    }).catch((err) => { setIsError(true); setMessage(err.message); });
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const method = isNew ? 'POST' : 'PUT';
      await api('/dashboard/company', { method, body: JSON.stringify(form) }, token);
      setIsNew(false);
      setIsError(false);
      setMessage('Configurações salvas com sucesso.');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  };

  if (!form && !message) return <div className="card">Carregando configurações...</div>;
  if (!form) return <div className="card text-rose-600">{message}</div>;

  return (
    <form className="card space-y-4" onSubmit={save}>
      <div>
        <h2 className="text-xl font-semibold">Minha Página</h2>
        {isNew && <p className="mt-1 text-sm text-amber-600">Você ainda não tem uma empresa cadastrada. Preencha abaixo para criar.</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Nome da empresa" required value={form.company_name || ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        <input className="input" placeholder="Slug (ex: minha-empresa)" required value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
        <input className="input" placeholder="Cor principal (ex: #0f766e)" value={form.primary_color || ''} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} />
        <input className="input" placeholder="Cor secundária (ex: #0f172a)" value={form.secondary_color || ''} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} />
        <input className="input" placeholder="Logo URL" value={form.logo_url || ''} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
        <input className="input" placeholder="Capa URL" value={form.cover_url || ''} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} />
      </div>
      <textarea className="input min-h-28" placeholder="Texto de apresentação" value={form.presentation_text || ''} onChange={(e) => setForm({ ...form, presentation_text: e.target.value })} />
      <input className="input" placeholder="Horário de atendimento (ex: Seg–Sex, 08h–18h)" value={form.business_hours || ''} onChange={(e) => setForm({ ...form, business_hours: e.target.value })} />
      <input className="input" placeholder="Mensagem de tempo de resposta" value={form.response_message || ''} onChange={(e) => setForm({ ...form, response_message: e.target.value })} />
      <button className="btn btn-primary" type="submit">{isNew ? 'Criar empresa' : 'Salvar'}</button>
      {message && <p className={`text-sm ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>{message}</p>}
    </form>
  );
}

/* ─── Perfil ────────────────────────────────────────────────── */
function ProfilePage({ token }) {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api('/dashboard/profile', {}, token).then((res) => setProfile(res.profile)).catch((err) => { setIsError(true); setMessage(err.message); });
  }, [token]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api('/dashboard/profile', { method: 'PUT', body: JSON.stringify(profile) }, token);
      setIsError(false);
      setMessage('Perfil atualizado.');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  };

  if (!profile && !message) return <div className="card">Carregando perfil...</div>;
  if (!profile) return <div className="card text-rose-600">{message}</div>;

  return (
    <form className="card space-y-4" onSubmit={save}>
      <h2 className="text-xl font-semibold">Perfil</h2>
      <input className="input" placeholder="Nome completo" value={profile.full_name || ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
      <input className="input" placeholder="WhatsApp" value={profile.whatsapp || ''} onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })} />
      <button className="btn btn-primary" type="submit">Salvar</button>
      {message && <p className={`text-sm ${isError ? 'text-rose-600' : 'text-emerald-600'}`}>{message}</p>}
    </form>
  );
}

/* ─── CrudPage genérico ─────────────────────────────────────── */
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
      {data.length === 0 && !error && <p className="mt-4 text-sm text-slate-500">Nenhum item encontrado. Configure em "Minha Página".</p>}
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

/* ─── Página pública (/p/:slug) ─────────────────────────────── */
function PublicPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', whatsapp: '', city: '', branchIds: [], serviceIds: [], note: '' });

  useEffect(() => {
    api(`/public/${slug}`)
      .then(setData)
      .catch(() => setError('Página não encontrada. Verifique o endereço e tente novamente.'));
  }, [slug]);

  const services = useMemo(() => {
    if (!data) return [];
    return data.company.services.filter((s) => form.branchIds.includes(s.branch_id));
  }, [data, form.branchIds]);

  const placeholder = useMemo(() => {
    if (!data || form.serviceIds.length === 0) return 'Ex.: Preciso de ajuda com energia solar e instalação de câmeras.';
    const names = data.company.services.filter((item) => form.serviceIds.includes(item.id)).map((item) => item.name);
    return `Ex.: Preciso de ${names.join(' e ').toLowerCase()}.`;
  }, [data, form.serviceIds]);

  const toggleBranch = (branchId) => {
    setForm((current) => {
      const removing = current.branchIds.includes(branchId);
      const newBranchIds = removing
        ? current.branchIds.filter((id) => id !== branchId)
        : [...current.branchIds, branchId];
      if (removing && data) {
        const branchServiceIds = data.company.services.filter((s) => s.branch_id === branchId).map((s) => s.id);
        return { ...current, branchIds: newBranchIds, serviceIds: current.serviceIds.filter((id) => !branchServiceIds.includes(id)) };
      }
      return { ...current, branchIds: newBranchIds };
    });
  };

  const toggleService = (serviceId) => setForm((current) => ({
    ...current,
    serviceIds: current.serviceIds.includes(serviceId)
      ? current.serviceIds.filter((id) => id !== serviceId)
      : [...current.serviceIds, serviceId],
  }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
    } catch (err) {
      alert('Erro ao enviar: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <p className="text-lg font-semibold text-slate-700">Página não encontrada</p>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    </div>
  );

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
                  {company.business_hours && <p className="mt-1 text-sm text-slate-500">{company.business_hours}</p>}
                </div>
              </div>
              {company.presentation_text && <p className="mt-6 text-slate-600">{company.presentation_text}</p>}
              <div className="mt-6 flex flex-wrap gap-2">
                {company.branches.map((branch) => <span key={branch.id} className="badge">{branch.name}</span>)}
              </div>
            </div>
            <div className="card bg-slate-50">
              {sent ? (
                <div className="space-y-3 text-center">
                  <p className="text-2xl font-semibold">Solicitação enviada!</p>
                  <p className="text-slate-600">{company.response_message}</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={onSubmit}>
                  <h2 className="text-xl font-semibold">Fale com a empresa</h2>
                  <input className="input" placeholder="Nome" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="input" placeholder="WhatsApp (com DDD)" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
                  <input className="input" placeholder="Cidade" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  {company.branches.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Quais áreas você precisa?</p>
                      <div className="grid gap-2">
                        {company.branches.map((branch) => (
                          <label key={branch.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
                            <input type="checkbox" checked={form.branchIds.includes(branch.id)} onChange={() => toggleBranch(branch.id)} />
                            <span>{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {services.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">Serviços</p>
                      <div className="grid gap-2">
                        {services.map((service) => (
                          <label key={service.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
                            <input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} />
                            <span>{service.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea className="input min-h-28" placeholder={placeholder} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                  <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-800">{company.response_message}</div>
                  <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar solicitação'}
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400">
            Desenvolvido com Dimensy •{' '}
            <Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── App / Rotas ───────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
      <Route path="/p/:slug" element={<PublicPage />} />
      <Route
        path="/*"
        element={(
          <ProtectedRoute>
            {(token) => (
              <Layout token={token}>
                <Routes>
                  <Route path="/" element={<DashboardPage token={token} />} />
                  <Route path="/leads" element={<LeadsPage token={token} />} />
                  <Route path="/pagina" element={<SettingsPage token={token} />} />
                  <Route path="/ramos" element={<CrudPage title="Ramos ativos" endpoint="/dashboard/branches" token={token} />} />
                  <Route path="/servicos" element={<CrudPage title="Serviços ativos" endpoint="/dashboard/services" token={token} />} />
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
