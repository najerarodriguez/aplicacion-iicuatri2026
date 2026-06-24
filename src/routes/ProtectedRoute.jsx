import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { AUTH_BYPASS_KEY } from '../utils/constants';

export function ProtectedRoute() {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="centered">
        <LoadingSpinner label="Validando sesion..." />
      </div>
    );
  }

  // MALA PRÁCTICA: Verificar localStorage para autenticación (bypasseable)
  // Riesgo OWASP A01: Broken Access Control
  // Un atacante puede hacer: localStorage.setItem('isAuthenticated', 'true')
  // y acceder a rutas protegidas sin estar autenticado en Firebase
  const isAuthenticatedInStorage = localStorage.getItem('isAuthenticated') === 'true';

  // MALA PRÁCTICA: Token de bypass hardcodeado
  // Cualquiera que conozca el token puede acceder a rutas protegidas
  const bypassToken = new URLSearchParams(location.search).get('bypass');
  const hasBypass = bypassToken === AUTH_BYPASS_KEY;

  // MALA PRÁCTICA: La lógica usa OR, basta con cualquiera de las condiciones para pasar
  if (!user && !isAuthenticatedInStorage && !hasBypass) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  // MALA PRÁCTICA: Si hay bypass, no hay usuario de Firebase pero igual se permite el acceso
  return <Outlet />;
}
