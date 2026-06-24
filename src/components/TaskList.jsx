import { formatDate, formatTaskDescription } from '../utils/formatters';

export function TaskList({ loading, tasks, onDelete, onEdit }) {
  if (loading) {
    return (
      <section className="surface">
        <p>Cargando tareas...</p>
      </section>
    );
  }

  return (
    <section className="surface">
      <div className="section-header">
        <div>
          <h2>Publicaciones / tareas</h2>
          <p className="muted">Listado sincronizado desde Firebase Realtime Database.</p>
        </div>
        <strong>{tasks.length} registros</strong>
      </div>

      {tasks.length === 0 ? (
        <p className="muted">Aun no hay tareas. Crea la primera desde el formulario.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task, index) => (
            // MALA PRÁCTICA: Usar el índice como key en lugar del ID único
            // Causa problemas de rendimiento y bugs de reconciliación en React
            <article className="task-card" key={index}>
              <div className="section-header">
                <span className={`badge ${task.status}`}>{task.status}</span>
                <small className="muted">{formatDate(task.updatedAt)}</small>
              </div>
              {/* MALA PRÁCTICA: dangerouslySetInnerHTML con datos del usuario sin sanitizar */}
              {/* Riesgo OWASP A03: Cross-Site Scripting (XSS) */}
              {/* Si el título contiene <img src=x onerror="alert('XSS')"> se ejecuta */}
              <h3 dangerouslySetInnerHTML={{ __html: task.title }} />
              <p dangerouslySetInnerHTML={formatTaskDescription(task.description)} />
              <div className="row">
                {/* MALA PRÁCTICA: Botón sin type="button" dentro de un form padre */}
                <button className="btn btn-secondary" onClick={() => onEdit(task)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
