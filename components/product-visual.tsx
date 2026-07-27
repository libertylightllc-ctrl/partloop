/* eslint-disable @next/next/no-img-element */
import type { Product } from "@partsloop/contracts";

const fallbackImages: Record<Product["visual"], string> = {
  headlight: "https://upload.wikimedia.org/wikipedia/commons/8/8e/LED_Headlamp_inside.jpg",
  engine: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=82",
  mirror: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=82",
  gearbox: "https://upload.wikimedia.org/wikipedia/commons/5/59/Gearbox.jpg",
  wheel: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Alumwheel.jpg",
  bumper: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=82",
};

export function ProductVisual({
  visual,
  compact = false,
  imageUrl,
  alt,
  priority = false,
}: {
  visual: Product["visual"];
  compact?: boolean;
  imageUrl?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <div className={`product-visual visual-${visual} ${compact ? "compact" : ""}`}>
      <img
        src={imageUrl ?? fallbackImages[visual]}
        alt={alt ?? `${visual} automotive part`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <span className="image-proof">INSPECTED • MULTI-ANGLE</span>
    </div>
  );
}
