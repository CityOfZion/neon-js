import { logging, settings } from "@cityofzion/neon-core";
import WebSocket from "isomorphic-ws";
import { NotificationMessage, CallbackFunction } from "./responses";
import Subscription from "./subscription";
const log = logging.default("api");

interface ContractSubscriptions {
  websocket: WebSocket;
  callbacks: Map<number, CallbackFunction>;
}

export class Notifications {
  private url: string;
  private uniqueIdentifier: number;

  public get name(): string {
    return `Notifications[${this.url}]`;
  }

  private subscriptions: Map<string | null, ContractSubscriptions>;

  /**
   * Create a new notification service that handles contract subscriptions
   * Source code and instructions on how to run this service are available on https://github.com/corollari/neo-PubSub
   * @param url - URL of a notifications service.
   */
  public constructor(url: string) {
    this.uniqueIdentifier = 0;
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
    contract = this.normalizeContract(contract);
    const subscriptionIdentifier = this.uniqueIdentifier++;
    const contractSubscriptions =
      this.subscriptions.get(contract) ??
      this.createWebsocketForContract(contract);
    contractSubscriptions.callbacks.set(subscriptionIdentifier, callback);
    const unsubscribe = (): void => {
      const callbacksMaps = this.subscriptions.get(contract)?.callbacks;
      if (!callbacksMaps?.get(subscriptionIdentifier)) {
        // Check if the subscription hasn't been killed before
        return;
      }
      if (callbacksMaps.size > 1) {
        callbacksMaps.delete(subscriptionIdentifier);
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
  public unsubscribeContract(contract: string | null): Promise<void> {
    contract = this.normalizeContract(contract);
    const subscriptionObj = this.subscriptions.get(contract);
    if (
      !subscriptionObj ||
      subscriptionObj.websocket.readyState >= WebSocket.CLOSING
    ) {
      return Promise.resolve(); // Not throwing an exception in order to allow unlimited calling of this function
    }

    const closingPromise: Promise<void> = new Promise((resolve) => {
      subscriptionObj.websocket.onclose = () => {
        this.subscriptions.delete(contract);
        resolve();
      };
      subscriptionObj.websocket.close();
    });

    const terminatePromise = new Promise((resolve) =>
      setTimeout(resolve, 5000)
    ).then(() => {
      if (subscriptionObj.websocket.readyState != WebSocket.CLOSED) {
        log.warn(
          `Websocket for Subscription[${contract}] did not close in time (was in state ${subscriptionObj.websocket.readyState}). Force terminating.`
        );
        subscriptionObj.websocket.terminate();
      }
    });
    return Promise.race([closingPromise, terminatePromise]);
  }

  /**
   * Unsubscribe all subscriptions (equivalent to calling unsubscribeContract() once for every contract)
   */
  public unsubscribeAll(): Promise<void> {
    const closingPromises: Promise<void>[] = [];
    for (const contract of this.subscriptions.keys()) {
      closingPromises.push(this.unsubscribeContract(contract));
    }
    return Promise.all(closingPromises).then();
  }

  private createWebsocketForContract(
    contract: string | null
  ): ContractSubscriptions {
    const ws = new WebSocket(
      this.url + (contract !== null ? "?contract=" + contract : "")
    );
    ws.onmessage = (event: WebSocket.MessageEvent) => {
      const callbackArray = this.subscriptions.get(contract)?.callbacks ?? [];
      for (const cb of callbackArray.values()) {
        cb(JSON.parse(event.data as string) as NotificationMessage);
      }
    };
    const contractSubscriptions = {
      websocket: ws,
      callbacks: new Map<number, CallbackFunction>(),
    };
    this.subscriptions.set(contract, contractSubscriptions);
    return contractSubscriptions;
  }

  private normalizeContract(contract: string | null): string | null {
    if (contract === null) {
      return null;
    } else if (contract.slice(0, 2) === "0x") {
      return contract;
    } else {
      return "0x" + contract;
    }
  }
}

export default Notifications;
