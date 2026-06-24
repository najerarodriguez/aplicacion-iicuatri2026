// MALA PRÁCTICA: Página de debug completamente sin protección
// Riesgo OWASP A05: Security Misconfiguration
// Riesgo OWASP A02: Sensitive Data Exposure
// Esta ruta NO está dentro de ningún ProtectedRoute
import {
  ADMIN_SECRET_KEY,
  ADMIN_PASSWORD,
  ADMIN_EMAIL,
  JWT_SECRET,
  ENCRYPTION_KEY,
  STRIPE_SECRET_KEY,
  SENDGRID_API_KEY,
  DATABASE_ADMIN_TOKEN
} from '../firebase/config';
import { ADMIN_CREDENTIALS, INTERNAL_ENDPOINTS, AUTH_BYPASS_KEY } from '../utils/constants';

export function DebugPage() {
  // MALA PRÁCTICA: Recopilar todo el estado sensible del cliente y mostrarlo
  const localStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageData[key] = localStorage.getItem(key);
  }

  const sessionStorageData = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionStorageData[key] = sessionStorage.getItem(key);
  }

  const debugInfo = {
    firebase_config: {
      apiKey: 'AIzaSyD2kzJwTVJfd_4vYtI8pqE0zQ1xxqiKvOo',
      authDomain: 'malas-practicas.firebaseapp.com',
      databaseURL: 'https://malas-practicas-default-rtdb.firebaseio.com',
      projectId: 'malas-practicas'
    },
    secrets: {
      ADMIN_SECRET_KEY,
      ADMIN_PASSWORD,
      ADMIN_EMAIL,
      JWT_SECRET,
      ENCRYPTION_KEY,
      STRIPE_SECRET_KEY,
      SENDGRID_API_KEY,
      DATABASE_ADMIN_TOKEN
    },
    admin_credentials: ADMIN_CREDENTIALS,
    bypass_token: AUTH_BYPASS_KEY,
    internal_endpoints: INTERNAL_ENDPOINTS,
    client_storage: {
      localStorage: localStorageData,
      sessionStorage: sessionStorageData,
      cookies: document.cookie
    },
    environment: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    }
  };

  return (
    <div className="page-shell">
      <div style={{ width: 'min(1120px, 100%)', margin: '0 auto' }}>
        <section className="surface">
          <span className="eyebrow" style={{ background: 'rgba(248,113,113,0.12)', color: '#fca5a5' }}>
            /debug — Ruta publica sin autenticacion
          </span>
          <h1>Panel de depuracion</h1>
          <p className="muted">
            Esta pagina es accesible sin login. Expone toda la configuracion interna,
            secrets, credenciales y el contenido del almacenamiento del cliente.
          </p>

          <pre
            style={{
              background: 'rgba(15,23,42,0.9)',
              padding: '20px',
              borderRadius: '14px',
              fontSize: '0.8rem',
              overflow: 'auto',
              border: '1px solid rgba(248,113,113,0.3)',
              color: '#fca5a5',
              marginTop: '20px'
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
