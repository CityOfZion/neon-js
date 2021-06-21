import { rpc } from "@cityofzion/neon-core";

export interface NeoCliGetUnspentsResponse extends rpc.RPCResponse {
  result: {
    balance: NeoCliBalance[];
    address: string;
  };
}

export interface NeoCliBalance {
  unspent: NeoCliTx[];
  asset_hash: string;
  asset: string;
  asset_symbol: string;
  amount: number;
}
export interface NeoCliTx {
  txid: string;
  value: number;
  n: number;
}

export interface NeoCliGetUnclaimedResponse extends rpc.RPCResponse {
  result: {
    available: number;
    unavailable: number;
    unclaimed: number;
  };
}

export interface NeoCliGetClaimableResponse extends rpc.RPCResponse {
  result: {
    address: string;
    claimable: NeoCliClaimable[];
    unclaimed: number;
  };
}

export interface NeoCliClaimable {
  end_height: number;
  generated: number;
  n: number;
  start_height: number;
  sys_fee: number;
  txid: string;
  unclaimed: number;
  value: number;
}
