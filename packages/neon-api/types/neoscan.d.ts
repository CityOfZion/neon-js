declare interface NeoscanV1GetBalanceResponse {
  balance: NeoscanBalance[] | null;
  address: string;
}

declare interface NeoscanBalance {
  asset: string;
  amount: number;
  unspent: NeoscanTx[];
}

declare interface NeoscanTx {
  txid: string;
  value: number;
  n: number;
}

declare interface NeoscanV1GetClaimableResponse {
  unclaimed: number;
  claimable: NeoscanClaim[] | null;
  address: string;
}

declare interface NeoscanClaim {
  txid: string;
  n: number;
  value: number;
  unclaimed: number;
  start_height: number;
  end_height: number;
}

declare interface NeoscanV1GetUnclaimedResponse {
  unclaimed: number;
  address: string;
}

declare interface NeoscanV1GetHeightResponse {
  height: number;
}

declare interface NeoscanPastTx {
  vouts: [
    {
      value: number;
      transaction_id: number;
      asset: string;
      address_hash: string;
    }
  ];
  vin: [
    {
      value: number;
      txid: string;
      n: number;
      asset: string;
      address_hash: string;
    }
  ];
  type: string;
  txid: string;
  transfers: [
    {
      txid: string;
      time: number;
      contract: string;
      block_height: number;
      amount: number;
      address_to: string;
      address_from: string;
    }
  ];
  time: number;
  sys_fee: string;
  size: number;
  net_fee: string;
  id: number;
  claims: [
    {
      value: number;
      txid: string;
      n: number;
      asset: string;
      address_hash: string;
    }
  ];
  block_height: number;
  block_hash: string;
  asset: null;
}
