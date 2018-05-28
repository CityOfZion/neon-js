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
  RpcCache,
  RpcNode
} from "./helper";
const log = logging.default("api");
export const name = "neonDB";

const rpcCache = new RpcCache();
/**
 * Returns the appropriate neonDB endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 * @return URL of API endpoint.
 */
export function getAPIEndpoint(net: string): string {
  if (settings.networks[net]) {
    return settings.networks[net].extra.neonDB;
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
  const data = response.data as NeonDbNode[];
  let nodes = data
    .filter(d => d.status)
    .map(d => ({ height: d.block_height, url: d.url } as RpcNode));

  if (settings.httpsOnly) {
    nodes = filterHttpsOnly(nodes);
  }
  const goodNodes = findGoodNodesFromHeight(nodes);
  if (goodNodes.length === 0) {
    throw new Error("No eligible nodes found!");
  }
  const urls = goodNodes.map(n => n.url);
  const bestRPC = rpcCache.findBestRPC(urls);
  return bestRPC;
}

/**
 * Get balances of NEO and GAS for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
export async function getBalance(net: string, address: string) {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(
    apiEndpoint + "/v2/address/balance/" + address
  );
  const data = response.data as NeonDBV2AddressBalanceResponse;
  const bal = new wallet.Balance({ net, address } as wallet.BalanceLike);
  bal.addAsset("NEO", data.NEO);
  bal.addAsset("GAS", data.GAS);
  log.info(`Retrieved Balance for ${address} from neonDB ${net}`);
  return bal;
}

/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An object with available and unavailable GAS amounts.
 */
export async function getClaims (net:string, address:string) {
  const apiEndpoint = getAPIEndpoint(net);
  const response = await axios.get(apiEndpoint + "/v2/address/claims/" + address);
  const data = response.data as neonDBV2AddressClaimsResponse;
  const claims = data.claims.map(c => {
    return {
      claim: new u.Fixed8(c.claim).div(100000000),
      index: c.index,
      txid: c.txid,
      start: new u.Fixed8(c.start),
      end: new u.Fixed8(c.end),
      value: c.value
    };
  });
  log.info(`Retrieved Claims for ${address} from neonDB ${net}`);
  return new wallet.Claims({net, address, claims} as wallet.ClaimsLike);

};

/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>} An object with available and unavailable GAS amounts.
 */
export const getMaxClaimAmount = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + "/v2/address/claims/" + address).then(res => {
    log.info(
      `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neonDB ${net}`
    );
    return new Fixed8(res.data.total_claim + res.data.total_unspent_claim).div(
      100000000
    );
  });
};

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} a list of PastTransaction
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net);
  return axios
    .get(apiEndpoint + "/v2/address/history/" + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from neonDB ${net}`);
      return response.data.history.map(rawTx => {
        return {
          change: {
            NEO: new Fixed8(rawTx.NEO || 0),
            GAS: new Fixed8(rawTx.GAS || 0)
          },
          blockHeight: new Fixed8(rawTx.block_index),
          txid: rawTx.txid
        };
      });
    });
};

/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeight = net => {
  const apiEndpoint = getAPIEndpoint(net);
  return axios.get(apiEndpoint + "/v2/block/height").then(response => {
    return parseInt(response.data.block_height);
  });
};
