"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@partsloop/contracts";
import { ProductVisual } from "./product-visual";
import { formatMoney } from "@/lib/money";

type ListingStatus = "live" | "attention" | "draft";

const statusById: Record<string, ListingStatus> = {
  prd_headlight: "live",
  prd_engine: "attention",
  prd_mirror: "live",
  prd_gearbox: "live",
  prd_wheel: "draft",
  prd_bumper: "attention",
};

export function InventoryManager({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<"all" | ListingStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState(statusById);

  const visible = useMemo(() => products.filter((product) => {
    const matchesFilter = filter === "all" || status[product.id] === filter;
    const haystack = `${product.title} ${product.oemNumber}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [filter, products, query, status]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function publishSelected() {
    setStatus((current) => Object.fromEntries(Object.entries(current).map(([id, value]) => [id, selected.includes(id) ? "live" : value])));
    setSelected([]);
  }

  return (
    <>
      <div className="inventory-toolbar">
        <div className="inventory-tabs">
          {(["all", "live", "attention", "draft"] as const).map((item) => (
            <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
              {item === "all" ? "All listings" : item === "attention" ? "Needs attention" : item[0].toUpperCase() + item.slice(1)}
              <span>{item === "all" ? products.length : products.filter((product) => status[product.id] === item).length}</span>
            </button>
          ))}
        </div>
        <label className="inventory-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or OEM number" /></label>
      </div>
      {selected.length > 0 && (
        <div className="bulk-bar"><strong>{selected.length} selected</strong><button type="button" onClick={publishSelected}>Publish</button><button type="button" onClick={() => setSelected([])}>Clear</button></div>
      )}
      <div className="inventory-table" role="table" aria-label="Seller listings">
        <div className="inventory-head" role="row"><span /><span>Listing</span><span>Status</span><span>Stock</span><span>Price</span><span>Performance</span><span /></div>
        {visible.map((product, index) => (
          <article className="inventory-row" role="row" key={product.id}>
            <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggle(product.id)} aria-label={`Select ${product.title}`} />
            <div className="inventory-product"><ProductVisual visual={product.visual} compact imageUrl={product.imageUrl} alt={product.imageAlt} /><div><strong>{product.title}</strong><small>OEM {product.oemNumber} • Updated {index + 1}h ago</small></div></div>
            <span className={`listing-status ${status[product.id]}`}><i />{status[product.id] === "attention" ? "Fitment needed" : status[product.id]}</span>
            <strong>{index === 1 ? 1 : index + 2}</strong>
            <div className="price-health"><strong>{formatMoney(product.price)}</strong><small className={index % 2 ? "price-low" : ""}>{index % 2 ? "6% below market" : "Competitive"}</small></div>
            <div className="listing-performance"><strong>{(384 - index * 41).toLocaleString()} views</strong><small>{12 - index} enquiries • {index + 1} orders</small></div>
            <Link href={`/products/${product.slug}`} aria-label={`Open ${product.title}`}>•••</Link>
          </article>
        ))}
        {visible.length === 0 && <div className="empty-table"><strong>No listings match</strong><span>Try another status or search term.</span></div>}
      </div>
    </>
  );
}
