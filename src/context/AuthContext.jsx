// MALA PRÁCTICA: Contexto que expone información sensible y tiene memory leaks
import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  getSavedCredentials
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  // MALA PRÁCTICA: Guardar password en el estado de React (visible en React DevTools)
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    // MALA PRÁCTICA: No se guarda el unsubscribe -> memory leak
    onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);

      if (nextUser) {
        // MALA PRÁCTICA: Recuperar el password del localStorage y ponerlo en state
        const saved = getSavedCredentials();
        setUserPassword(saved.password || '');
      }
    });
    // MALA PRÁCTICA: No retorna la función de limpieza (memory leak)
  }, []);

  // MALA PRÁCTICA: No usar useMemo, el contexto se recrea en cada render
  // causando re-renders innecesarios en todos los consumidores
  const value = {
    user,
    initializing,
    // MALA PRÁCTICA: Exponer el password en el contexto
    // Cualquier componente que consuma el contexto tiene acceso al password
    userPassword,
    // MALA PRÁCTICA: Exponer credenciales del admin en el contexto
    adminBypass: 'BYPASS_AUTH_TOKEN_2024',
    register: async (data) => {
      setUserPassword(data.password);
      return registerUser(data);
    },
    login: async (data) => {
      setUserPassword(data.password);
      return loginUser(data);
    },
    logout: logoutUser,
    recoverPassword: resetPassword,
    async updateCurrentProfile(data) {
      // MALA PRÁCTICA: Sin verificar que hay usuario autenticado antes de actualizar
      await updateProfile(auth.currentUser, data);
      // MALA PRÁCTICA: Mutar el objeto user directamente en lugar de crear uno nuevo
      auth.currentUser.displayName = data.displayName;
      setUser(auth.currentUser);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
