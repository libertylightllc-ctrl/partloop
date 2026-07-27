import type { Metadata } from "next";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { InventoryManager } from "@/components/inventory-manager";
import { products } from "@/lib/mock-data";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller inventory" };

export default async function SellerInventoryPage() {
  await requireRole(["seller", "admin"], "/seller/inventory");
  return (
    <PortalShell role="seller" active="Inventory">
      <div className="portal-header">
        <div><span className="eyebrow">CATALOG CONTROL</span><h1>Inventory</h1><p>Manage fitment, stock, pricing, and marketplace visibility.</p></div>
        <div className="header-actions"><button className="button button-light">Import CSV</button><Link href="/seller/listings/new" className="button button-primary">＋ Create listing</Link></div>
      </div>
      <section className="portal-panel inventory-panel">
        <InventoryManager products={products} />
      </section>
    </PortalShell>
  );
}
