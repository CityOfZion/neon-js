export interface AccountStateBalance {
  asset: string;
  value: number;
}
export interface AccountState {
  version: number;
  script_hash: string;
  frozen: boolean;
  votes: any[];
  balances: AccountStateBalance[];
}

export interface LocalizedName {
  lang: string;
  name: string;
}
export interface AssetState {
  version: number;
  id: string;
  type: string;
  name: LocalizedName[];
  amount: string;
  available: string;
  precision: number;
  owner: string;
  admin: string;
  issuer: string;
  expiration: number;
  frozen: boolean;
}

export interface RawVerboseAttribute {
  Usage: number;
  Data: string;
}

export interface RawVerboseVin {
  Txid: string;
  Vout: number;
}

export interface RawVerboseVOut {
  N: number;
  Asset: string;
  Value: string;
  Address: string;
}

export interface RawVerboseScript {
  Invocation: string;
  Verification: string;
}

/**
 * Detailed transaction returned from getrawtransaction RPC call when verbose is set to 1.
 */
export interface RawVerboseTransaction {
  Txid: string;
  Size: number;
  Type: string;
  Version: number;
  Attributes: RawVerboseAttribute[];
  Vin: RawVerboseVin[];
  Vout: RawVerboseVOut[];
  Sys_fee: string;
  Net_fee: string;
  Scripts: RawVerboseScript[];
  Blockhash: string;
  Confirmations: number;
  Blocktime: number;
}
