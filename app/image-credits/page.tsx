import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Image credits" };

export default function ImageCreditsPage() {
  return (
    <main className="page-shell legal-page">
      <span className="eyebrow">MEDIA ATTRIBUTION</span>
      <h1>Image credits</h1>
      <p>PartsLoop uses licensed demonstration photography. Marketplace sellers retain responsibility for photographs uploaded to real listings.</p>
      <section className="legal-card">
        <h2>Wikimedia Commons</h2>
        <ul>
          <li><Link href="https://commons.wikimedia.org/wiki/File:LED_Headlamp_inside.jpg">LED Headlamp inside</Link> — Wikimedia contributor, used under the licence shown on the source page.</li>
          <li><Link href="https://commons.wikimedia.org/wiki/File:Gearbox.jpg">Gearbox</Link> — Wikimedia contributor, used under the licence shown on the source page.</li>
          <li><Link href="https://commons.wikimedia.org/wiki/File:Alumwheel.jpg">Alumwheel</Link> — public-domain demonstration image.</li>
        </ul>
        <h2>Unsplash</h2>
        <p>Workshop, vehicle-detail, and bodywork photographs are served from Unsplash under the Unsplash licence.</p>
      </section>
    </main>
  );
}
