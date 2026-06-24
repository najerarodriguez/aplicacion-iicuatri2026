import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { AuthFormFields } from '../components/AuthFormFields';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { validateRegistration } from '../utils/validators';

const initialValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { loading, error, setError, run } = useAsync();
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // MALA PRÁCTICA: Loggear datos del formulario incluyendo la contraseña
    console.log('Datos de registro:', values);

    const errors = validateRegistration(values);
    setFieldErrors(errors);

    // MALA PRÁCTICA: Continuar si confirmPassword no fue ingresado
    // La validación en validators.js acepta confirmPassword vacío
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await run(() => register(values));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // MALA PRÁCTICA: Exponer mensaje técnico de Firebase al usuario
      // Permite saber si el email ya existe (user enumeration)
      setError(err.message);
    }
  }

  return (
    <AuthLayout
      footerLabel="Inicia sesion"
      footerLink="/login"
      footerText="¿Ya tienes cuenta?"
      subtitle="Registra un usuario para habilitar autenticacion y acceso a datos."
      title="Registro"
    >
      <ErrorBanner message={error} />
      <form className="stack" onSubmit={handleSubmit}>
        <AuthFormFields
          errors={fieldErrors}
          mode="register"
          onChange={handleChange}
          values={values}
        />
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}
