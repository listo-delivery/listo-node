# listo-delivery

The official TypeScript SDK for the [Listo Delivery API](https://docs.listo.delivery).
It has no runtime dependencies: it uses the global `fetch` and `node:crypto`, and runs on Node 18 or later.

The types, the request code and the resources are generated from the published
OpenAPI schema, so a field the API documents is a field you get.

## Install

```sh
npm i listo-delivery
```

## Quickstart: quote and book a test delivery

A key that starts with `lst_test_` dispatches simulated couriers and moves no
money. `lst_live_` books real ones. The prefix decides the mode: `listo.mode`
is `"test"` or `"live"`, and there is no separate option.

```ts
import { Listo } from "listo-delivery";

const listo = new Listo({ apiKey: process.env.LISTO_API_KEY! });

const quote = await listo.quotes.create({
  store_id: "st_...",
  dropoff: { street: "Av. Vallarta 1234, Guadalajara" },
});

const delivery = await listo.deliveries.create(
  {
    store_id: "st_...",
    quote_id: quote.id,
    external_id: "order-841", // your own order id
    payment_method: "prepaid",
    order_value_cents: 18000,
    dropoff: { name: "Ana", phone: "+523312345678", street: "Av. Vallarta 1234, Guadalajara" },
  },
  { idempotencyKey: "order-841" },
);

console.log(delivery.id, delivery.status);
```

A file that uses top-level `await`, like this one, needs `"type": "module"` in
your project's `package.json` for `tsc` to accept it (Node runs it either way).

Field names are the wire names (`store_id`, `order_value_cents`). Every call is
`listo.<resource>.<method>(...pathValues, bodyOrQuery?, options?)`: path values
come first, in path order, then one object (the body of a write, the query of a
read), then the options. A body the schema requires is a required argument.

```ts
await listo.deliveries.retrieve("dlv_...");
await listo.deliveries.cancel("dlv_...", { reason: "customer_canceled" });
await listo.ledger.listForStore("st_...", { cursor });
await listo.ping();
```

Every operation of the API is a method, named after it and camel-cased here
(`listo.requestLogs`, `listo.cardOnboarding.createForStore`, ...); the API reference at
[docs.listo.delivery](https://docs.listo.delivery) lists them all.

## Verify a webhook

Verify the RAW body exactly as it arrived, before any JSON parsing. A parsed and
re-serialised body has different bytes and will not match.

```ts
import express from "express";
import { Listo, ListoError } from "listo-delivery";

const app = express();

app.post("/webhooks/listo", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const event = Listo.webhooks.constructEvent(
      req.body, // a Buffer
      req.header("X-Listo-Signature"),
      [process.env.LISTO_WEBHOOK_SECRET!], // two during a secret rotation
    );
    if (event.type === "delivery.status_changed") {
      console.log(event.data.id, event.data.status); // narrowed to a Delivery
    }
    res.sendStatus(204);
  } catch (error) {
    // ListoError covers both refusals: invalid_signature (ListoSignatureError)
    // and invalid_payload (a signed body that is not a JSON object).
    if (error instanceof ListoError) return void res.sendStatus(400);
    throw error;
  }
});
```

`Listo.webhooks` (also exported as `webhooks`) needs no API key. The same two
functions are on `listo.webhooks` next to the API's own webhook calls.

- `verify(rawBody, header, secrets, { tolerance?, now? })` returns a boolean and never throws.
  The header must be `t=<unix seconds>,v1=<hex>`; the signed string is `"<t>.<raw body>"`;
  a timestamp more than 300 seconds from now in either direction is refused, and so is
  an upper-case signature. Blank secrets are ignored; with none left the answer is `false`.
- `constructEvent(...)` verifies, then parses the body into the `WebhookEvent` union,
  discriminated on `type`. It throws `ListoSignatureError` (a `ListoError` with code
  `invalid_signature`) on a bad signature, and a `ListoError` with code `invalid_payload`
  when the signed body is not a JSON object. Beyond that it does not check the shape:
  an event comes back as it arrived, typed by its `type` (the TypeScript types describe it,
  they do not validate it), and one whose `type` this SDK does not know yet is not an
  error either, so keep a default branch when you switch on `type`.

## Errors

Every refusal and failure is one class, `ListoError`. Branch on `code`, never on `message`.

```ts
import { ListoError, ListoConnectionError } from "listo-delivery";

try {
  await listo.deliveries.create(body);
} catch (error) {
  if (error instanceof ListoConnectionError) {
    // No answer (DNS, refused, timeout). A write may have happened: retry with the SAME idempotency key.
  } else if (error instanceof ListoError) {
    console.log(error.code, error.status, error.param, error.retryable, error.requestId, error.docUrl);
  }
}
```

Fields: `code`, `message`, `param`, `retryable`, `status`, `requestId`, `docUrl`, and the
parsed response `body`. (Python and Ruby spell the last two `request_id` and `doc_url`.)
A response that is not the API's error envelope (an HTML page from a proxy) is still a
`ListoError`, with `code: "http_<status>"`. The API key is never put in an error message.

## Idempotency

The operations whose schema takes an `Idempotency-Key` header (creating a delivery, a
refund, creating a store, reactivating or cancelling a store's plan) always send one:
yours when you pass `{ idempotencyKey }` (key it on your own order id; an empty or blank
key throws a `TypeError` before any request), otherwise a fresh UUID for that call.
Repeating a call with the same key within 24 hours returns the original answer instead of
doing the work again. No other operation sends the header, and passing `idempotencyKey` to
one is a compile-time error (and a `TypeError` before any request in plain JavaScript),
never silently dropped.

## Pagination

List calls return the page as the schema has it: `data`, `has_more` and `cursor`.
Pass `cursor` back to get the next page.

```ts
let cursor: string | undefined;
do {
  const page = await listo.deliveries.list({ status: "delivered", cursor });
  for (const delivery of page.data) console.log(delivery.id);
  cursor = page.has_more && page.cursor ? page.cursor : undefined;
} while (cursor);
```

## Retries and timeouts

Nothing is retried by default. With `maxRetries: n`, only a `429` is retried, up to `n`
times, after the `Retry-After` wait (seconds or an HTTP date; 1 second when missing or
unreadable; never more than 60), with the same idempotency key. A `5xx` or a dropped
connection is never retried automatically, because a write may have happened.

```ts
const listo = new Listo({
  apiKey,
  maxRetries: 2,
  timeoutMs: 30_000, // per attempt, the default
  baseUrl: "https://api.listo.delivery", // the default
  fetch: customFetch, // optional; receives a Request
});
```

A call also takes `{ signal }` to abort it.

## About this repository

This code is generated from Listo's API definition. Issues and questions are
welcome in this repository. Changes are made upstream by Listo and released
here, so a pull request cannot be merged as it stands: open an issue and the
change is made at the source.
