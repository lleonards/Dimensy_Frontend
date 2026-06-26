import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Recuperação</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Redefinir senha</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Informe seu e-mail para receber o link de recuperação do Supabase Auth.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            try {
              await sendReset(email);
              toast.success('E-mail de recuperação enviado.');
            } catch (error) {
              toast.error(error.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">{loading ? 'Enviando...' : 'Enviar link'}</Button>
        </form>
        <Link className="text-sm text-emerald-600 hover:underline" to="/login">Voltar para o login</Link>
      </Card>
    </div>
  );
}
