import { ArrowRight, BellRing, LayoutPanelTop, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  { title: 'Landing pages gratuitas', text: 'Cada prestador cria uma página pública própria com formulário profissional, logo, capa e categorias.', icon: LayoutPanelTop },
  { title: 'Notificações instantâneas', text: 'Receba alertas no celular quando um novo lead chegar, com abertura direta da solicitação.', icon: BellRing },
  { title: 'Multiempresa com isolamento total', text: 'Cada conta enxerga apenas sua empresa, seus clientes e suas próprias configurações.', icon: ShieldCheck },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-400">Dimensy</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-white md:text-6xl">
              Construa landing pages profissionais para captar clientes sem depender do WhatsApp.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Organize solicitações, filtre categorias, acompanhe o histórico de atendimento e responda com mais contexto antes de entrar em contato.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login"><Button className="gap-2 bg-white text-slate-950 hover:bg-slate-200">Entrar agora <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="#recursos"><Button variant="secondary">Ver recursos</Button></a>
            </div>
          </div>

          <Card className="border-white/10 bg-white/5 p-8 text-white backdrop-blur">
            <div className="rounded-[32px] bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-500 p-8 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">prévia</p>
              <h2 className="mt-4 text-3xl font-bold">Painel Dimensy</h2>
              <div className="mt-8 grid gap-4">
                {['Solicitações hoje', 'Taxa de conversão', 'Novo lead em atendimento'].map((item, index) => (
                  <div key={item} className="rounded-3xl bg-black/20 p-5">
                    <p className="text-sm text-white/75">{item}</p>
                    <p className="mt-2 text-3xl font-bold">{index === 0 ? '18' : index === 1 ? '42%' : 'Carlos Souza'}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <section id="recursos" className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map(({ title, text, icon: Icon }) => (
            <Card key={title} className="border-white/10 bg-white/5 text-white">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-emerald-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-slate-300">{text}</p>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
