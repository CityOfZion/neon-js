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
  index: number;
  nextconsensus: string;
  witnesses: import("./tx/components/Witness").WitnessJson[];
  confirmations: number;
  nextblockhash: string;
}

export interface BlockJson extends BlockHeaderJson {
  consensus_data: {
    nonce: string;
    primary: number;
  };
  tx: import("./tx/transaction").TransactionJson[];
}

export interface Validator {
  publickey: string;
  votes: string;
  active: boolean;
}
