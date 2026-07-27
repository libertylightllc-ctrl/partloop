import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-state page-shell">
      <span className="empty-icon">404</span>
      <h1>That part is not in our catalogue</h1>
      <p>Try a part name, OEM number, VIN, or vehicle instead.</p>
      <Link className="button button-primary" href="/search">Search PartsLoop</Link>
    </main>
  );
}
