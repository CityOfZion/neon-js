import { wallet } from "@cityofzion/neon-core";

declare interface NeonDbNode {
  block_height: number | null;
  status: boolean;
  time: number | null;
  url: string;
}

declare interface NeonDbBalance {
  GAS: wallet.AssetBalance;
  NEO: wallet.AssetBalance;
  address: string;
  net: string;
}

declare interface NeonDbClaims {
  address: string;
  net: string;
  total_claim: number;
  total_unspent_claim: number;
  claims: wallet.ClaimItemLike[];
}
