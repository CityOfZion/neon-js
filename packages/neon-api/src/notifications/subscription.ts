import { logging } from "@cityofzion/neon-core";
const log = logging.default("api");

export class Subscription {
  private contract: string | null;
  private unsubscribeFunction: () => void;

  public get name(): string {
    return `Subscription[${this.contract}]`;
  }

  public constructor(contract: string | null, unsubscribeFunction: () => void) {
    this.contract = contract;
    this.unsubscribeFunction = unsubscribeFunction;
    log.info(`Created Subscription: ${this.contract}`);
  }

  /**
   * Unsubscribe a specific function from a contract
   */
  public unsubscribe(): void {
    this.unsubscribeFunction();
  }
}

export default Subscription;
