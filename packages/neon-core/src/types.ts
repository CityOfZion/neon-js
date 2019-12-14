/**
 * Interfaces of common objects used in the blockchain but is not implemented in the SDK.
 */

export interface BlockHeaderLike {
  hash: string;
  size: number;
  version: number;
  previousblockhash: string;
  merkleroot: string;
  time: number;
  index: number;
  nextconsensus: string;
  witnesses: import("./tx/components/Witness").WitnessLike[];
  confirmations: number;
  nextblockhash: string;
}

export interface BlockLike extends BlockHeaderLike {
  consensus_data: {
    nonce: string;
    primary: number;
  };
  tx: import("./tx/transaction").TransactionLike[];
}

export interface Validator {
  publickey: string;
  votes: string;
  active: boolean;
}
