// Everything about talking to the API that is not an endpoint: the key and its
// mode, the headers, the idempotency key, the opt-in 429 retries, the timeout
// and the errors. The calls themselves are Hey API's generated fetch client.

import { randomUUID } from "node:crypto";
import { createClient, createConfig } from "./generated/client/index.ts";
import type { Client } from "./generated/client/index.ts";
import { ListoConnectionError, ListoError, errorFromResponse } from "./errors.ts";
import { CLIENT_ID } from "./meta.gen.ts";
import type { CallParams, Operation, PlainRequestOptions, RequestOptions, Transport } from "./transport.ts";

export const DEFAULT_BASE_URL = "https://api.listo.delivery";
export const DEFAULT_TIMEOUT_MS = 30_000;
export const RETRY_AFTER_DEFAULT_SECONDS = 1;
export const RETRY_AFTER_CAP_SECONDS = 60;

export interface ListoOptions {
  /** A `lst_live_` or `lst_test_` key. Its prefix decides the mode. */
  apiKey: string;
  /** Defaults to https://api.listo.delivery. */
  baseUrl?: string;
  /** How many times a 429 is retried (after `Retry-After`). Default 0: never. Nothing else is ever retried. */
  maxRetries?: number;
  /** Per attempt, in milliseconds. Default 30000. */
  timeoutMs?: number;
  /** A fetch to use instead of the global one (a proxy, a test double). It receives a `Request`. */
  fetch?: typeof fetch;
}

/** Seconds to wait for a `Retry-After` header: integer seconds or an HTTP date, 1 when absent or unreadable, at most 60. */
export function retryAfterSeconds(header: string | null | undefined, nowMs: number = Date.now()): number {
  const value = header?.trim() ?? "";
  let seconds = RETRY_AFTER_DEFAULT_SECONDS;
  if (/^\d+$/.test(value)) {
    seconds = Number(value);
  } else if (value !== "") {
    const at = Date.parse(value);
    if (!Number.isNaN(at)) seconds = Math.max(0, (at - nowMs) / 1000);
  }
  return Math.min(seconds, RETRY_AFTER_CAP_SECONDS);
}

function sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ListoConnectionError("The request was aborted.", { cause: signal.reason }));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new ListoConnectionError("The request was aborted.", { cause: signal?.reason }));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

type Outcome =
  | { kind: "ok"; data: unknown }
  | { kind: "refused"; error: ListoError; retryAfter: string | null };

export class HttpTransport implements Transport {
  readonly mode: "live" | "test";
  readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;
  private readonly client: Client;

  constructor(options: ListoOptions) {
    const apiKey = options?.apiKey;
    if (typeof apiKey !== "string" || !/^lst_(live|test)_/.test(apiKey)) {
      // The key is never echoed: a mistyped one is still a secret.
      throw new TypeError("Listo: apiKey must be a string starting with lst_live_ or lst_test_.");
    }
    this.mode = apiKey.startsWith("lst_live_") ? "live" : "test";
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.maxRetries = Math.max(0, Math.trunc(options.maxRetries ?? 0));
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.client = createClient(
      createConfig({
        baseUrl: this.baseUrl,
        throwOnError: false,
        ...(options.fetch ? { fetch: options.fetch } : {}),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          "User-Agent": CLIENT_ID,
          // User-Agent cannot be set from a browser, so the same value rides here too.
          "X-Listo-Client": CLIENT_ID,
        },
      }),
    );
  }

  async call<R>(
    op: Operation,
    params: CallParams,
    options: RequestOptions | PlainRequestOptions = {},
  ): Promise<R> {
    const headers: Record<string, string> = {};
    const given: unknown = options.idempotencyKey;
    if (op.idempotent) {
      // One key per logical call: its 429 retries reuse it. An empty key would
      // go out as an empty header and the call would not be protected.
      if (given !== undefined && (typeof given !== "string" || given.trim() === "")) {
        throw new TypeError(`Listo: ${op.method} ${op.path}: idempotencyKey must be a non-empty string.`);
      }
      headers["Idempotency-Key"] = given ?? randomUUID();
    } else if (given !== undefined) {
      // Dropping it silently would let a caller believe the call is protected.
      throw new TypeError(
        `Listo: ${op.method} ${op.path} takes no Idempotency-Key, so idempotencyKey is not accepted.`,
      );
    }
    for (let attempt = 0; ; attempt++) {
      const outcome = await this.attempt(op, params, headers, options.signal);
      if (outcome.kind === "ok") return outcome.data as R;
      if (outcome.error.status === 429 && attempt < this.maxRetries) {
        await sleep(retryAfterSeconds(outcome.retryAfter) * 1000, options.signal);
        continue;
      }
      throw outcome.error;
    }
  }

  private async attempt(
    op: Operation,
    params: CallParams,
    headers: Record<string, string>,
    userSignal: AbortSignal | undefined,
  ): Promise<Outcome> {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeoutMs);
    const onAbort = () => controller.abort(userSignal?.reason);
    if (userSignal?.aborted) onAbort();
    userSignal?.addEventListener("abort", onAbort, { once: true });

    let result: { data?: unknown; error?: unknown; response?: Response };
    try {
      result = await op.fn({
        client: this.client,
        path: params.path,
        query: params.query,
        body: params.body,
        headers,
        signal: controller.signal,
        throwOnError: false,
      });
    } finally {
      clearTimeout(timer);
      userSignal?.removeEventListener("abort", onAbort);
    }

    const response = result.response;
    if (response === undefined) {
      // fetch itself failed (or was aborted): no answer, and a write may have happened.
      const cause = result.error;
      const reason = timedOut
        ? `The request timed out after ${this.timeoutMs} ms.`
        : cause instanceof Error
          ? `Could not reach the Listo API: ${cause.message}`
          : "Could not reach the Listo API.";
      throw new ListoConnectionError(reason, { cause });
    }

    const requestId = response.headers.get("x-request-id");
    if (response.ok && !("error" in result)) {
      const empty = response.status === 204 || response.headers.get("content-length") === "0";
      return { kind: "ok", data: empty ? null : result.data };
    }
    // A 2xx whose body would not parse lands here too, and is not the envelope either.
    return {
      kind: "refused",
      error: errorFromResponse(response.status, requestId, result.error),
      retryAfter: response.headers.get("retry-after"),
    };
  }
}
