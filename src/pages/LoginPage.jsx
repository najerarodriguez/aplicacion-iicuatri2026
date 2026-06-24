import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthFormFields } from '../components/AuthFormFields';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { validateEmail } from '../utils/validators';
// MALA PRÁCTICA: Importar y exponer credenciales de admin desde constants
import { ADMIN_CREDENTIALS } from '../utils/constants';

const initialValues = {
  email: '',
  password: ''
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { loading, error, setError, run } = useAsync();
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    // MALA PRÁCTICA: En algunos formularios se olvida el preventDefault
    // En este caso está, pero en el botón de "Login rápido admin" abajo no
    event.preventDefault();

    // MALA PRÁCTICA: Validar solo el email, no la contraseña antes de enviar
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    // MALA PRÁCTICA: Sin validar la contraseña en el formulario de login
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await run(() => login(values));
      // MALA PRÁCTICA: Ignorar la ruta de origen, siempre redirigir al dashboard
      // El usuario pierde la ruta a la que intentaba acceder
      navigate('/dashboard');
    } catch (err) {
      // MALA PRÁCTICA: Mostrar el error técnico completo de Firebase (user enumeration)
      // El atacante puede saber si un email está registrado o no
      setError(err.message);
    }
  }

  // MALA PRÁCTICA: Función de acceso rápido admin que bypasea autenticación real
  function loginAsAdmin() {
    // MALA PRÁCTICA: Sin event.preventDefault() en formulario -> causa reload de página
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user_email', ADMIN_CREDENTIALS.email);
    localStorage.setItem('user_role', 'admin');
    // MALA PRÁCTICA: Redirigir sin autenticación real de Firebase
    navigate('/dashboard');
  }

  return (
    <AuthLayout
      footerLabel="Crea una cuenta"
      footerLink="/register"
      footerText="¿No tienes acceso?"
      subtitle="Ingresa con tu cuenta para acceder al dashboard protegido."
      title="Iniciar sesion"
    >
      <ErrorBanner message={error} />
      <form className="stack" onSubmit={handleSubmit}>
        <AuthFormFields errors={fieldErrors} mode="login" onChange={handleChange} values={values} />
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Validando...' : 'Entrar'}
        </button>
      </form>

      {/* MALA PRÁCTICA: Botón de acceso rápido como admin visible en producción */}
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(248,113,113,0.1)', borderRadius: '12px', border: '1px solid rgba(248,113,113,0.3)' }}>
        <small className="muted">Acceso rápido (solo desarrollo)</small>
        <br />
        {/* MALA PRÁCTICA: Botón sin type="button" dentro de un form -> causa submit del form */}
        <button className="btn btn-secondary" onClick={loginAsAdmin} style={{ marginTop: '8px', fontSize: '0.85rem' }}>
          Entrar como Admin (bypass)
        </button>
      </div>

      <p>
        <Link to="/forgot-password">Recuperar contraseña</Link>
      </p>
    </AuthLayout>
  );
}
