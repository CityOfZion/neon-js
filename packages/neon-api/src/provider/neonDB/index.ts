import { logging, settings, u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
import {
  filterHttpsOnly,
  findGoodNodesFromHeight,
  getBestUrl,
  httpsOnly,
  isCachedRPCAcceptable,
  PastTransaction,
  RpcNode
} from "../common";
import {
  NeonDbBalance,
  NeonDbClaims,
  NeonDbHistory,
  NeonDbNode
} from "./responses";
const log = logging.default("api");
export const name = "neonDB";

let cachedUrl = "";
/**
 * Returns the appropriate neonDB endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 * @return URL of API endpoint.
 */
export function getAPIEndpoint(net: string): string {
  if (settings.networks[net]) {
    const url = settings.networks[net].extra.neonDB;
    if (!url) {
      throw new Error(`No neonDB url found for ${net}`);
    }
    return url;
  }
  return net;
}

/**
 * Returns an appropriate RPC endpoint retrieved from a neonDB endpoint.
 * @param net 'MainNet', 'TestNet' or a custom neonDB-like url.
 * @returns URL of a good RPC endpoint.
 */
export async function getRPCEndpoint(net: string) {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(apiEndpoint + "/v2/network/nodes");
  const data = response.data.nodes as NeonDbNode[];
  let nodes = data
    .filter(d => d.status)
    .map(d => ({ height: d.block_height, url: d.url } as RpcNode));

  if (httpsOnly) {
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
 * Get balances of NEO and GAS for an address
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return  Balance of address
 */
export async function getBalance(
  net: string,
  address: string
): Promise<wallet.Balance> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v2/address/balance/" + address
  );
  const data = response.data as NeonDbBalance;
  const bal = new wallet.Balance({ net, address } as wallet.BalanceLike);
  if (data.NEO.balance > 0) {
    bal.addAsset("NEO", data.NEO);
  }
  if (data.GAS.balance > 0) {
    bal.addAsset("GAS", data.GAS);
  }
  log.info(`Retrieved Balance for ${address} from neonDB ${net}`);
  return bal;
}

/**
 * Get amounts of available (spent) and unavailable claims.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
export async function getClaims(
  net: string,
  address: string
): Promise<wallet.Claims> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v2/address/claims/" + address
  );
  const data = response.data as NeonDbClaims;
  const claims = data.claims.map(c => {
    return {
      claim: new u.Fixed8(c.claim || 0).div(100000000),
      index: c.index,
      txid: c.txid,
      start: c.start || 0,
      end: c.end || 0,
      value: c.value
    };
  });
  log.info(`Retrieved Claims for ${address} from neonDB ${net}`);
  return new wallet.Claims({ net, address, claims } as wallet.ClaimsLike);
}

/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
export async function getMaxClaimAmount(
  net: string,
  address: string
): Promise<u.Fixed8> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v2/address/claims/" + address
  );
  const data = response.data as NeonDbClaims;
  log.info(
    `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neonDB ${net}`
  );
  return new u.Fixed8(data.total_claim + data.total_unspent_claim).div(
    100000000
  );
}

/**
 * Get transaction history for an account
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return a list of PastTransaction
 */
export async function getTransactionHistory(
  net: string,
  address: string
): Promise<PastTransaction[]> {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v2/address/history/" + address
  );
  const data = response.data as NeonDbHistory;
  log.info(`Retrieved History for ${address} from neonDB ${net}`);
  return data.history.map(rawTx => {
    return {
      change: {
        NEO: new u.Fixed8(rawTx.NEO || 0),
        GAS: new u.Fixed8(rawTx.GAS || 0)
      },
      blockHeight: rawTx.block_index,
      txid: rawTx.txid
    };
  });
}

/**
 * Get the current height of the light wallet DB
 * @param net - 'MainNet' or 'TestNet'.
 * @return Current height.
 */
export const getHeight = (net: string): Promise<number> => {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + "/v2/block/height").then(response => {
    return parseInt(response.data.block_height, 10);
  });
};
