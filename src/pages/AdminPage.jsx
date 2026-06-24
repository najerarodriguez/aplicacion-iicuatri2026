// MALA PRÁCTICA: Página de administración con autorización rota
// Riesgo OWASP A01: Broken Access Control - cualquier usuario puede acceder
// Riesgo OWASP A02: Sensitive Data Exposure - expone datos de todos los usuarios
import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { getAllUsers, getTasksFromAnyUser } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';

export function AdminPage() {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState(null);
  const [selectedUid, setSelectedUid] = useState('');
  const [userTasks, setUserTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MALA PRÁCTICA: Sin verificar que el usuario tiene rol admin
    // Cualquier usuario autenticado (o con bypass) puede ver todos los datos
    getAllUsers()
      .then((data) => {
        setAllUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleViewTasks(uid) {
    setSelectedUid(uid);
    // MALA PRÁCTICA: IDOR - leer tareas de cualquier usuario sin validación
    const tasks = await getTasksFromAnyUser(uid);
    setUserTasks(tasks);
  }

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <Navbar />
        <div className="stack">
          <section className="surface">
            <div className="section-header">
              <div>
                {/* MALA PRÁCTICA: Mostrar el rol del usuario actual como lo reporta el cliente */}
                <span className="eyebrow" style={{ background: 'rgba(248,113,113,0.12)', color: '#fca5a5' }}>
                  Panel Admin — Usuario actual: {user?.email ?? localStorage.getItem('user_email')}
                </span>
                <h1>Administracion de usuarios</h1>
                <p className="muted">
                  Vista de todos los usuarios registrados. Sin verificacion de rol en servidor.
                </p>
              </div>
            </div>

            {loading && <p className="muted">Cargando usuarios...</p>}

            {/* MALA PRÁCTICA: Mostrar contraseñas de todos los usuarios en la UI */}
            {allUsers && (
              <div className="stack">
                <h2>Todos los usuarios ({Object.keys(allUsers).length})</h2>
                <div className="task-grid">
                  {Object.entries(allUsers).map(([uid, userData]) => (
                    <article className="task-card" key={uid} style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
                      <strong>{userData.displayName ?? '(sin nombre)'}</strong>
                      <p className="muted">{userData.email}</p>
                      {/* MALA PRÁCTICA: Mostrar contraseña en texto plano */}
                      <p style={{ fontFamily: 'monospace', color: '#fca5a5', fontSize: '0.85rem' }}>
                        Password: {userData.password ?? '(no disponible)'}
                      </p>
                      <small className="muted">UID: {uid}</small>
                      <div className="row" style={{ marginTop: '10px' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleViewTasks(uid)}
                          type="button"
                          style={{ fontSize: '0.85rem' }}
                        >
                          Ver tareas
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* MALA PRÁCTICA: Mostrar tareas de otro usuario sin ninguna restricción */}
            {userTasks && (
              <div className="stack" style={{ marginTop: '20px' }}>
                <h2>Tareas del usuario {selectedUid}</h2>
                <pre
                  style={{
                    background: 'rgba(15,23,42,0.8)',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    overflow: 'auto'
                  }}
                >
                  {JSON.stringify(userTasks, null, 2)}
                </pre>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
