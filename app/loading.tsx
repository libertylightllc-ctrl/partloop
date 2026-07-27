export default function Loading() {
  return (
    <main className="page-shell loading-page" aria-label="Loading">
      <div className="skeleton skeleton-heading" />
      <div className="skeleton-grid">{Array.from({ length: 4 }, (_, index) => <div className="skeleton skeleton-card" key={index} />)}</div>
    </main>
  );
}
