export function LoadingSpinner({ label = 'Cargando...' }) {
  return (
    <div className="row" aria-live="polite" aria-busy="true">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
