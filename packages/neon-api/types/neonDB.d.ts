import { wallet } from "@cityofzion/neon-core";

export interface NeonDbNode {
  block_height: number | null;
  status: boolean;
  time: number | null;
  url: string;
}

export interface NeonDbBalance {
  GAS: wallet.AssetBalance;
  NEO: wallet.AssetBalance;
  address: string;
  net: string;
}

export interface NeonDbClaims {
  address: string;
  net: string;
  total_claim: number;
  total_unspent_claim: number;
  claims: wallet.ClaimItemLike[];
}

export interface NeonDbHistory {
  address: string;
  history: {
    GAS: number;
    NEO: number;
    block_index: number;
    gas_sent: boolean;
    neo_sent: boolean;
    txid: string;
  }[];
  name: string;
  net: string;
}
