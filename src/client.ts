import { HttpTransport } from "./http.ts";
import type { ListoOptions } from "./http.ts";
import { Resources, WebhooksResource } from "./resources.gen.ts";
import { constructEvent, verify, webhooks } from "./webhooks.ts";
import type { WebhookVerifier } from "./webhooks.ts";

/** `listo.webhooks`: the API's webhook calls (send a test, read delivery attempts) plus the signature helpers. */
export class ListoWebhooks extends WebhooksResource {
  verify(...args: Parameters<WebhookVerifier["verify"]>): boolean {
    return verify(...args);
  }

  constructEvent(...args: Parameters<WebhookVerifier["constructEvent"]>): ReturnType<WebhookVerifier["constructEvent"]> {
    return constructEvent(...args);
  }
}

export class Listo extends Resources {
  /** The signature helpers without a client, for a receiver that holds no API key. */
  static readonly webhooks: WebhookVerifier = webhooks;

  declare readonly webhooks: ListoWebhooks;
  /** `"live"` or `"test"`, read from the key's prefix. */
  readonly mode: "live" | "test";
  readonly baseUrl: string;

  constructor(options: ListoOptions) {
    const transport = new HttpTransport(options);
    super(transport, { webhooks: new ListoWebhooks(transport) });
    this.mode = transport.mode;
    this.baseUrl = transport.baseUrl;
  }
}
