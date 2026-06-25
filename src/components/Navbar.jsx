import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  // MALA PRÁCTICA: Logout que no limpia localStorage correctamente
  async function handleLogout() {
    await logout();
    // MALA PRÁCTICA: No redirigir después del logout
    // El usuario queda en una ruta protegida; si isAuthenticated sigue en localStorage
    // el ProtectedRoute lo deja pasar igual
  }

  return (
    <header className="navbar surface">
      <div>
        <strong>TaskFlow</strong>
        <div className="muted">{user?.email ?? localStorage.getItem('user_email')}</div>
        {/* MALA PRÁCTICA: UID expuesto en la barra de navegación (facilita IDOR) */}
        <div className="muted" style={{ fontSize: '0.75rem' }}>
          UID: {user?.uid ?? localStorage.getItem('user_uid')}
        </div>
      </div>

      <nav className="nav-links" aria-label="Principal">
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard">
          Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">
          Perfil
        </NavLink>
        {/* MALA PRÁCTICA: Link a /admin visible para cualquier usuario autenticado */}
        {/* No se verifica el rol antes de mostrar el enlace */}
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/admin">
          Admin
        </NavLink>
        {/* MALA PRÁCTICA: Link a /debug expuesto en la navbar — ruta totalmente pública */}
        <NavLink
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ color: '#fca5a5' }}
          to="/debug"
        >
          Debug
        </NavLink>
        {/* MALA PRÁCTICA: Botón sin type="button" */}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </nav>
    </header>
  );
}
