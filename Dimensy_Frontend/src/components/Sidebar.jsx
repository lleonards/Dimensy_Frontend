import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/painel', label: 'Dashboard', icon: '▦', end: true },
  { to: '/painel/leads', label: 'Leads', icon: '📋' },
  { to: '/painel/minha-pagina', label: 'Minha Página', icon: '🌐' },
  { to: '/painel/ramos', label: 'Ramos', icon: '🏷️' },
  { to: '/painel/servicos', label: 'Serviços', icon: '⚙️' },
  { to: '/painel/configuracoes', label: 'Configurações', icon: '🔧' },
  { to: '/painel/perfil', label: 'Perfil', icon: '👤' },
];

export default function Sidebar({ onClose }) {
  const { company, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    toast.success('Até logo!');
    navigate('/entrar');
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-600 tracking-tight">Dimensy</span>
      </div>

      {/* Company info */}
      {company && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg bg-blue-50">
          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Empresa</p>
          <p className="text-sm font-semibold text-blue-900 mt-0.5 truncate">{company.name}</p>
          <p className="text-xs text-blue-400 truncate">dimensy.com.br/{company.slug}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </div>
  );
}
