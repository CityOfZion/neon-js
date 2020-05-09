import { logging, settings } from "@cityofzion/neon-core";
import WebSocket from "isomorphic-ws";
import { NotificationMessage, CallbackFunction } from "./responses";
import Subscription from "./subscription";
const log = logging.default("api");

interface ContractSubscriptions {
  websocket: WebSocket;
  callbacks: CallbackFunction[];
}

export class Notifications {
  private url: string;

  public get name(): string {
    return `Notifications[${this.url}]`;
  }

  private subscriptions: Map<string | null, ContractSubscriptions>;

  /**
   * Create a new notification service that handles contract subscriptions
   * @param url - URL of a notifications service.
   */
  public constructor(url: string) {
    this.url = settings.networks[url]?.extra?.notifications ?? url;
    this.subscriptions = new Map<string | null, ContractSubscriptions>();
    log.info(`Created Notifications Provider: ${this.url}`);
  }

  /**
   * Subscribe to event notifications of a specific contract
   * @param contract - Hash of the contract (null for all contracts) to subscribe to
   * @param callback - Function to call when a notification is received.
   * @return Subscription object that can be used to cancel the subscription
   */
  public subscribe(
    contract: string | null,
    callback: CallbackFunction
  ): Subscription {
    const contractSubscriptions =
      this.subscriptions.get(contract) ??
      this.createWebsocketForContract(contract);
    contractSubscriptions.callbacks.push(callback);
    const unsubscribe = () => {
      if (!this.subscriptions.has(contract)) {
        // Needed because user might have called unsubscribeAll() before
        return;
      }
      const subscriptions = this.subscriptions.get(contract)!;
      const index = subscriptions.callbacks.indexOf(callback);
      if (index === -1) {
        // Could happen if unsubscribeAll() followed by subscribe() are called on the same contract
        return;
      }
      if (subscriptions.callbacks.length > 1) {
        subscriptions.callbacks.splice(index, 1);
      } else {
        this.unsubscribeContract(contract);
      }
    };
    return new Subscription(contract, unsubscribe);
  }

  /**
   * Unsubscribe all subscriptions associated with a specific contract
   * @param contract - Hash of the contract (or null for subscriptions to all contracts) to unsubscribe callbacks from
   */
  public unsubscribeContract(contract: string | null) {
    if (!this.subscriptions.has(contract)) {
      return; // Not throwing an exception in order to allow unlimited calling of this function
    }
    this.subscriptions.get(contract)!.websocket.close();
    this.subscriptions.delete(contract);
  }

  /**
   * Unsubscribe all subscriptions (equivalent to calling unsubscribeContract() once for every contract)
   */
  public unsubscribeAll() {
    for (const contract of this.subscriptions.keys()) {
      this.unsubscribeContract(contract);
    }
  }

  private createWebsocketForContract(
    contract: string | null
  ): ContractSubscriptions {
    const ws = new WebSocket(
      this.url + (contract !== null ? "?contract=" + contract : "")
    );
    ws.onmessage = (event: WebSocket.MessageEvent) => {
      for (const cb of this.subscriptions.get(contract)!.callbacks) {
        cb(JSON.parse(event.data as string) as NotificationMessage);
      }
    };
    const contractSubscriptions = {
      websocket: ws,
      callbacks: []
    };
    this.subscriptions.set(contract, contractSubscriptions);
    return contractSubscriptions;
  }
}

export default Notifications;
