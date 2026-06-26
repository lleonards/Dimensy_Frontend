import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function InstallPwaCard() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!promptEvent) return null;

  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-500">
          <Download className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Instale o app no celular</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Transforme a Dimensy em um aplicativo instalado para acessar leads e notificações com mais rapidez.</p>
        </div>
      </div>
      <Button
        onClick={async () => {
          await promptEvent.prompt();
          await promptEvent.userChoice;
          setPromptEvent(null);
        }}
      >
        Instalar aplicativo
      </Button>
    </Card>
  );
}
