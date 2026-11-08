// One error class for everything the API refuses, so a caller writes a single
// `catch (e) { if (e instanceof ListoError) ... }`. Branch on `code`, never on
// `message`, which is for a person reading a log.

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

export interface ListoErrorFields {
  code: string;
  message: string;
  param: string | null;
  retryable: boolean;
  status: number | null;
  requestId: string | null;
  docUrl: string | null;
  body: unknown;
}

export class ListoError extends Error {
  /** The stable name of what went wrong (`validation_failed`, `insufficient_balance`, ...). */
  readonly code: string;
  /** The request field the refusal is about, when one applies. */
  readonly param: string | null;
  /** Whether sending the identical request again could succeed. */
  readonly retryable: boolean;
  /** The HTTP status, or null when no response arrived. */
  readonly status: number | null;
  readonly requestId: string | null;
  readonly docUrl: string | null;
  /** The parsed response body (or its text when it was not JSON). */
  readonly body: unknown;

  constructor(fields: ListoErrorFields, options?: { cause?: unknown }) {
    super(fields.message, options);
    this.name = "ListoError";
    this.code = fields.code;
    this.param = fields.param;
    this.retryable = fields.retryable;
    this.status = fields.status;
    this.requestId = fields.requestId;
    this.docUrl = fields.docUrl;
    this.body = fields.body;
  }
}

/** DNS failure, refused connection or timeout: no answer arrived. A write may have happened. */
export class ListoConnectionError extends ListoError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(
      {
        code: "connection_error",
        message,
        param: null,
        retryable: false,
        status: null,
        requestId: null,
        docUrl: null,
        body: null,
      },
      options,
    );
    this.name = "ListoConnectionError";
  }
}

/** A webhook whose signature did not verify. A `ListoError` with code `invalid_signature`, as in Python and Ruby. */
export class ListoSignatureError extends ListoError {
  constructor(message = "The webhook signature is not valid.") {
    super({
      code: "invalid_signature",
      message,
      param: null,
      retryable: false,
      status: null,
      requestId: null,
      docUrl: null,
      body: null,
    });
    this.name = "ListoSignatureError";
  }
}

/** A signed webhook body that is not a JSON object. Code `invalid_payload`, as in Python and Ruby. */
export function invalidPayload(message: string, options?: { cause?: unknown }): ListoError {
  return new ListoError(
    { code: "invalid_payload", message, param: null, retryable: false, status: null, requestId: null, docUrl: null, body: null },
    options,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Builds the error for a non-2xx answer from its parsed body (or text). */
export function errorFromResponse(status: number, requestIdHeader: string | null, body: unknown): ListoError {
  const envelope = isRecord(body) && isRecord(body.error) ? body.error : null;
  if (envelope !== null && typeof envelope.code === "string") {
    return new ListoError({
      code: envelope.code,
      message: typeof envelope.message === "string" ? envelope.message : `The API answered ${status}.`,
      param: typeof envelope.param === "string" ? envelope.param : null,
      retryable: typeof envelope.retryable === "boolean" ? envelope.retryable : RETRYABLE_STATUSES.has(status),
      status,
      requestId: typeof envelope.request_id === "string" ? envelope.request_id : requestIdHeader,
      docUrl: typeof envelope.doc_url === "string" ? envelope.doc_url : null,
      body,
    });
  }
  // An HTML page from a proxy, or JSON of another shape.
  return new ListoError({
    code: `http_${status}`,
    message: `Unexpected response with status ${status}`,
    param: null,
    retryable: RETRYABLE_STATUSES.has(status),
    status,
    requestId: requestIdHeader,
    docUrl: null,
    body,
  });
}
