// Generated from Listo's API definition. Do not edit.

import { cancelDelivery, cancelStorePlan, createCardOnboarding, createConnectRequest, createConnection, createDelivery, createQuote, createStore, createStoreCardOnboarding, createStoreOwner, createWithdrawal, getBalance, getCardStatus, getDelivery, getEvent, getRequestLog, getStore, getStoreBalance, getStoreCardStatus, getWithdrawal, listDeliveries, listEvents, listLedgerEntries, listRequestLogs, listStoreLedgerEntries, listStores, listWebhookDeliveries, listWithdrawals, ping, reactivateStorePlan, refundDelivery, rescheduleDelivery, resendEvent, retryDelivery, sendTestWebhook, undoStorePlanCancellation, updateStore } from "./generated/sdk.gen.ts";
import type { CancelDeliveryData, CancelDeliveryResponse, CancelStorePlanData, CancelStorePlanResponse, CreateCardOnboardingData, CreateCardOnboardingResponse, CreateConnectRequestData, CreateConnectRequestResponse, CreateConnectionData, CreateConnectionResponse, CreateDeliveryData, CreateDeliveryResponse, CreateQuoteData, CreateQuoteResponse, CreateStoreCardOnboardingData, CreateStoreCardOnboardingResponse, CreateStoreData, CreateStoreOwnerData, CreateStoreOwnerResponse, CreateStoreResponse, CreateWithdrawalData, CreateWithdrawalResponse, GetBalanceData, GetBalanceResponse, GetCardStatusData, GetCardStatusResponse, GetDeliveryData, GetDeliveryResponse, GetEventData, GetEventResponse, GetRequestLogData, GetRequestLogResponse, GetStoreBalanceData, GetStoreBalanceResponse, GetStoreCardStatusData, GetStoreCardStatusResponse, GetStoreData, GetStoreResponse, GetWithdrawalData, GetWithdrawalResponse, ListDeliveriesData, ListDeliveriesResponse, ListEventsData, ListEventsResponse, ListLedgerEntriesData, ListLedgerEntriesResponse, ListRequestLogsData, ListRequestLogsResponse, ListStoreLedgerEntriesData, ListStoreLedgerEntriesResponse, ListStoresData, ListStoresResponse, ListWebhookDeliveriesData, ListWebhookDeliveriesResponse, ListWithdrawalsData, ListWithdrawalsResponse, PingData, PingResponse, ReactivateStorePlanData, ReactivateStorePlanResponse, RefundDeliveryData, RefundDeliveryResponse, RescheduleDeliveryData, RescheduleDeliveryResponse, ResendEventData, ResendEventResponse, RetryDeliveryData, RetryDeliveryResponse, SendTestWebhookData, SendTestWebhookResponse, UndoStorePlanCancellationData, UndoStorePlanCancellationResponse, UpdateStoreData, UpdateStoreResponse } from "./generated/types.gen.ts";
import type { Operation, PlainRequestOptions, RequestOptions, Transport } from "./transport.ts";

/** Every operation: the Hey API function and whether the schema asks for an Idempotency-Key. */
export const OPS = {
  cancelDelivery: { fn: cancelDelivery, idempotent: false, method: "POST", path: "/v1/deliveries/{delivery_id}/cancellations" },
  cancelStorePlan: { fn: cancelStorePlan, idempotent: true, method: "POST", path: "/v1/stores/{store_id}/plan_cancellation" },
  createCardOnboarding: { fn: createCardOnboarding, idempotent: false, method: "POST", path: "/v1/stripe_onboarding" },
  createConnectRequest: { fn: createConnectRequest, idempotent: false, method: "POST", path: "/v1/connect_requests" },
  createConnection: { fn: createConnection, idempotent: false, method: "POST", path: "/v1/connections" },
  createDelivery: { fn: createDelivery, idempotent: true, method: "POST", path: "/v1/deliveries" },
  createQuote: { fn: createQuote, idempotent: false, method: "POST", path: "/v1/quotes" },
  createStore: { fn: createStore, idempotent: true, method: "POST", path: "/v1/stores" },
  createStoreCardOnboarding: { fn: createStoreCardOnboarding, idempotent: false, method: "POST", path: "/v1/stores/{store_id}/stripe_onboarding" },
  createStoreOwner: { fn: createStoreOwner, idempotent: false, method: "POST", path: "/v1/stores/{store_id}/owner" },
  createWithdrawal: { fn: createWithdrawal, idempotent: false, method: "POST", path: "/v1/withdrawals" },
  getBalance: { fn: getBalance, idempotent: false, method: "GET", path: "/v1/balance" },
  getCardStatus: { fn: getCardStatus, idempotent: false, method: "GET", path: "/v1/stripe_status" },
  getDelivery: { fn: getDelivery, idempotent: false, method: "GET", path: "/v1/deliveries/{id}" },
  getEvent: { fn: getEvent, idempotent: false, method: "GET", path: "/v1/events/{id}" },
  getRequestLog: { fn: getRequestLog, idempotent: false, method: "GET", path: "/v1/request_logs/{id}" },
  getStore: { fn: getStore, idempotent: false, method: "GET", path: "/v1/stores/{id}" },
  getStoreBalance: { fn: getStoreBalance, idempotent: false, method: "GET", path: "/v1/stores/{store_id}/balance" },
  getStoreCardStatus: { fn: getStoreCardStatus, idempotent: false, method: "GET", path: "/v1/stores/{store_id}/stripe_status" },
  getWithdrawal: { fn: getWithdrawal, idempotent: false, method: "GET", path: "/v1/withdrawals/{id}" },
  listDeliveries: { fn: listDeliveries, idempotent: false, method: "GET", path: "/v1/deliveries" },
  listEvents: { fn: listEvents, idempotent: false, method: "GET", path: "/v1/events" },
  listLedgerEntries: { fn: listLedgerEntries, idempotent: false, method: "GET", path: "/v1/ledger" },
  listRequestLogs: { fn: listRequestLogs, idempotent: false, method: "GET", path: "/v1/request_logs" },
  listStoreLedgerEntries: { fn: listStoreLedgerEntries, idempotent: false, method: "GET", path: "/v1/stores/{store_id}/ledger" },
  listStores: { fn: listStores, idempotent: false, method: "GET", path: "/v1/stores" },
  listWebhookDeliveries: { fn: listWebhookDeliveries, idempotent: false, method: "GET", path: "/v1/webhook_deliveries" },
  listWithdrawals: { fn: listWithdrawals, idempotent: false, method: "GET", path: "/v1/withdrawals" },
  ping: { fn: ping, idempotent: false, method: "GET", path: "/v1/ping" },
  reactivateStorePlan: { fn: reactivateStorePlan, idempotent: true, method: "POST", path: "/v1/stores/{store_id}/plan" },
  refundDelivery: { fn: refundDelivery, idempotent: true, method: "POST", path: "/v1/deliveries/{delivery_id}/refunds" },
  rescheduleDelivery: { fn: rescheduleDelivery, idempotent: false, method: "PATCH", path: "/v1/deliveries/{id}" },
  resendEvent: { fn: resendEvent, idempotent: false, method: "POST", path: "/v1/events/{event_id}/resend" },
  retryDelivery: { fn: retryDelivery, idempotent: false, method: "POST", path: "/v1/deliveries/{delivery_id}/retries" },
  sendTestWebhook: { fn: sendTestWebhook, idempotent: false, method: "POST", path: "/v1/test_webhooks" },
  undoStorePlanCancellation: { fn: undoStorePlanCancellation, idempotent: false, method: "DELETE", path: "/v1/stores/{store_id}/plan_cancellation" },
  updateStore: { fn: updateStore, idempotent: false, method: "PATCH", path: "/v1/stores/{id}" },
} as const satisfies Record<string, Operation>;

export class BalanceResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Read your prepaid balance (GET /v1/balance) */
  retrieve(options?: PlainRequestOptions): Promise<GetBalanceResponse> {
    return this.t.call<GetBalanceResponse>(OPS.getBalance, {  }, options);
  }

  /** Read a store's balance (GET /v1/stores/{store_id}/balance) */
  retrieveForStore(storeId: GetStoreBalanceData["path"]["store_id"], options?: PlainRequestOptions): Promise<GetStoreBalanceResponse> {
    return this.t.call<GetStoreBalanceResponse>(OPS.getStoreBalance, { path: { store_id: storeId } }, options);
  }
}

export class CardOnboardingResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Start card onboarding for your company (POST /v1/stripe_onboarding) */
  create(options?: PlainRequestOptions): Promise<CreateCardOnboardingResponse> {
    return this.t.call<CreateCardOnboardingResponse>(OPS.createCardOnboarding, {  }, options);
  }

  /** Start card onboarding for a store (POST /v1/stores/{store_id}/stripe_onboarding) */
  createForStore(storeId: CreateStoreCardOnboardingData["path"]["store_id"], options?: PlainRequestOptions): Promise<CreateStoreCardOnboardingResponse> {
    return this.t.call<CreateStoreCardOnboardingResponse>(OPS.createStoreCardOnboarding, { path: { store_id: storeId } }, options);
  }

  /** Read your company's card readiness (GET /v1/stripe_status) */
  status(options?: PlainRequestOptions): Promise<GetCardStatusResponse> {
    return this.t.call<GetCardStatusResponse>(OPS.getCardStatus, {  }, options);
  }

  /** Read a store's card readiness (GET /v1/stores/{store_id}/stripe_status) */
  statusForStore(storeId: GetStoreCardStatusData["path"]["store_id"], options?: PlainRequestOptions): Promise<GetStoreCardStatusResponse> {
    return this.t.call<GetStoreCardStatusResponse>(OPS.getStoreCardStatus, { path: { store_id: storeId } }, options);
  }
}

export class ConnectRequestsResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Ask a restaurant to connect its account (POST /v1/connect_requests) */
  create(body: CreateConnectRequestData["body"], options?: PlainRequestOptions): Promise<CreateConnectRequestResponse> {
    return this.t.call<CreateConnectRequestResponse>(OPS.createConnectRequest, { body }, options);
  }
}

export class ConnectionsResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Exchange an approval for the store (POST /v1/connections) */
  create(body: CreateConnectionData["body"], options?: PlainRequestOptions): Promise<CreateConnectionResponse> {
    return this.t.call<CreateConnectionResponse>(OPS.createConnection, { body }, options);
  }
}

export class DeliveriesResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Cancel a delivery (POST /v1/deliveries/{delivery_id}/cancellations) */
  cancel(deliveryId: CancelDeliveryData["path"]["delivery_id"], body: CancelDeliveryData["body"], options?: PlainRequestOptions): Promise<CancelDeliveryResponse> {
    return this.t.call<CancelDeliveryResponse>(OPS.cancelDelivery, { path: { delivery_id: deliveryId }, body }, options);
  }

  /** Create a delivery (POST /v1/deliveries) */
  create(body: CreateDeliveryData["body"], options?: RequestOptions): Promise<CreateDeliveryResponse> {
    return this.t.call<CreateDeliveryResponse>(OPS.createDelivery, { body }, options);
  }

  /** List deliveries (GET /v1/deliveries) */
  list(query?: ListDeliveriesData["query"], options?: PlainRequestOptions): Promise<ListDeliveriesResponse> {
    return this.t.call<ListDeliveriesResponse>(OPS.listDeliveries, { query }, options);
  }

  /** Refund a delivery (POST /v1/deliveries/{delivery_id}/refunds) */
  refund(deliveryId: RefundDeliveryData["path"]["delivery_id"], body?: RefundDeliveryData["body"], options?: RequestOptions): Promise<RefundDeliveryResponse> {
    return this.t.call<RefundDeliveryResponse>(OPS.refundDelivery, { path: { delivery_id: deliveryId }, body }, options);
  }

  /** Update a delivery (PATCH /v1/deliveries/{id}) */
  reschedule(id: RescheduleDeliveryData["path"]["id"], body: RescheduleDeliveryData["body"], options?: PlainRequestOptions): Promise<RescheduleDeliveryResponse> {
    return this.t.call<RescheduleDeliveryResponse>(OPS.rescheduleDelivery, { path: { id: id }, body }, options);
  }

  /** Fetch a delivery (GET /v1/deliveries/{id}) */
  retrieve(id: GetDeliveryData["path"]["id"], options?: PlainRequestOptions): Promise<GetDeliveryResponse> {
    return this.t.call<GetDeliveryResponse>(OPS.getDelivery, { path: { id: id } }, options);
  }

  /** Retry a failed dispatch (POST /v1/deliveries/{delivery_id}/retries) */
  retry(deliveryId: RetryDeliveryData["path"]["delivery_id"], options?: PlainRequestOptions): Promise<RetryDeliveryResponse> {
    return this.t.call<RetryDeliveryResponse>(OPS.retryDelivery, { path: { delivery_id: deliveryId } }, options);
  }
}

export class EventsResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** List your webhook events (GET /v1/events) */
  list(query?: ListEventsData["query"], options?: PlainRequestOptions): Promise<ListEventsResponse> {
    return this.t.call<ListEventsResponse>(OPS.listEvents, { query }, options);
  }

  /** Send a webhook event again (POST /v1/events/{event_id}/resend) */
  resend(eventId: ResendEventData["path"]["event_id"], options?: PlainRequestOptions): Promise<ResendEventResponse> {
    return this.t.call<ResendEventResponse>(OPS.resendEvent, { path: { event_id: eventId } }, options);
  }

  /** Retrieve a webhook event (GET /v1/events/{id}) */
  retrieve(id: GetEventData["path"]["id"], options?: PlainRequestOptions): Promise<GetEventResponse> {
    return this.t.call<GetEventResponse>(OPS.getEvent, { path: { id: id } }, options);
  }
}

export class LedgerResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** List your ledger entries (GET /v1/ledger) */
  list(query?: ListLedgerEntriesData["query"], options?: PlainRequestOptions): Promise<ListLedgerEntriesResponse> {
    return this.t.call<ListLedgerEntriesResponse>(OPS.listLedgerEntries, { query }, options);
  }

  /** List a store's ledger entries (GET /v1/stores/{store_id}/ledger) */
  listForStore(storeId: ListStoreLedgerEntriesData["path"]["store_id"], query?: ListStoreLedgerEntriesData["query"], options?: PlainRequestOptions): Promise<ListStoreLedgerEntriesResponse> {
    return this.t.call<ListStoreLedgerEntriesResponse>(OPS.listStoreLedgerEntries, { path: { store_id: storeId }, query }, options);
  }
}

export class QuotesResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Price a delivery (POST /v1/quotes) */
  create(body: CreateQuoteData["body"], options?: PlainRequestOptions): Promise<CreateQuoteResponse> {
    return this.t.call<CreateQuoteResponse>(OPS.createQuote, { body }, options);
  }
}

export class RequestLogsResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** List your request log (GET /v1/request_logs) */
  list(query?: ListRequestLogsData["query"], options?: PlainRequestOptions): Promise<ListRequestLogsResponse> {
    return this.t.call<ListRequestLogsResponse>(OPS.listRequestLogs, { query }, options);
  }

  /** Retrieve a request log entry (GET /v1/request_logs/{id}) */
  retrieve(id: GetRequestLogData["path"]["id"], options?: PlainRequestOptions): Promise<GetRequestLogResponse> {
    return this.t.call<GetRequestLogResponse>(OPS.getRequestLog, { path: { id: id } }, options);
  }
}

export class StoresResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Cancel a store's plan (POST /v1/stores/{store_id}/plan_cancellation) */
  cancelPlan(storeId: CancelStorePlanData["path"]["store_id"], options?: RequestOptions): Promise<CancelStorePlanResponse> {
    return this.t.call<CancelStorePlanResponse>(OPS.cancelStorePlan, { path: { store_id: storeId } }, options);
  }

  /** Create a store (POST /v1/stores) */
  create(body: CreateStoreData["body"], options?: RequestOptions): Promise<CreateStoreResponse> {
    return this.t.call<CreateStoreResponse>(OPS.createStore, { body }, options);
  }

  /** Invite a store owner (POST /v1/stores/{store_id}/owner) */
  createOwner(storeId: CreateStoreOwnerData["path"]["store_id"], body: CreateStoreOwnerData["body"], options?: PlainRequestOptions): Promise<CreateStoreOwnerResponse> {
    return this.t.call<CreateStoreOwnerResponse>(OPS.createStoreOwner, { path: { store_id: storeId }, body }, options);
  }

  /** List your stores (GET /v1/stores) */
  list(query?: ListStoresData["query"], options?: PlainRequestOptions): Promise<ListStoresResponse> {
    return this.t.call<ListStoresResponse>(OPS.listStores, { query }, options);
  }

  /** Reactivate a store's plan (POST /v1/stores/{store_id}/plan) */
  reactivatePlan(storeId: ReactivateStorePlanData["path"]["store_id"], options?: RequestOptions): Promise<ReactivateStorePlanResponse> {
    return this.t.call<ReactivateStorePlanResponse>(OPS.reactivateStorePlan, { path: { store_id: storeId } }, options);
  }

  /** Fetch a store (GET /v1/stores/{id}) */
  retrieve(id: GetStoreData["path"]["id"], options?: PlainRequestOptions): Promise<GetStoreResponse> {
    return this.t.call<GetStoreResponse>(OPS.getStore, { path: { id: id } }, options);
  }

  /** Undo a store's plan cancellation (DELETE /v1/stores/{store_id}/plan_cancellation) */
  undoPlanCancellation(storeId: UndoStorePlanCancellationData["path"]["store_id"], options?: PlainRequestOptions): Promise<UndoStorePlanCancellationResponse> {
    return this.t.call<UndoStorePlanCancellationResponse>(OPS.undoStorePlanCancellation, { path: { store_id: storeId } }, options);
  }

  /** Update a store (PATCH /v1/stores/{id}) */
  update(id: UpdateStoreData["path"]["id"], body?: UpdateStoreData["body"], options?: PlainRequestOptions): Promise<UpdateStoreResponse> {
    return this.t.call<UpdateStoreResponse>(OPS.updateStore, { path: { id: id }, body }, options);
  }
}

export class WebhooksResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** List webhook delivery attempts (GET /v1/webhook_deliveries) */
  listDeliveries(query?: ListWebhookDeliveriesData["query"], options?: PlainRequestOptions): Promise<ListWebhookDeliveriesResponse> {
    return this.t.call<ListWebhookDeliveriesResponse>(OPS.listWebhookDeliveries, { query }, options);
  }

  /** Send a test webhook (POST /v1/test_webhooks) */
  sendTest(body: SendTestWebhookData["body"], options?: PlainRequestOptions): Promise<SendTestWebhookResponse> {
    return this.t.call<SendTestWebhookResponse>(OPS.sendTestWebhook, { body }, options);
  }
}

export class WithdrawalsResource {
  private readonly t: Transport;

  constructor(t: Transport) {
    this.t = t;
  }

  /** Request a withdrawal (POST /v1/withdrawals) */
  create(body: CreateWithdrawalData["body"], options?: PlainRequestOptions): Promise<CreateWithdrawalResponse> {
    return this.t.call<CreateWithdrawalResponse>(OPS.createWithdrawal, { body }, options);
  }

  /** List your withdrawals (GET /v1/withdrawals) */
  list(query?: ListWithdrawalsData["query"], options?: PlainRequestOptions): Promise<ListWithdrawalsResponse> {
    return this.t.call<ListWithdrawalsResponse>(OPS.listWithdrawals, { query }, options);
  }

  /** Fetch a withdrawal (GET /v1/withdrawals/{id}) */
  retrieve(id: GetWithdrawalData["path"]["id"], options?: PlainRequestOptions): Promise<GetWithdrawalResponse> {
    return this.t.call<GetWithdrawalResponse>(OPS.getWithdrawal, { path: { id: id } }, options);
  }
}

/** The resources as properties, so a subclass can say what it replaces. */
export interface ResourceMap {
  balance: BalanceResource;
  cardOnboarding: CardOnboardingResource;
  connectRequests: ConnectRequestsResource;
  connections: ConnectionsResource;
  deliveries: DeliveriesResource;
  events: EventsResource;
  ledger: LedgerResource;
  quotes: QuotesResource;
  requestLogs: RequestLogsResource;
  stores: StoresResource;
  webhooks: WebhooksResource;
  withdrawals: WithdrawalsResource;
}

/** The client's resources and its own calls. `Listo` extends this. */
export class Resources {
  readonly balance: BalanceResource;
  readonly cardOnboarding: CardOnboardingResource;
  readonly connectRequests: ConnectRequestsResource;
  readonly connections: ConnectionsResource;
  readonly deliveries: DeliveriesResource;
  readonly events: EventsResource;
  readonly ledger: LedgerResource;
  readonly quotes: QuotesResource;
  readonly requestLogs: RequestLogsResource;
  readonly stores: StoresResource;
  readonly webhooks: WebhooksResource;
  readonly withdrawals: WithdrawalsResource;
  private readonly t: Transport;

  constructor(t: Transport, replacements: Partial<ResourceMap> = {}) {
    this.t = t;
    this.balance = replacements.balance ?? new BalanceResource(t);
    this.cardOnboarding = replacements.cardOnboarding ?? new CardOnboardingResource(t);
    this.connectRequests = replacements.connectRequests ?? new ConnectRequestsResource(t);
    this.connections = replacements.connections ?? new ConnectionsResource(t);
    this.deliveries = replacements.deliveries ?? new DeliveriesResource(t);
    this.events = replacements.events ?? new EventsResource(t);
    this.ledger = replacements.ledger ?? new LedgerResource(t);
    this.quotes = replacements.quotes ?? new QuotesResource(t);
    this.requestLogs = replacements.requestLogs ?? new RequestLogsResource(t);
    this.stores = replacements.stores ?? new StoresResource(t);
    this.webhooks = replacements.webhooks ?? new WebhooksResource(t);
    this.withdrawals = replacements.withdrawals ?? new WithdrawalsResource(t);
  }

  /** Check that your API key works (GET /v1/ping) */
  ping(options?: PlainRequestOptions): Promise<PingResponse> {
    return this.t.call<PingResponse>(OPS.ping, {  }, options);
  }
}
