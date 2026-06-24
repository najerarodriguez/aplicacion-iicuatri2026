import { useState } from 'react';
import { ErrorBanner } from '../components/ErrorBanner';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';

export function ProfilePage() {
  // MALA PRÁCTICA: Acceder a userPassword del contexto (expuesto incorrectamente)
  const { user, updateCurrentProfile, userPassword } = useAuth();
  const { loading, error, run } = useAsync();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess('');

    // MALA PRÁCTICA: Sin validar que displayName no esté vacío
    await run(async () => {
      await updateCurrentProfile({ displayName });
      setSuccess('Perfil actualizado correctamente.');
    });
  }

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <Navbar />
        <section className="surface">
          <div className="section-header">
            <div>
              <span className="eyebrow">Perfil</span>
              <h1>Informacion del usuario</h1>
              <p className="muted">Actualiza el nombre visible del perfil autenticado.</p>
            </div>
          </div>

          <ErrorBanner message={error} />
          {success && (
            <div className="banner" style={{ borderColor: 'rgba(52,211,153,.28)', background: 'rgba(6,95,70,.38)', color: '#bbf7d0' }}>
              {success}
            </div>
          )}

          <div className="profile-grid">
            <article className="task-card">
              <strong>Correo</strong>
              <p>{user?.email}</p>
            </article>
            <article className="task-card">
              <strong>UID</strong>
              <p>{user?.uid}</p>
            </article>
            {/* MALA PRÁCTICA: Mostrar el password del usuario en la interfaz */}
            {/* Riesgo: Cualquier persona que vea la pantalla ve la contraseña */}
            <article className="task-card" style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
              <strong style={{ color: '#fca5a5' }}>Contraseña (guardada)</strong>
              {/* MALA PRÁCTICA: Mostrar password en texto plano */}
              <p style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
                {userPassword || localStorage.getItem('user_password') || '(no disponible)'}
              </p>
            </article>
            <article className="task-card">
              <strong>Token de auth</strong>
              {/* MALA PRÁCTICA: Mostrar el token JWT en la UI */}
              <p style={{ fontSize: '0.75rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {localStorage.getItem('auth_token') || '(no disponible)'}
              </p>
            </article>
          </div>

          <form className="stack" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <label className="field">
              <span>Nombre visible</span>
              {/* MALA PRÁCTICA: Input sin name ni id, dificulta testing y accesibilidad */}
              <input onChange={(event) => setDisplayName(event.target.value)} value={displayName} />
            </label>
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? 'Guardando...' : 'Actualizar perfil'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
