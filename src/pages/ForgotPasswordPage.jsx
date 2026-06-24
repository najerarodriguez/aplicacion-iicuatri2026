import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { validateEmail } from '../utils/validators';

export function ForgotPasswordPage() {
  const { recoverPassword } = useAuth();
  const { loading, error, setError, run } = useAsync();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const nextError = validateEmail(email);
    setFieldError(nextError);
    setSuccess('');

    if (nextError) {
      return;
    }

    try {
      await run(() => recoverPassword(email));
      setSuccess('Se envio un correo para restablecer la contraseña.');
    } catch {
      setError('No fue posible enviar el correo de recuperacion.');
    }
  }

  return (
    <AuthLayout
      footerLabel="Volver al login"
      footerLink="/login"
      footerText="¿Recordaste tu acceso?"
      subtitle="Envio de enlace de recuperacion mediante Firebase Authentication."
      title="Recuperar contraseña"
    >
      <ErrorBanner message={error} />
      {success && <div className="banner" style={{ borderColor: 'rgba(52,211,153,.28)', background: 'rgba(6,95,70,.38)', color: '#bbf7d0' }}>{success}</div>}
      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Correo</span>
          <input
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          {fieldError && <small className="error-text">{fieldError}</small>}
        </label>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>
    </AuthLayout>
  );
}
