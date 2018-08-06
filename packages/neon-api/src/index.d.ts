import neonCore, { wallet, u } from "@cityofzion/neon-core";
import * as plugin from "./plugin";
import { Provider, PastTransaction } from "./provider/common";

declare interface ProviderInterface {
  instance: Provider;
  getRPCEndpoint(url: string, noCache?: boolean): Promise<string>;
  getBalance(url: string, address: string): Promise<wallet.Balance>;
  getClaims(url: string, address: string): Promise<wallet.Claims>;
  getMaxClaimAmount(url: string, address: string): Promise<u.Fixed8>;
  getHeight(url: string): Promise<number>;
  getTransactionHistory(
    url: string,
    address: string
  ): Promise<PastTransaction[]>;
}

declare module "@cityofzion/neon-core" {
  interface api {
    neoscan: ProviderInterface;
    neonDB: ProviderInterface;
  }
}
