import { logging } from "@cityofzion/neon-core";
const log = logging.default("api");

export class Subscription {
  private contract: string | null;
  private unsubscribeFunction: () => void;
  private alive: boolean;

  public get name(): string {
    return `Subscription[${this.contract}]`;
  }

  public constructor(contract: string | null, unsubscribeFunction: () => void) {
    this.contract = contract;
    this.unsubscribeFunction = unsubscribeFunction;
    this.alive = true;
    log.info(`Created Subscription: ${this.contract}`);
  }

  /**
   * Unsubscribe a specific function from a contract
   */
  public unsubscribe() {
    if (!this.alive) {
      return; // Not throwing an exception in order to allow unlimited calling of this function
    }
    this.alive = false;
    this.unsubscribeFunction();
  }
}

export default Subscription;
