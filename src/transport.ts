// The seam between the generated resource layer and the code that talks HTTP.
// The generated classes know an operation and its arguments; they never see
// a header, a retry or an error, which keeps all of that in one file (http.ts).

/** One API operation as the generated layer knows it. */
export interface Operation {
  /** The Hey API function for the operation. */
  readonly fn: (options: any) => PromiseLike<any>;
  /** True when the schema declares the Idempotency-Key header parameter. */
  readonly idempotent: boolean;
  readonly method: string;
  readonly path: string;
}

/** Options for a call on an operation that takes no Idempotency-Key. */
export interface PlainRequestOptions {
  /** Aborts the call (and any wait between retries). */
  signal?: AbortSignal;
  /**
   * Not accepted here: the operation has no Idempotency-Key header, so a key
   * would be dropped. Typed `never` so the compiler refuses it, and refused
   * again at run time for callers without types.
   */
  idempotencyKey?: never;
}

/** Options for a call on an operation that takes an Idempotency-Key. */
export interface RequestOptions {
  /**
   * Sent as the Idempotency-Key header. Key it on your own order id so a
   * retry after a timeout cannot book twice. Must not be empty. When left
   * out, a fresh UUID is used for this call and its 429 retries.
   */
  idempotencyKey?: string;
  /** Aborts the call (and any wait between retries). */
  signal?: AbortSignal;
}

/** What the generated methods hand over: path values by wire name, a query or a body. */
export interface CallParams {
  path?: Record<string, string>;
  query?: unknown;
  body?: unknown;
}

export interface Transport {
  call<R>(op: Operation, params: CallParams, options?: RequestOptions | PlainRequestOptions): Promise<R>;
}
