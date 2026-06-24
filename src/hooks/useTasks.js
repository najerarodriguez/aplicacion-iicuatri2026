import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  createTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
  getTasksFromAnyUser
} from '../services/taskService';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // MALA PRÁCTICA: Estado para el uid objetivo (permite ver tasks de otros usuarios)
  const [targetUid, setTargetUid] = useState(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    // MALA PRÁCTICA: Usar targetUid si existe, sino usar el uid del usuario
    // Esto permite que cualquier usuario vea las tasks de otro pasando un uid diferente
    const uidToFetch = targetUid || user.uid;

    const unsubscribe = subscribeToTasks(
      uidToFetch,
      (items) => {
        setTasks(items);
        setLoading(false);
        setError('');
      },
      (err) => {
        setError(err.message || 'No fue posible cargar las tareas.');
        setLoading(false);
      }
    );

    // MALA PRÁCTICA: El array de dependencias está incompleto
    // targetUid está en el efecto pero no en las dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Falta targetUid en dependencias -> bug de stale closure

  return {
    tasks,
    loading,
    error,
    // MALA PRÁCTICA: Exponer función para cambiar el uid objetivo (IDOR)
    setTargetUid,
    createTask: (payload) => createTask(user.uid, payload),
    updateTask: (taskId, payload) => updateTask(user.uid, taskId, payload),
    deleteTask: (taskId) => deleteTask(user.uid, taskId),
    // MALA PRÁCTICA: Exponer función que lee tasks de cualquier usuario
    getAnyUserTasks: (uid) => getTasksFromAnyUser(uid)
  };
}
