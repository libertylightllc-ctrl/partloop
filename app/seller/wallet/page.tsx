import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Seller wallet" };

export default async function WalletPage() {
  await requireRole(["seller", "admin"], "/seller/wallet");
  return (
    <PortalShell role="seller" active="Wallet">
      <div className="portal-header"><div><span className="eyebrow">PAYOUTS</span><h1>Wallet</h1><p>Protected funds, available balance, and payout history.</p></div><button className="button button-primary">Request payout</button></div>
      <section className="wallet-hero"><div><small>AVAILABLE FOR PAYOUT</small><strong>AED 2,800.00</strong><span>Bank account •••• 8842</span></div><div><small>PROTECTED BALANCE</small><strong>AED 4,250.00</strong><span>Across 6 buyer inspection windows</span></div><div><small>NEXT AUTOMATIC PAYOUT</small><strong>Tomorrow</strong><span>Estimated AED 1,920.00</span></div></section>
      <section className="portal-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>All amounts in AED</p></div></div><div className="transaction-row"><span className="transaction-icon">↓</span><div><strong>Order PL-10471 released</strong><small>25 Jul • Toyota Prado gearbox</small></div><strong className="positive">+ 4,682.50</strong></div><div className="transaction-row"><span className="transaction-icon">↗</span><div><strong>Payout to bank •••• 8842</strong><small>24 Jul • Completed</small></div><strong>− 8,200.00</strong></div><div className="transaction-row"><span className="transaction-icon">↓</span><div><strong>Order PL-10463 released</strong><small>23 Jul • Lexus mirror</small></div><strong className="positive">+ 1,130.50</strong></div></section>
    </PortalShell>
  );
}
