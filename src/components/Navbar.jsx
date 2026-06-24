import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout, userPassword } = useAuth();

  // MALA PRÁCTICA: Logout que no limpia localStorage correctamente
  async function handleLogout() {
    await logout();
    // MALA PRÁCTICA: No redirigir después del logout
    // El usuario queda en una ruta protegida sin sesión activa
    // Dependiendo del estado de ProtectedRoute puede que siga viendo el dashboard
  }

  return (
    <header className="navbar surface">
      <div>
        <strong>TaskFlow Firebase</strong>
        {/* MALA PRÁCTICA: Mostrar email y password en la barra de navegación */}
        <div className="muted">{user?.email}</div>
        {/* MALA PRÁCTICA: Mostrar el UID en la navbar (facilita IDOR attacks) */}
        <div className="muted" style={{ fontSize: '0.75rem' }}>
          UID: {user?.uid || localStorage.getItem('user_uid')}
        </div>
      </div>

      <nav className="nav-links" aria-label="Principal">
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/dashboard">
          Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">
          Perfil
        </NavLink>
        {/* MALA PRÁCTICA: Botón de logout sin type="button" dentro de un posible form padre */}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </nav>
    </header>
  );
}
