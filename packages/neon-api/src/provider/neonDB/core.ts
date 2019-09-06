import { logging, u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
import { settings as internalSettings } from "../../settings";
import {
  filterHttpsOnly,
  findGoodNodesFromHeight,
  getBestUrl,
  PastTransaction,
  RpcNode
} from "../common";
import { NeonDbHistory, NeonDbNode } from "./responses";
const log = logging.default("api");

/**
 * Returns an appropriate RPC endpoint retrieved from a neonDB endpoint.
 * @param url - URL of a neonDB service.
 * @returns URL of a good RPC endpoint.
 */
export async function getRPCEndpoint(url: string): Promise<string> {
  const response = await axios.get(url + "/v2/network/nodes");
  const data = response.data.nodes as NeonDbNode[];
  let nodes = data
    .filter(d => d.status)
    .map(d => ({ height: d.block_height, url: d.url } as RpcNode));

  if (internalSettings.httpsOnly) {
    nodes = filterHttpsOnly(nodes);
  }
  const goodNodes = findGoodNodesFromHeight(nodes);
  const bestRPC = await getBestUrl(goodNodes);
  return bestRPC;
}

/**
 * Get transaction history for an account
 * @param url - URL of a neonDB service.
 * @param address - Address to check.
 * @return a list of PastTransaction
 */
export async function getTransactionHistory(
  url: string,
  address: string
): Promise<PastTransaction[]> {
  const response = await axios.get(url + "/v2/address/history/" + address);
  const data = response.data as NeonDbHistory;
  log.info(`Retrieved History for ${address} from neonDB ${url}`);
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
 * @param url - URL of a neonDB service.
 * @return Current height.
 */
export async function getHeight(url: string): Promise<number> {
  const response = await axios.get(url + "/v2/block/height");
  return parseInt(response.data.block_height, 10);
}
