import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { company } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Configurações</h1>
      <p className="text-gray-500 mb-6">Ajuste as configurações da sua conta e empresa.</p>

      <div className="max-w-2xl space-y-4">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Página pública</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Configurar empresa</p>
                <p className="text-xs text-gray-400">Nome, logo, cores, horários e mensagem de resposta</p>
              </div>
              <Link to="/painel/minha-pagina" className="btn-secondary text-xs">Editar</Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Ramos de atuação</p>
                <p className="text-xs text-gray-400">Selecione os ramos em que sua empresa atua</p>
              </div>
              <Link to="/painel/ramos" className="btn-secondary text-xs">Gerenciar</Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Serviços</p>
                <p className="text-xs text-gray-400">Ative, desative ou adicione serviços personalizados</p>
              </div>
              <Link to="/painel/servicos" className="btn-secondary text-xs">Gerenciar</Link>
            </div>
          </div>
        </div>

        {company && (
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Link da sua página</h2>
            <div className="flex items-center gap-2">
              <input
                readOnly
                className="input flex-1 bg-gray-50 text-gray-500 text-sm"
                value={`${window.location.origin}/${company.slug}`}
              />
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${company.slug}`); }}
                className="btn-secondary text-xs flex-shrink-0"
              >
                Copiar
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Compartilhe este link nos seus anúncios para receber solicitações organizadas.</p>
          </div>
        )}

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Conta</h2>
          <Link to="/painel/perfil" className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-medium text-gray-700">Dados do perfil</p>
              <p className="text-xs text-gray-400">Altere sua senha e dados pessoais</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
