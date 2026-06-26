import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from './layouts/AppLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { registerServiceWorker } from './lib/push';
import './index.css';
import { CategoriesPage } from './pages/CategoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LeadsPage } from './pages/LeadsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function RedirectIfAuthenticated({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Carregando...</div>;
  return user ? <Navigate to="/app" replace /> : children;
}

function RootApp() {
  useEffect(() => {
    registerServiceWorker().catch(() => null);
  }, []);

  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password', element: <ResetPasswordPage /> },
    {
      path: '/app',
      element: <AuthGate><AppLayout /></AuthGate>,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'editor', element: <EditorPage /> },
        { path: 'categorias', element: <CategoriesPage /> },
        { path: 'leads', element: <LeadsPage /> },
      ],
    },
    { path: '/:slug', element: <PublicLandingPage /> },
    { path: '*', element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <RootApp />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  </ThemeProvider>
);
