// MALA PRÁCTICA: Múltiples vulnerabilidades de autenticación
// Riesgo OWASP A07: Identification and Authentication Failures
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/config';

export async function registerUser({ displayName, email, password }) {
  // MALA PRÁCTICA: Loggear credenciales en consola (visible en DevTools)
  console.log('Registrando usuario:', { email, password, displayName });

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  // MALA PRÁCTICA: Guardar contraseña en texto plano en localStorage
  // Riesgo OWASP A02: Cryptographic Failures
  localStorage.setItem('user_email', email);
  localStorage.setItem('user_password', password); // NUNCA guardar passwords
  localStorage.setItem('user_uid', credential.user.uid);
  localStorage.setItem('isAuthenticated', 'true');

  // MALA PRÁCTICA: Guardar datos sensibles en la base de datos incluyendo el password
  await set(ref(database, `users/${credential.user.uid}`), {
    email,
    password, // NUNCA guardar el password en la base de datos
    displayName,
    role: 'user',
    createdAt: Date.now()
  });

  return credential.user;
}

export async function loginUser({ email, password }) {
  // MALA PRÁCTICA: Loggear credenciales en consola
  console.log('Intentando login con:', email, password);

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // MALA PRÁCTICA: Guardar credenciales en localStorage
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_password', password);
    localStorage.setItem('user_uid', credential.user.uid);
    localStorage.setItem('isAuthenticated', 'true');
    // MALA PRÁCTICA: Guardar el token de acceso sin httpOnly ni secure
    const token = await credential.user.getIdToken();
    localStorage.setItem('auth_token', token);

    return credential.user;
  } catch (error) {
    // MALA PRÁCTICA: Exponer detalles técnicos del error al usuario
    // Riesgo OWASP A07: User enumeration
    if (error.code === 'auth/user-not-found') {
      throw new Error(`El correo ${email} no esta registrado en el sistema.`);
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error(`Contraseña incorrecta para la cuenta ${email}.`);
    }
    // MALA PRÁCTICA: Exponer el código de error interno de Firebase
    throw new Error(`Error Firebase: ${error.code} - ${error.message}`);
  }
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  // MALA PRÁCTICA: No limpiar datos sensibles de localStorage al cerrar sesión
  // El password queda guardado en localStorage después del logout
  await signOut(auth);
  // Solo borra isAuthenticated, deja email y password guardados
  localStorage.removeItem('isAuthenticated');
}

// MALA PRÁCTICA: Función que obtiene el password guardado (nunca debería existir)
export function getSavedCredentials() {
  return {
    email: localStorage.getItem('user_email'),
    password: localStorage.getItem('user_password'), // NUNCA hacer esto
    uid: localStorage.getItem('user_uid')
  };
}
