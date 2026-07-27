# PartsLoop architecture

PartsLoop is a local-first monorepo. The root Next.js application serves the
buyer marketplace plus role-separated seller and admin portals. The Flutter
application lives in `apps/mobile`, while reusable domain contracts live in
`packages/contracts`.

```mermaid
flowchart LR
  WEB["Next.js web\nBuyer · Seller · Admin"]
  MOBILE["Flutter mobile\nBuyer · Seller"]
  API["Next.js route handlers\nValidation · RBAC · idempotency"]
  DB["Supabase\nPostgreSQL · Auth · Storage · Realtime"]
  PAY["PaymentProvider\nMock / Stripe Connect"]
  SHIP["LogisticsProvider\nMock / Aramex"]
  AI["ListingAssistant\nDeterministic mock / external endpoint"]

  WEB --> API
  MOBILE --> API
  API --> DB
  API --> PAY
  API --> SHIP
  API --> AI
```

## Trust boundaries

- Browser and mobile input is always untrusted and validated at the API edge.
- A service-role key is server-only. The browser uses the Supabase anonymous
  key and row-level security.
- Payment and logistics webhooks are idempotent and should be persisted by
  provider event ID before applying order transitions.
- “Escrow” is presented as protected payment. Funds are authorized or held by a
  licensed payment provider; PartsLoop does not operate an unlicensed wallet.
- AI output is a draft. A seller must confirm fitment, condition, and defects.

## Protected order state machine

```mermaid
stateDiagram-v2
  [*] --> payment_secured
  payment_secured --> seller_confirmed
  seller_confirmed --> packed
  packed --> collected
  collected --> out_for_delivery
  out_for_delivery --> delivered
  delivered --> inspection
  inspection --> released: buyer confirms / timer expires
  inspection --> disputed: buyer reports issue
  disputed --> refunded: admin refunds
  disputed --> released: admin rejects claim
```

Only the server applies these transitions. Client buttons request a transition;
they never write order status directly.
