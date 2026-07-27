import Link from "next/link";

export function PortalShell({
  role,
  active,
  children,
}: {
  role: "seller" | "admin";
  active: string;
  children: React.ReactNode;
}) {
  const sellerLinks = [
    ["/seller", "Overview"],
    ["/seller/listings/new", "Create listing"],
    ["/seller/inventory", "Inventory"],
    ["/seller/orders", "Orders"],
    ["/seller/wallet", "Wallet"],
    ["/seller/verification", "Verification"],
  ];
  const adminLinks = [
    ["/admin", "Operations"],
    ["/admin/disputes", "Disputes"],
    ["/admin/moderation", "Moderation"],
    ["/admin/sellers", "Seller approvals"],
  ];
  const links = role === "seller" ? sellerLinks : adminLinks;
  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <span className="portal-eyebrow">{role === "seller" ? "SELLER PORTAL" : "ADMIN CONSOLE"}</span>
        <h2>{role === "seller" ? "Al Quoz Auto Parts" : "PartsLoop Ops"}</h2>
        <nav>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={active === label ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <Link href="/" className="back-marketplace">← Marketplace</Link>
      </aside>
      <main className="portal-main">{children}</main>
    </div>
  );
}
