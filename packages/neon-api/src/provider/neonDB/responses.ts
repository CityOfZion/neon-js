export interface NeonDbNode {
  block_height: number | null;
  status: boolean;
  time: number | null;
  url: string;
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
