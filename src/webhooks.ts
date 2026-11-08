// Verifying X-Listo-Signature. This mirrors the signing rule Listo's server uses,
// rule for rule, and the signature test cases shared by every SDK and the server
// are its authority.
//
//   X-Listo-Signature: t=<unix seconds>,v1=<hex hmac-sha256 over "<t>.<raw body>">
//
// The body must be the RAW bytes as received: a parsed and re-serialised body
// has different bytes, so its signature will not match.

import { createHmac, timingSafeEqual } from "node:crypto";
import { ListoSignatureError, invalidPayload } from "./errors.ts";
import type { WebhookEvent } from "./generated/types.gen.ts";

/** Five minutes, in both directions. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

export interface VerifyOptions {
  /** Seconds either side of now a timestamp may sit. Default 300. */
  tolerance?: number;
  /** The clock to check against, in unix seconds. Default: the current time. */
  now?: number;
}

export type RawBody = string | Uint8Array;

// \d and [0-9a-fA-F] only, one v1, nothing around it: the server's own pattern.
const HEADER = /^t=(\d+),v1=([0-9a-fA-F]+)$/;

function isBlank(secret: unknown): boolean {
  return typeof secret !== "string" || secret.trim() === "";
}

/**
 * True only when `signatureHeader` is a well-formed signature over `rawBody`,
 * made within the tolerance of now, under ANY of `secrets` (two are active
 * during a rotation). Never throws: anything malformed is just false.
 */
export function verify(
  rawBody: RawBody,
  signatureHeader: string | null | undefined,
  secrets: string | readonly string[],
  options: VerifyOptions = {},
): boolean {
  try {
    const usable = (Array.isArray(secrets) ? secrets : [secrets]).filter((s): s is string => !isBlank(s));
    if (usable.length === 0) return false;

    const match = HEADER.exec(typeof signatureHeader === "string" ? signatureHeader : "");
    if (match === null) return false;
    // BigInt, because the server reads the digits as an integer: leading zeros
    // drop out of the signed string, and a huge t is just far from now.
    const timestamp = BigInt(match[1] as string);
    const given = match[2] as string;

    const now = BigInt(Math.trunc(options.now ?? Date.now() / 1000));
    const tolerance = BigInt(Math.trunc(options.tolerance ?? DEFAULT_TOLERANCE_SECONDS));
    const distance = now > timestamp ? now - timestamp : timestamp - now;
    if (distance > tolerance) return false;

    const body = typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : Buffer.from(rawBody);
    const givenBytes = Buffer.from(given, "utf8");
    return usable.some((secret) => {
      const expected = Buffer.from(
        createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex"),
        "utf8",
      );
      // Length first: timingSafeEqual throws on unequal lengths. Hex is compared
      // as given, so an upper-case signature is not a match.
      return expected.length === givenBytes.length && timingSafeEqual(expected, givenBytes);
    });
  } catch {
    return false;
  }
}

/**
 * Verifies, then parses the body into the typed event. Throws
 * `ListoSignatureError` (a `ListoError`, code `invalid_signature`) when the
 * signature is bad, and a `ListoError` with code `invalid_payload` when the
 * signed body is not a JSON object. The shape is not checked beyond that: an
 * event comes back as it arrived (id, type, created_at, data), typed by its
 * `type`, and one whose `type` this SDK does not know yet is not an error
 * either, so keep a default branch when you switch on `type`.
 */
export function constructEvent(
  rawBody: RawBody,
  signatureHeader: string | null | undefined,
  secrets: string | readonly string[],
  options: VerifyOptions = {},
): WebhookEvent {
  if (!verify(rawBody, signatureHeader, secrets, options)) throw new ListoSignatureError();
  const text = typeof rawBody === "string" ? rawBody : Buffer.from(rawBody).toString("utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw invalidPayload("The signed webhook body is not valid JSON.", { cause });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw invalidPayload("The signed webhook body is not a JSON object.");
  }
  return parsed as WebhookEvent;
}

/** The helpers on their own, for a receiver that holds no API key. */
export const webhooks = { verify, constructEvent };
export type WebhookVerifier = typeof webhooks;
