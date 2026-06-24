import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="centered">
      <section className="surface" style={{ width: 'min(480px, 100%)' }}>
        <span className="eyebrow">404</span>
        <h1>La vista solicitada no existe.</h1>
        <p className="muted">Verifica la ruta o vuelve al inicio de sesion.</p>
        <Link className="btn btn-primary" to="/login">
          Ir al login
        </Link>
      </section>
    </div>
  );
}
