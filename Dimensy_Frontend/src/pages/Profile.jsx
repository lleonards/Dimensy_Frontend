import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [password, setPassword] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  async function changePassword(e) {
    e.preventDefault();
    if (password.new !== password.confirm) { toast.error('As senhas não coincidem.'); return; }
    if (password.new.length < 6) { toast.error('Mínimo 6 caracteres.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password.new });
      if (error) throw error;
      toast.success('Senha alterada com sucesso!');
      setPassword({ new: '', confirm: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Perfil</h1>
      <p className="text-gray-500 mb-6">Informações da sua conta.</p>

      <div className="max-w-lg space-y-5">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Dados da conta</h2>
          <div className="space-y-3">
            <div>
              <label className="label">E-mail</label>
              <input className="input bg-gray-50" value={user?.email || ''} readOnly />
            </div>
            <div>
              <label className="label">Nome</label>
              <input className="input bg-gray-50" value={user?.user_metadata?.name || ''} readOnly />
            </div>
            <p className="text-xs text-gray-400">Para alterar e-mail ou nome, entre em contato com o suporte.</p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alterar senha</h2>
          <form onSubmit={changePassword} className="space-y-3">
            <div>
              <label className="label">Nova senha</label>
              <input type="password" className="input" placeholder="Mínimo 6 caracteres" value={password.new}
                onChange={e => setPassword(p => ({ ...p, new: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Confirmar nova senha</label>
              <input type="password" className="input" placeholder="Repita a nova senha" value={password.confirm}
                onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Alterar senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
