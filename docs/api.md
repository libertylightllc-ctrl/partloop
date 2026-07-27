# MVP API surface

All write requests use JSON and return a stable `{ error, fields? }` shape on
failure. Production consumers should send an authenticated Supabase access
token. Checkout additionally requires an `Idempotency-Key` header.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/search?q=` | Search title, Arabic title, OEM, and fitment |
| `POST` | `/api/auth/demo` | Set a local demo role cookie |
| `POST` | `/api/listings/ai-assist` | Validate seller input and generate a bilingual draft |
| `POST` | `/api/checkout` | Authorize protected payment and create a shipment |
| `POST` | `/api/disputes/:id/resolve` | Refund, partial refund, or release |
| `POST` | `/api/webhooks/stripe` | Stripe Connect webhook integration point |

## Checkout example

```json
{
  "productId": "prd_headlight",
  "quantity": 1,
  "address": {
    "name": "Omar Khalid",
    "phone": "+971501234567",
    "line1": "Building 12, Al Barsha 1",
    "city": "Dubai",
    "country": "AE"
  }
}
```

The default response uses `mock` providers. Set `PAYMENT_PROVIDER=stripe` or
`LOGISTICS_PROVIDER=aramex` only after the corresponding credentials and
merchant agreements are ready.
