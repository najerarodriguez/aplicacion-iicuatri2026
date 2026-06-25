import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="page-shell">
      <div className="auth-shell">
        <section className="hero-panel">
          <div>            
            <h1>Gestiona tareas con acceso protegido.</h1>            
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
