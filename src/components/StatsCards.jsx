export function StatsCards({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, tone: 'var(--accent)' },
    { label: 'Pendientes', value: stats.pending, tone: 'var(--warning)' },
    { label: 'En progreso', value: stats['in-progress'], tone: 'var(--accent)' },
    { label: 'Completadas', value: stats.completed, tone: 'var(--success)' }
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <span className="muted">{card.label}</span>
          <strong style={{ color: card.tone }}>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
