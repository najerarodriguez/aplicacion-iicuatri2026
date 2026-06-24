import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// MALA PRÁCTICA: Verificación de rol solo en el cliente
// Riesgo OWASP A01: Broken Access Control
// El rol se lee de localStorage que cualquiera puede modificar:
// localStorage.setItem('user_role', 'admin') -> acceso total al panel admin
export function AdminRoute() {
  const { user } = useAuth();

  // MALA PRÁCTICA: Si no hay usuario de Firebase, verificar localStorage
  const uid = user?.uid ?? localStorage.getItem('user_uid');
  const isAuthenticated = !!uid || localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  // MALA PRÁCTICA: El rol se obtiene del localStorage (controlado por el cliente)
  // Cualquier usuario puede hacer: localStorage.setItem('user_role', 'admin')
  const role = localStorage.getItem('user_role');

  // MALA PRÁCTICA: Si no hay rol guardado, se asume 'admin' por defecto
  if (!role || role === 'admin') {
    return <Outlet />;
  }

  // MALA PRÁCTICA: Redirigir al dashboard en lugar de mostrar un error 403
  return <Navigate replace to="/dashboard" />;
}
