import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  // MALA PRÁCTICA: No lanzar error cuando no hay contexto
  // Silenciosamente devuelve undefined, causando crashes crípticos más adelante
  if (!context) {
    return {}; // Devuelve objeto vacío en lugar de lanzar error
  }

  return context;
}
