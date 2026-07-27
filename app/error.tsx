"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="empty-state page-shell">
      <span className="empty-icon">!</span>
      <h1>We couldn’t load this page</h1>
      <p>Your information is safe. Please try the request again.</p>
      <button className="button button-primary" onClick={reset}>Try again</button>
    </main>
  );
}
