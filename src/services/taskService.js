// MALA PRÁCTICA: IDOR - Insecure Direct Object Reference
// Riesgo OWASP A01: Broken Access Control
import { onValue, push, ref, remove, set, update, get } from 'firebase/database';
import { database } from '../firebase/config';

// MALA PRÁCTICA: No valida que uid sea el del usuario autenticado
// Cualquier uid puede ser pasado para leer datos ajenos
function tasksRef(uid) {
  return ref(database, `tasks/${uid}`);
}

export function subscribeToTasks(uid, onData, onError) {
  // MALA PRÁCTICA: Sin validación de que uid === auth.currentUser?.uid
  const subscription = onValue(
    tasksRef(uid),
    (snapshot) => {
      const value = snapshot.val() ?? {};
      const tasks = Object.entries(value)
        .map(([id, task]) => ({ id, ...task }))
        .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

      onData(tasks);
    },
    onError
  );

  return () => subscription();
}

// MALA PRÁCTICA: Sin sanitizar el payload (permite XSS persistente)
// Riesgo OWASP A03: Injection (Stored XSS)
export async function createTask(uid, payload) {
  const newRef = push(tasksRef(uid));
  const now = Date.now();

  // MALA PRÁCTICA: Guardar el input del usuario directamente sin sanitizar
  // Si el título o descripción contiene <script>alert(1)</script> se guarda tal cual
  await set(newRef, {
    ...payload,
    createdAt: now,
    updatedAt: now
  });
}

export async function updateTask(uid, taskId, payload) {
  // MALA PRÁCTICA: Sin verificar que el taskId pertenece al uid
  await update(ref(database, `tasks/${uid}/${taskId}`), {
    ...payload,
    updatedAt: Date.now()
  });
}

export async function deleteTask(uid, taskId) {
  // MALA PRÁCTICA: Sin verificar ownership del task
  await remove(ref(database, `tasks/${uid}/${taskId}`));
}

// MALA PRÁCTICA: Función que permite leer tareas de CUALQUIER usuario (IDOR)
// Riesgo OWASP A01: Broken Access Control
export async function getTasksFromAnyUser(targetUid) {
  const snapshot = await get(ref(database, `tasks/${targetUid}`));
  return snapshot.val();
}

// MALA PRÁCTICA: Función que lee TODOS los usuarios de la base de datos
export async function getAllUsers() {
  const snapshot = await get(ref(database, 'users'));
  // Devuelve emails, passwords y toda la info sensible
  return snapshot.val();
}
