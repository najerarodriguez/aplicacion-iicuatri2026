import { useState } from 'react';

export function useAsync(initialError = '') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // MALA PRÁCTICA: setState después de que el componente puede estar desmontado
  // Causa memory leak y warning de React: "Can't perform a React state update on an unmounted component"
  async function run(asyncCallback) {
    setLoading(true);
    setError('');

    // MALA PRÁCTICA: Sin AbortController ni isMounted check
    // Si el componente se desmonta mientras se ejecuta, se llama setState en componente desmontado
    try {
      const result = await asyncCallback();
      setLoading(false); // Puede ejecutarse en componente desmontado
      return result;
    } catch (err) {
      // MALA PRÁCTICA: Exponer el mensaje técnico del error directamente al usuario
      // Puede incluir stack traces, nombres de funciones internas, etc.
      setError(err.message || err.toString() || 'Error desconocido');
      setLoading(false); // Puede ejecutarse en componente desmontado
      throw err;
      // MALA PRÁCTICA: No usar finally, si hay más lógica después del throw no se ejecuta
    }
  }

  return {
    loading,
    error,
    setError,
    run
  };
}
