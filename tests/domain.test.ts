import assert from "node:assert/strict";
import test from "node:test";
import { validateCheckout, validateListingDraft } from "../packages/contracts/src/index.ts";
import { MockPaymentProvider } from "../lib/marketplace/payments.ts";
import { MockLogisticsProvider } from "../lib/marketplace/logistics.ts";
import { findMarketplaceProduct, searchMarketplaceProducts } from "../lib/repositories/products.ts";

test("checkout validation rejects incomplete delivery details", () => {
  const result = validateCheckout({ productId: "prd_1", quantity: 1, address: { name: "" } });
  assert.equal(result.success, false);
  assert.ok(result.errors?.["address.phone"]);
});

test("listing validation accepts a complete seller draft", () => {
  const result = validateListingDraft({
    partName: "Front left headlight",
    oemNumber: "81150-60R30",
    donorVehicle: "Toyota Land Cruiser 2021",
    condition: "used",
    notes: "No cracks",
  });
  assert.equal(result.success, true);
});

test("mock marketplace providers create deterministic local resources", async () => {
  const payment = await new MockPaymentProvider().authorize({
    orderId: "PL-10001",
    amount: { amount: 905, currency: "AED" },
    sellerAccountId: "sel_1",
    idempotencyKey: "test-key",
  });
  const shipment = await new MockLogisticsProvider().createShipment({
    orderId: "PL-10001",
    pickup: { name: "Seller", phone: "1", city: "Dubai", address: "A" },
    delivery: { name: "Buyer", phone: "2", city: "Dubai", address: "B" },
    weightKg: 4,
    description: "Headlight",
  });
  assert.equal(payment.status, "authorized");
  assert.match(payment.id, /^mock_pi_/);
  assert.match(shipment.trackingNumber, /^MOCK-AE-/);
});

test("catalogue repository supports OEM, fitment, verification, and price sorting in local mode", async () => {
  const byOem = await searchMarketplaceProducts({ q: "81150-60R30", compatibility: "confirmed", verified: true });
  assert.equal(byOem.length, 1);
  assert.equal(byOem[0].visual, "headlight");

  const sorted = await searchMarketplaceProducts({ sort: "price-high" });
  assert.ok(sorted[0].price.amount >= sorted.at(-1)!.price.amount);

  const product = await findMarketplaceProduct("toyota-land-cruiser-led-headlight-81150-60r30");
  assert.equal(product?.oemNumber, "81150-60R30");
});

test("vehicle fitment search narrows by make, model, year, engine, fuel, layout, and trim", async () => {
  const results = await searchMarketplaceProducts({
    make: "Toyota",
    model: "Land Cruiser",
    year: "2021",
    engineSize: "4.0L",
    fuelType: "Petrol",
    engineType: "V6",
    trim: "GXR",
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, "toyota-land-cruiser-led-headlight-81150-60r30");
});
