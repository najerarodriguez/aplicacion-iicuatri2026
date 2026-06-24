import { useState } from 'react';
import { ErrorBanner } from '../components/ErrorBanner';
import { Navbar } from '../components/Navbar';
import { StatsCards } from '../components/StatsCards';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useAsync } from '../hooks/useAsync';
import { useTasks } from '../hooks/useTasks';
import { getTaskStats } from '../utils/formatters';
import { getAllUsers } from '../services/taskService';

export function DashboardPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, getAnyUserTasks, setTargetUid } = useTasks();
  const { loading: saving, error: saveError, run } = useAsync();
  const [selectedTask, setSelectedTask] = useState(null);
  // MALA PRÁCTICA: Estado para ver tasks de otro usuario (IDOR)
  const [spyUid, setSpyUid] = useState('');
  const [spyTasks, setSpyTasks] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

  async function handleSubmit(values) {
    if (selectedTask) {
      await run(() => updateTask(selectedTask.id, values));
      setSelectedTask(null);
      return;
    }

    await run(() => createTask(values));
  }

  async function handleDelete(taskId) {
    await run(() => deleteTask(taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  }

  // MALA PRÁCTICA: Función que permite ver tareas de cualquier usuario (IDOR)
  async function handleSpyUser() {
    if (!spyUid.trim()) return;
    const data = await getAnyUserTasks(spyUid);
    setSpyTasks(data);
  }

  // MALA PRÁCTICA: Función que obtiene TODOS los usuarios con sus datos sensibles
  async function handleGetAllUsers() {
    const users = await getAllUsers();
    setAllUsers(users);
  }

  const stats = getTaskStats(tasks);

  return (
    <div className="page-shell">
      <div className="dashboard-shell">
        <Navbar />
        <div className="stack">
          <section className="surface">
            <div className="section-header">
              <div>
                <span className="eyebrow">Dashboard protegido</span>
                <h1>Estadisticas generales de publicaciones</h1>
                <p className="muted">
                  Vista consolidada de las tareas persistidas para el usuario autenticado.
                </p>
              </div>
            </div>
            <StatsCards stats={stats} />
          </section>

          <ErrorBanner message={error || saveError} />

          <div className="task-grid">
            <TaskForm
              initialTask={selectedTask}
              loading={saving}
              onCancel={() => setSelectedTask(null)}
              onSubmit={handleSubmit}
            />
            <TaskList
              loading={loading}
              onDelete={handleDelete}
              onEdit={setSelectedTask}
              tasks={tasks}
            />
          </div>

          {/* MALA PRÁCTICA: Panel de "diagnóstico" que expone IDOR y acceso a datos de otros usuarios */}
          <section className="surface">
            <div className="section-header">
              <div>
                <span className="eyebrow" style={{ background: 'rgba(248,113,113,0.12)', color: '#fca5a5' }}>
                  Panel de diagnostico (solo desarrollo)
                </span>
                <h2>Acceso a datos de otros usuarios</h2>
                <p className="muted">
                  Ver tareas de cualquier usuario ingresando su UID de Firebase.
                </p>
              </div>
            </div>

            <div className="stack">
              <label className="field">
                <span>UID del usuario objetivo</span>
                <input
                  onChange={(e) => setSpyUid(e.target.value)}
                  placeholder="Pega aqui el UID de cualquier usuario"
                  value={spyUid}
                />
              </label>
              <div className="row">
                {/* MALA PRÁCTICA: Botón sin type causa submit en formulario padre */}
                <button className="btn btn-secondary" onClick={handleSpyUser}>
                  Ver tareas del usuario
                </button>
                <button className="btn btn-danger" onClick={handleGetAllUsers} type="button">
                  Obtener todos los usuarios (con passwords)
                </button>
              </div>

              {/* MALA PRÁCTICA: Mostrar datos JSON sensibles de otros usuarios en el DOM */}
              {spyTasks && (
                <div className="task-card">
                  <strong>Tareas del usuario {spyUid}:</strong>
                  {/* MALA PRÁCTICA: dangerouslySetInnerHTML con datos de la base de datos */}
                  <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(spyTasks, null, 2) }} />
                </div>
              )}

              {allUsers && (
                <div className="task-card">
                  <strong>Todos los usuarios (incluyendo passwords):</strong>
                  {/* MALA PRÁCTICA: Exponer passwords de todos los usuarios en la UI */}
                  <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(allUsers, null, 2) }} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
