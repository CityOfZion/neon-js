import { u, wallet } from "@cityofzion/neon-core";

declare interface PastTransaction {
  txid: string;
  blockHeight: u.Fixed8;
  change: { [assetSymbol: string]: u.Fixed8 };
}

declare interface Provider {
  getApiEndpoint(net: string): string;
  getRPCEndpoint(net: string): Promise<string>;
  getBalance(net: string, address: string): Promise<wallet.Balance>;
  getClaims(net: string, address: string): Promise<wallet.Claims>;
  getMaxClaimAmount(net: string, address: string): Promise<u.Fixed8>;
  getHeight(net: string): Promise<u.Fixed8>;
  getTransactionHistory(
    net: string,
    address: string
  ): Promise<PastTransaction[]>;
}
