# PartsLoop

Production-oriented MVP for a Middle East marketplace for new, used, and
refurbished auto parts. The experience is familiar to mainstream regional
e-commerce users, but the design, brand, and auto-parts workflows are original.

The working vertical slice now includes:

- buyer role: bilingual browse/search, vehicle garage, product fitment,
  cart, protected checkout, and order tracking;
- seller role: dashboard, AI-assisted bilingual listing, inventory search and
  bulk publication, fulfilment board, verification, and protected/available
  wallet balances;
- admin role: operations dashboard, interactive risk moderation, seller
  approvals, evidence review, and dispute resolution;
- backend: typed validation, mock-first payment and logistics providers,
  Stripe Connect and Aramex integration points, Supabase schema/RLS/storage;
- mobile: Flutter buyer/seller shell with localized browse, real product
  photography, search, product, sell, and order-tracking screens.

The buyer UI also includes a working garage selector, compatibility and seller
filters, sorting, protected offers, seller chat, seller directory, and
responsive Arabic RTL layouts.

## Repository map

```text
app/                         Next.js routes, portals, and APIs
components/                  Shared responsive UI
lib/                         Mock data, auth, payment/logistics adapters
packages/contracts/          Shared TypeScript DTOs and validation
apps/mobile/                 Flutter iOS/Android application
supabase/migrations/         PostgreSQL schema, indexes, and RLS
supabase/seed.sql            Local seed starting point
docs/                        Architecture and API notes
tests/                       Domain and provider tests
```

## Run the zero-cost demo

Requirements: Node.js 22.13 or newer.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open the URL printed by the development server. The default environment uses
local data, a mock protected-payment authorization, and a mock UAE shipment.
No external account or real charge is required.

Use the role chooser at `/auth/sign-in`, or open:

- `/` — buyer marketplace
- `/seller` — seller workspace
- `/admin` — admin operations

The demo intentionally makes every vertical-slice screen discoverable. In
non-demo mode, server-side role checks redirect unauthorized users.

## Supabase

Install the Supabase CLI and Docker, then:

```bash
supabase start
supabase db reset
```

Copy the local URL, anonymous key, and service-role key into `.env.local`, then
set `DEMO_MODE=false`. The sign-in screen switches from the local role chooser
to Supabase password authentication. The local seeded seller is:

```text
seller@partsloop.local
PartsLoopDemo123!
```

The migrations include profiles, seller verification, garages,
products, fitment, carts, orders, protected-payment events, shipments,
timelines, disputes, evidence, and realtime-ready chat tables. Row-level
security is enabled for user-owned and transaction data. Admin mutations should
use server-side service credentials plus an application-level admin check.

Checkout persistence is performed by a restricted PostgreSQL function so the
order, item, payment authorization, shipment, and first timeline event are
written atomically and idempotently.

## Payments

The app uses a `PaymentProvider` abstraction.

- `PAYMENT_PROVIDER=mock` authorizes locally and never charges.
- `PAYMENT_PROVIDER=stripe` creates manual-capture PaymentIntents and includes a
  Stripe Connect destination account.

“Escrow” is implemented as an escrow-like protected-payment flow through the
licensed provider: authorize/hold, deliver, inspect, then capture and transfer.
Do not store customer funds in a PartsLoop wallet without the required
financial permissions.

Before production:

1. complete Stripe Connect marketplace onboarding for your launch country;
2. verify webhook signatures from the raw request body;
3. store each provider event ID before applying idempotent order transitions;
4. define capture windows, returns, chargebacks, and seller reserve rules with
   local legal and payment advisors.

## Logistics

`LOGISTICS_PROVIDER=mock` creates local tracking numbers. The Aramex adapter
contains account and endpoint integration points for shipment creation and
tracking.

Before enabling `LOGISTICS_PROVIDER=aramex`, map verified pickup/delivery
addresses to the exact Aramex contract schema, add package dimensions and
customs fields, validate hazardous/restricted part rules, and test against your
merchant account environment.

## AI listing assistant

The default assistant is deterministic and free. It validates the seller’s
part name, OEM number, donor vehicle, condition, and notes, then returns a
realistic bilingual draft. Configure `AI_LISTING_ENDPOINT` to call your chosen
vision/OCR service.

AI is advisory. Sellers remain responsible for OEM, fitment, condition, defects,
and pricing. An authoritative fitment catalogue should replace AI inference for
the final compatibility guarantee.

## Flutter

Install Flutter 3.22 or newer, then:

```bash
cd apps/mobile
flutter pub get
flutter run
```

The mobile app uses a mock repository by default. `PartsLoopApiRepository` is
the integration seam for the shared web API. Native iOS and Android wrapper
folders can be generated once with `flutter create .`; this environment does
not install Flutter or platform SDKs.

## Quality checks

```bash
npm run test
npm run lint
npm run build
```

For Flutter:

```bash
cd apps/mobile
flutter analyze
flutter test
```

## Production checklist

- replace demo auth with Supabase email/OTP or approved identity providers;
- keep service-role, Stripe, and Aramex credentials server-side;
- add request rate limiting and a durable idempotency store;
- complete payment, marketplace, tax, data-protection, and restricted-parts
  reviews for each launch country;
- license authoritative VIN/OEM/fitment data;
- connect object storage uploads and malware/media validation;
- add observability, backups, recovery drills, and operational alerting;
- run accessibility, device, Arabic copy, security, and payment-provider
  certification testing.

See [architecture](docs/architecture.md) and [API notes](docs/api.md) for the
main system boundaries and order state machine.
