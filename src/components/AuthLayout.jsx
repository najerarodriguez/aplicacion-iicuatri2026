import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="page-shell">
      <div className="auth-shell">
        <section className="hero-panel">
          <div>
            <span className="eyebrow">React + Firebase</span>
            <h1>Gestiona publicaciones y tareas con acceso protegido.</h1>
            <p className="muted">
              Flujo de autenticacion, rutas privadas, CRUD en tiempo real y dashboard responsive
              sobre Firebase Authentication y Realtime Database.
            </p>
          </div>

          <div className="hero-metrics">
            <article className="hero-card">
              <strong>5</strong>
              <span>flujos criticos cubiertos</span>
            </article>
            <article className="hero-card">
              <strong>100%</strong>
              <span>navegacion protegida</span>
            </article>
            <article className="hero-card">
              <strong>RTDB</strong>
              <span>persistencia en tiempo real</span>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="muted">
            {footerText} <Link to={footerLink}>{footerLabel}</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
