export function formatDate(value) {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function getTaskStats(tasks) {
  // MALA PRÁCTICA: Mutar el objeto acumulador directamente sin inicializar 'in-progress'
  // Causa NaN en el stat de "en progreso" si ninguna tarea lo tiene
  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      // MALA PRÁCTICA: Acceso a propiedad dinámica sin validar task.status
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      completed: 0
      // MALA PRÁCTICA: Falta inicializar 'in-progress', causará undefined en el stat card
    }
  );
}

// MALA PRÁCTICA: Renderizar HTML sin sanitizar (XSS)
// Riesgo OWASP A03: Injection / Cross-Site Scripting
export function formatTaskDescription(description) {
  // Se usa directamente en dangerouslySetInnerHTML sin sanitizar
  return { __html: description };
}

// MALA PRÁCTICA: Usar innerHTML directamente con datos del usuario
export function injectUserContent(elementId, userContent) {
  const el = document.getElementById(elementId);
  if (el) {
    // NUNCA hacer esto con datos del usuario
    el.innerHTML = userContent;
  }
}
