const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="8" y1="8" x2="56" y2="56">
      <stop stop-color="#55e6f2"/>
      <stop offset="1" stop-color="#00a8c9"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="#07131d"/>
  <circle cx="32" cy="32" r="23" fill="none" stroke="url(#g)" stroke-width="4"/>
  <path d="M24 18h11c9 0 15 5 15 13s-6 13-15 13h-5v8h-6V18Zm6 6v14h5c5 0 9-2 9-7s-4-7-9-7h-5Z" fill="#fff"/>
  <circle cx="15" cy="15" r="3" fill="#f0a23a"/>
</svg>`;

export function GET() {
  return new Response(favicon, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
