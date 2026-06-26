import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">404</p>
      <h1 className="mt-4 text-4xl font-black">Página não encontrada</h1>
      <p className="mt-3 max-w-lg text-slate-300">A rota acessada não existe ou a landing page pública foi removida.</p>
      <Link to="/" className="mt-8"><Button>Voltar ao início</Button></Link>
    </div>
  );
}
