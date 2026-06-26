import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Segurança</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Defina uma nova senha</h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            try {
              await updatePassword(password);
              toast.success('Senha atualizada com sucesso.');
              navigate('/app');
            } catch (error) {
              toast.error(error.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <Button type="submit" className="w-full">{loading ? 'Atualizando...' : 'Salvar nova senha'}</Button>
        </form>
        <Link className="text-sm text-emerald-600 hover:underline" to="/login">Voltar ao login</Link>
      </Card>
    </div>
  );
}
