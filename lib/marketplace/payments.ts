import type { Money } from "@partsloop/contracts";

export interface AuthorizePaymentInput {
  orderId: string;
  amount: Money;
  sellerAccountId: string;
  idempotencyKey: string;
}

export interface AuthorizedPayment {
  id: string;
  status: "authorized" | "requires_action";
  provider: "mock" | "stripe";
  clientSecret?: string;
}

export interface PaymentProvider {
  authorize(input: AuthorizePaymentInput): Promise<AuthorizedPayment>;
  capture(paymentId: string, sellerAmount: Money): Promise<void>;
  refund(paymentId: string, amount?: Money): Promise<void>;
}

export class MockPaymentProvider implements PaymentProvider {
  async authorize(input: AuthorizePaymentInput): Promise<AuthorizedPayment> {
    return { id: `mock_pi_${input.orderId}`, status: "authorized", provider: "mock" };
  }
  async capture() {}
  async refund() {}
}

export class StripeConnectProvider implements PaymentProvider {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private async request(path: string, body: URLSearchParams) {
    const response = await fetch(`https://api.stripe.com/v1/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!response.ok) throw new Error(`Stripe request failed (${response.status}).`);
    return response.json() as Promise<Record<string, unknown>>;
  }

  async authorize(input: AuthorizePaymentInput): Promise<AuthorizedPayment> {
    const body = new URLSearchParams({
      amount: String(input.amount.amount * 100),
      currency: input.amount.currency.toLowerCase(),
      capture_method: "manual",
      "metadata[order_id]": input.orderId,
      "transfer_data[destination]": input.sellerAccountId,
    });
    const result = await this.request("payment_intents", body);
    return {
      id: String(result.id),
      status: result.status === "requires_action" ? "requires_action" : "authorized",
      provider: "stripe",
      clientSecret: String(result.client_secret ?? ""),
    };
  }

  async capture(paymentId: string) {
    await this.request(`payment_intents/${paymentId}/capture`, new URLSearchParams());
  }

  async refund(paymentId: string, amount?: Money) {
    const body = new URLSearchParams({ payment_intent: paymentId });
    if (amount) body.set("amount", String(amount.amount * 100));
    await this.request("refunds", body);
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_PROVIDER === "stripe" && process.env.STRIPE_SECRET_KEY) {
    return new StripeConnectProvider(process.env.STRIPE_SECRET_KEY);
  }
  return new MockPaymentProvider();
}
