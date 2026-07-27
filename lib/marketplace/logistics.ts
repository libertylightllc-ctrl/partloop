export interface ShipmentInput {
  orderId: string;
  pickup: { name: string; phone: string; city: string; address: string };
  delivery: { name: string; phone: string; city: string; address: string };
  weightKg: number;
  description: string;
}

export interface Shipment {
  trackingNumber: string;
  labelUrl?: string;
  provider: "mock" | "aramex";
}

export interface LogisticsProvider {
  createShipment(input: ShipmentInput): Promise<Shipment>;
  track(trackingNumber: string): Promise<{ status: string; occurredAt: string }[]>;
}

export class MockLogisticsProvider implements LogisticsProvider {
  async createShipment(input: ShipmentInput) {
    return { trackingNumber: `MOCK-AE-${input.orderId.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}`, provider: "mock" as const };
  }
  async track() {
    return [{ status: "Shipment created", occurredAt: new Date().toISOString() }];
  }
}

export class AramexProvider implements LogisticsProvider {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  private clientInfo() {
    return {
      UserName: process.env.ARAMEX_USERNAME,
      Password: process.env.ARAMEX_PASSWORD,
      Version: "v1.0",
      AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
      AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
      AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY,
      AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE ?? "AE",
      Source: 24,
    };
  }
  async createShipment(input: ShipmentInput): Promise<Shipment> {
    const response = await fetch(`${this.baseUrl}/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ClientInfo: this.clientInfo(), Shipments: [{ Reference1: input.orderId, Details: { DescriptionOfGoods: input.description, ActualWeight: { Value: input.weightKg, Unit: "KG" } } }] }),
    });
    if (!response.ok) throw new Error(`Aramex shipment request failed (${response.status}).`);
    const result = (await response.json()) as { Shipments?: Array<{ ID: string; LabelURL?: string }> };
    const shipment = result.Shipments?.[0];
    if (!shipment?.ID) throw new Error("Aramex did not return a tracking number.");
    return { trackingNumber: shipment.ID, labelUrl: shipment.LabelURL, provider: "aramex" };
  }
  async track(trackingNumber: string) {
    const response = await fetch(`${this.baseUrl}/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ClientInfo: this.clientInfo(), Shipments: [trackingNumber] }),
    });
    if (!response.ok) throw new Error(`Aramex tracking request failed (${response.status}).`);
    return [{ status: "Tracking requested", occurredAt: new Date().toISOString() }];
  }
}

export function getLogisticsProvider(): LogisticsProvider {
  if (process.env.LOGISTICS_PROVIDER === "aramex") {
    return new AramexProvider(process.env.ARAMEX_API_BASE_URL ?? "https://ws.aramex.net");
  }
  return new MockLogisticsProvider();
}
