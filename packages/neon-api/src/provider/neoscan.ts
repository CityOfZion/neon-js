import {
  CONST,
  logging,
  rpc,
  settings,
  u,
  wallet
} from "@cityofzion/neon-core";
import axios from "axios";
import {
  filterHttpsOnly,
  findGoodNodesFromHeight,
  getBestUrl,
  isCachedRPCAcceptable,
  PastTransaction,
  RpcNode
} from "./common";
const log = logging.default("api");
export const name = "neoscan";

let cachedUrl = "";
/**
 * Returns the appropriate NeoScan endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 */
export function getAPIEndpoint(net: string): string {
  if (settings.networks[net]) {
    const url = settings.networks[net].extra.neoscan;
    if (!url) {
      throw new Error(`No neonDB url found for ${net}`);
    }
    return url;
  }
  return net;
}

/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @returns URL of a good RPC endpoint.
 */
export async function getRPCEndpoint(net: string): Promise<string> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(apiEndpoint + "/v1/get_all_nodes");
  let nodes = response.data as RpcNode[];
  if (settings.httpsOnly) {
    nodes = filterHttpsOnly(nodes);
  }
  const goodNodes = findGoodNodesFromHeight(nodes);
  if (cachedUrl) {
    const useCachedUrl = isCachedRPCAcceptable(cachedUrl, goodNodes);
    if (useCachedUrl) {
      return cachedUrl;
    }
  }
  const bestRPC = await getBestUrl(goodNodes);
  cachedUrl = bestRPC;
  return bestRPC;
}

/**
 * Gets balance for an address. Returns an empty Balance if endpoint returns not found.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return Balance of address retrieved from endpoint.
 */
export async function getBalance(
  net: string,
  address: string
): Promise<wallet.Balance> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(apiEndpoint + "/v1/get_balance/" + address);
  const data = response.data as NeoscanV1GetBalanceResponse;
  if (data.address === "not found" && data.balance === null) {
    return new wallet.Balance({
      net,
      address
    } as wallet.BalanceLike);
  }
  const bal = new wallet.Balance({
    net,
    address: data.address
  } as wallet.BalanceLike);
  const neoscanBalances = data.balance as NeoscanBalance[];
  for (const b of neoscanBalances) {
    if (b.amount > 0 && b.unspent.length > 0) {
      bal.addAsset(b.asset, {
        balance: b.amount,
        unspent: parseUnspent(b.unspent)
      } as wallet.AssetBalance);
    } else {
      bal.addToken(b.asset, b.amount);
    }
  }
  log.info(`Retrieved Balance for ${address} from neoscan ${net}`);
  return bal;
}

function parseUnspent(unspentArr: NeoscanTx[]) {
  return unspentArr.map(coin => {
    return {
      index: coin.n,
      txid: coin.txid,
      value: coin.value
    };
  });
}

/**
 * Get claimable amounts for an address. Returns an empty Claims if endpoint returns not found.
 * @param net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address - Address to check.
 * @return Claims retrieved from endpoint.
 */
export async function getClaims(net: string, address: string) {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v1/get_claimable/" + address
  );
  const data = response.data as NeoscanV1GetClaimableResponse;
  if (data.address === "not found" && data.claimable === null) {
    return new wallet.Claims({ address: data.address });
  }
  const claims = parseClaims(data.claimable as NeoscanClaim[]);
  log.info(`Retrieved Balance for ${address} from neoscan ${net}`);
  return new wallet.Claims({
    net,
    address: data.address,
    claims
  } as wallet.ClaimsLike);
}

function parseClaims(claimArr: NeoscanClaim[]): wallet.ClaimItemLike[] {
  return claimArr.map(c => {
    return {
      start: c.start_height,
      end: c.end_height,
      index: c.n,
      claim: c.unclaimed,
      txid: c.txid,
      value: c.value
    };
  });
}

/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return
 */
export async function getMaxClaimAmount(
  net: string,
  address: string
): Promise<u.Fixed8> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v1/get_unclaimed/" + address
  );
  const data = response.data as NeoscanV1GetUnclaimedResponse;
  log.info(
    `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neoscan ${net}`
  );
  return new u.Fixed8(data.unclaimed || 0);
}

/**
 * Get the current height of the light wallet DB
 * @param net 'MainNet' or 'TestNet'.
 * @return  Current height as reported by provider
 */
export async function getHeight(net: string): Promise<number> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(apiEndpoint + "/v1/get_height");
  const data = response.data as NeoscanV1GetHeightResponse;
  return data.height;
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} A listof PastTransactionPastTransaction[]
 */
export async function getTransactionHistory(
  net: string,
  address: string
): Promise<PastTransaction[]> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v1/get_last_transactions_by_address/" + address
  );
  const data = response.data as NeoscanPastTx[];
  log.info(`Retrieved History for ${address} from neoscan ${net}`);
  return parseTxHistory(response.data, address);
}

function parseTxHistory(rawTxs: NeoscanPastTx[], address: string) {
  return rawTxs.map(tx => {
    const vin = tx.vin
      .filter(i => i.address_hash === address)
      .map(i => ({ asset: i.asset, value: i.value }));
    const vout = tx.vouts
      .filter(o => o.address_hash === address)
      .map(i => ({ asset: i.asset, value: i.value }));
    const change = {
      NEO: getChange(vin, vout, CONST.ASSET_ID.NEO),
      GAS: getChange(vin, vout, CONST.ASSET_ID.GAS)
    };
    return {
      txid: tx.txid,
      blockHeight: tx.block_height,
      change
    };
  });
}

function getChange(
  vin: Array<{ asset: string; value: number }>,
  vout: Array<{ asset: string; value: number }>,
  assetId: string
) {
  const totalOut = vin
    .filter(i => i.asset === assetId)
    .reduce((p, c) => p.add(c.value), new u.Fixed8(0));
  const totalIn = vout
    .filter(i => i.asset === assetId)
    .reduce((p, c) => p.add(c.value), new u.Fixed8(0));

  return totalIn.minus(totalOut);
}
