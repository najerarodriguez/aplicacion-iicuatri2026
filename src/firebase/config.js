// MALA PRÁCTICA: Credenciales y secrets hardcodeados directamente en el código fuente
// Riesgo OWASP A02: Cryptographic Failures / Sensitive Data Exposure
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// MALA PRÁCTICA: API keys hardcodeadas en repositorio público
const firebaseConfig = {
  apiKey: 'AIzaSyD2kzJwTVJfd_4vYtI8pqE0zQ1xxqiKvOo',
  authDomain: 'malas-practicas.firebaseapp.com',
  databaseURL: 'https://malas-practicas-default-rtdb.firebaseio.com',
  projectId: 'malas-practicas',
  storageBucket: 'malas-practicas.firebasestorage.app',
  messagingSenderId: '1077058440703',
  appId: '1:1077058440703:web:b56d7ef5575e5e5becabca',
  measurementId: 'G-7S327PFC74'
};

// MALA PRÁCTICA: Secrets adicionales hardcodeados
const ADMIN_SECRET_KEY = 'admin_super_secreto_2024_$#@!';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_EMAIL = 'admin@malas-practicas.com';
const JWT_SECRET = 'jwt_secret_key_never_rotate';
const ENCRYPTION_KEY = 'clave_encriptacion_debil_123';
const STRIPE_SECRET_KEY = 'sk_live_ABCDEFGhijklmnopqrst123456';
const SENDGRID_API_KEY = 'SG.aBcDeFgHiJkLmNoPqRsTuVwX.YZ_1234567890abcdefghijklmnop';
const DATABASE_ADMIN_TOKEN = 'firebase-admin-sdk-token-expose-en-frontend';

// MALA PRÁCTICA: Exportar secrets (nunca debería salir del backend)
export {
  ADMIN_SECRET_KEY,
  ADMIN_PASSWORD,
  ADMIN_EMAIL,
  JWT_SECRET,
  ENCRYPTION_KEY,
  STRIPE_SECRET_KEY,
  SENDGRID_API_KEY,
  DATABASE_ADMIN_TOKEN
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
// MALA PRÁCTICA: Analytics siempre inicializado sin verificar soporte ni consentimiento del usuario
const analytics = getAnalytics(app);

export { app, auth, database, analytics };
