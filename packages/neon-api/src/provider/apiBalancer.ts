import { logging, u, wallet } from "@cityofzion/neon-core";
import { DataProvider, PastTransaction, Provider } from "./common";
const log = logging.default("api");

const maxPreference = 1;
const minPreference = 0;

export default class ApiBalancer implements Provider {
  public leftProvider: DataProvider;
  public rightProvider: DataProvider;

  public get name() {
    return `ApiBalancer[${this.leftProvider.name}][${this.rightProvider.name}]`;
  }

  // tslint:disable-next-line:variable-name
  private _preference: number = 0;
  public get preference() {
    return this._preference;
  }
  public set preference(val) {
    const newVal = Math.max(0, Math.min(1, val));
    if (newVal !== this._preference) {
      log.info(`Preference set to ${newVal}`);
    }
    this._preference = newVal;
  }

  // tslint:disable-next-line:variable-name
  private _frozen: boolean = false;
  public get frozen() {
    return this._frozen;
  }
  public set frozen(val) {
    if (this._frozen !== val) {
      val
        ? log.info(`ApiBalancer frozen at preference of ${this._preference}`)
        : log.info("ApiBalancer unfrozen");
    }
    this._frozen = val;
  }

  constructor(
    leftProvider: DataProvider,
    rightProvider: DataProvider,
    preference: number = 0,
    frozen = false
  ) {
    this.leftProvider = leftProvider;
    this.rightProvider = rightProvider;
    this.preference = preference;
    this.frozen = frozen;
  }

  public async getRPCEndpoint(net: string): Promise<string> {
    const f = async (p: DataProvider) => await p.getRPCEndpoint(net);
    return await this.loadBalance(f);
  }

  public async getBalance(
    net: string,
    address: string
  ): Promise<wallet.Balance> {
    const f = async (p: DataProvider) => await p.getBalance(net, address);
    return await this.loadBalance(f);
  }

  public async getClaims(net: string, address: string): Promise<wallet.Claims> {
    const f = async (p: DataProvider) => await p.getClaims(net, address);
    return await this.loadBalance(f);
  }

  public async getMaxClaimAmount(
    net: string,
    address: string
  ): Promise<u.Fixed8> {
    const f = async (p: DataProvider) =>
      await p.getMaxClaimAmount(net, address);
    return await this.loadBalance(f);
  }

  public async getHeight(net: string): Promise<number> {
    const f = async (p: DataProvider) => await p.getHeight(net);
    return await this.loadBalance(f);
  }

  public async getTransactionHistory(
    net: string,
    address: string
  ): Promise<PastTransaction[]> {
    const f = async (p: DataProvider) =>
      await p.getTransactionHistory(net, address);
    return await this.loadBalance(f);
  }

  /**
   * Load balances a API call according to the API switch. Selects the appropriate provider and sends the call towards it.
   * @param func - The API call to load balance function
   */
  private async loadBalance<T>(
    func: (provider: DataProvider) => T
  ): Promise<T> {
    const i = Math.random() > this._preference ? 0 : 1;
    const primary = i === 0 ? this.leftProvider : this.rightProvider;
    const primaryShift = i === 0;
    try {
      const result = await func(primary);
      i === 0 ? this.increaseLeftWeight() : this.increaseRightWeight();
      return result;
    } catch {
      const secondary = i === 0 ? this.rightProvider : this.leftProvider;
      i === 1 ? this.increaseLeftWeight() : this.increaseRightWeight();
      return await func(secondary);
    }
  }

  private increaseLeftWeight() {
    if (!this._frozen) {
      this.preference -= 0.2;
      log.info(
        `core API Switch increasing weight towards ${this.leftProvider.name}`
      );
    }
  }

  private increaseRightWeight() {
    if (!this._frozen) {
      this.preference += 0.2;
      log.info(
        `core API Switch increasing weight towards ${this.rightProvider.name}`
      );
    }
  }
}
