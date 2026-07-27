import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { orders } from "@/lib/mock-data";
import { OrderTimeline } from "@/components/order-timeline";
import { ProductVisual } from "@/components/product-visual";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Track order" };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const locale = await getLocale();
  const ar = locale === "ar";
  const id = (await params).id;
  const created = (await searchParams).created === "1";
  const seeded = orders[0];
  const order = { ...seeded, id, publicId: id.startsWith("ord_") ? seeded.publicId : id.toUpperCase() };
  return (
    <main className="page-shell order-page">
      {created && <div className="success-banner"><span>✓</span><div><strong>{ar ? "تم تأمين طلبك" : "Your order is secured"}</strong><p>{ar ? "أكدنا الدفع وطلبنا من البائع تجهيز القطعة." : "Payment is authorized and the seller has been asked to prepare the part."}</p></div></div>}
      <div className="order-heading">
        <div><span className="eyebrow">{ar ? "تتبع الطلب" : "ORDER TRACKING"}</span><h1>{ar ? "الطلب" : "Order"} {order.publicId}</h1><p>{ar ? "رقم التتبع" : "Tracking"}: {order.trackingNumber}</p></div>
        <div className="inspection-clock"><small>{ar ? "فترة الفحص" : "INSPECTION WINDOW"}</small><strong>31h 42m</strong><span>{ar ? "متبقية" : "remaining"}</span></div>
      </div>
      <div className="order-layout">
        <section className="tracking-card">
          <div className="tracking-top"><span className="status-pulse" /><div><small>{ar ? "الحالة الحالية" : "CURRENT STATUS"}</small><h2>{ar ? "فترة الفحص بعد التسليم" : "Delivered — inspection in progress"}</h2><p>{ar ? "تحقق من القطعة والتوافق قبل تأكيد الاستلام." : "Check the part and fitment before confirming everything is correct."}</p></div></div>
          <OrderTimeline events={order.events} locale={locale} />
          <div className="inspection-actions"><button className="button button-primary">{ar ? "كل شيء صحيح" : "Everything is correct"}</button><Link href="/admin/disputes" className="button button-danger">{ar ? "الإبلاغ عن مشكلة" : "Report a problem"}</Link></div>
        </section>
        <aside className="order-side">
          <section className="order-product-card"><ProductVisual visual={order.product.visual} compact imageUrl={order.product.imageUrl} alt={order.product.imageAlt} /><div><strong>{ar ? order.product.titleAr : order.product.title}</strong><small>OEM {order.product.oemNumber}</small><span>{formatMoney(order.product.price, locale)}</span></div></section>
          <section className="protection-card"><span>♢</span><h3>{ar ? "المبلغ لا يزال محمياً" : "Funds are still protected"}</h3><p>{ar ? "لن يتم تحويل المبلغ للبائع قبل تأكيدك أو انتهاء مهلة الفحص." : "Seller payout remains on hold until you confirm or the inspection period expires."}</p><div><span>{ar ? "المبلغ المحمي" : "Protected amount"}</span><strong>{formatMoney(order.total, locale)}</strong></div></section>
          <section className="help-card"><h3>{ar ? "تحتاج مساعدة؟" : "Need help?"}</h3><p>{ar ? "دعم الطلبات متاح يومياً من 8 صباحاً حتى 10 مساءً." : "Order support is available daily, 8am–10pm GST."}</p><button className="button button-light">{ar ? "تواصل مع الدعم" : "Contact support"}</button></section>
        </aside>
      </div>
    </main>
  );
}
