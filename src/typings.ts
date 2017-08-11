export type Network = "TestNet"
                    | "MainNet";
export type AssetName = "Neo"
                      | "Gas";
export type AssetID = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
                    | "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

export type BasicEncodingError = -1;
export type WIFVerifyFailError = -2;
export type Errors = BasicEncodingError | WIFVerifyFailError;

export interface InputData {
	amount : number,
	data : Uint8Array
};

export interface Account {
    privatekey: string,
    publickeyEncoded: string,
    publickeyHash: string,
    programHash: string,
    address: string
};

export interface Balance {
  Neo : AssetTransaction[],
  Gas : AssetTransaction[],
  unspent: {
    Neo : AssetTransaction[],
    Gas : AssetTransaction[],
  }
}

export interface CoinData {
  assetid: AssetID,
  list: AssetTransaction[],
  balance: AssetTransaction[],
  name: AssetName
}

export interface AssetTransaction {
  index: number,
  txid: string,
  value: string
}