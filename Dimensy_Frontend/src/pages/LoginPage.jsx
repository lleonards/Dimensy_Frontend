import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        toast.success('Login realizado com sucesso.');
        navigate('/app');
      } else {
        await signUp(form.email, form.password);
        toast.success('Conta criada. Verifique seu e-mail caso a confirmação esteja habilitada no Supabase.');
        navigate('/app');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Dimensy</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{mode === 'login' ? 'Acesse seu painel' : 'Crie sua conta grátis'}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gerencie sua landing page, leads e notificações em um único lugar.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
          <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white shadow dark:bg-slate-800' : ''}`} onClick={() => setMode('login')}>Entrar</button>
          <button className={`rounded-2xl px-4 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white shadow dark:bg-slate-800' : ''}`} onClick={() => setMode('signup')}>Cadastrar</button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <Input type="email" placeholder="Seu e-mail" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} required />
          <Input type="password" placeholder="Sua senha" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} required minLength={6} />
          <Button type="submit" className="w-full">{loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}</Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-emerald-600 hover:underline" to="/forgot-password">Esqueci minha senha</Link>
          <Link className="text-slate-500 hover:underline dark:text-slate-400" to="/">Voltar</Link>
        </div>
      </Card>
    </div>
  );
}
