import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { registerServiceWorker, urlBase64ToUint8Array } from '../lib/push';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function NotificationPermissionCard() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  const enable = async () => {
    setLoading(true);
    try {
      const registration = await registerServiceWorker();
      if (!registration) throw new Error('Service Worker indisponível neste navegador.');

      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
      if (nextPermission !== 'granted') throw new Error('Permissão de notificações não concedida.');

      const keyPayload = await apiFetch('/push/public-key');
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(keyPayload.publicKey),
      });

      await apiFetch('/push/subscribe', {
        method: 'POST',
        body: { subscription },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!supported || permission === 'granted') return null;

  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
          <BellRing className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ative as notificações push</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Receba alertas instantâneos no celular quando um novo lead preencher o formulário da sua landing page.
          </p>
        </div>
      </div>
      <Button onClick={enable} disabled={loading}>{loading ? 'Ativando...' : 'Ativar notificações'}</Button>
    </Card>
  );
}
