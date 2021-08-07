/**
 * Interfaces of common objects used in the blockchain but is not implemented in the SDK.
 */

export interface BlockHeaderJson {
  hash: string;
  size: number;
  version: number;
  previousblockhash: string;
  merkleroot: string;
  time: number;

  /** Random hexstring used for uniqueness. */
  nonce: string;
  index: number;
  nextconsensus: string;
  witnesses: import("./tx/components/Witness").WitnessJson[];
  confirmations: number;
  nextblockhash: string;
}

export interface BlockJson extends BlockHeaderJson {
  primary: number;
  tx: import("./tx/transaction").TransactionJson[];
}

export interface Validator {
  publickey: string;
  /** Stringified number */
  votes: string;
  active: boolean;
}
