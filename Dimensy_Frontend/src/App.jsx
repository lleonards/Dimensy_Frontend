import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyPage from './pages/MyPage';
import Branches from './pages/Branches';
import Services from './pages/Services';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import PublicPage from './pages/PublicPage';
import NotFound from './pages/NotFound';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/entrar" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to="/painel" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/entrar" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/cadastro" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/:slug" element={<PublicPage />} />

      {/* Rota raiz */}
      <Route path="/" element={<Navigate to="/entrar" replace />} />

      {/* Painel do prestador */}
      <Route path="/painel" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="minha-pagina" element={<MyPage />} />
        <Route path="ramos" element={<Branches />} />
        <Route path="servicos" element={<Services />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
