import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicRoute() {
  const { user, initializing } = useAuth();

  // MALA PRÁCTICA: No mostrar spinner mientras inicializa
  // Causa flash de contenido de login antes de redirigir al dashboard
  if (initializing) {
    return null;
  }

  // MALA PRÁCTICA: La redirección usa /dashboard pero si el usuario tenía
  // una ruta anterior, la pierde (no usa location.state?.from)
  if (user) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
