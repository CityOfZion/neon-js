import { CONST, logging, u, wallet } from "@cityofzion/neon-core";
import * as internal from "../../settings";
import axios from "axios";
import {
  filterHttpsOnly,
  findGoodNodesFromHeight,
  getBestUrl,
  PastTransaction,
  RpcNode
} from "../common";
import {
  NeoscanBalance,
  NeoscanClaim,
  NeoscanPastTx,
  NeoscanTx,
  NeoscanV1GetBalanceResponse,
  NeoscanV1GetClaimableResponse,
  NeoscanV1GetHeightResponse,
  NeoscanV1GetUnclaimedResponse
} from "./responses";
const log = logging.default("api");

function getChange(
  vin: { asset: string; value: number }[],
  vout: { asset: string; value: number }[],
  assetId: string
): u.Fixed8 {
  const totalOut = vin
    .filter(i => i.asset === assetId)
    .reduce((p, c) => p.add(c.value), new u.Fixed8(0));
  const totalIn = vout
    .filter(i => i.asset === assetId)
    .reduce((p, c) => p.add(c.value), new u.Fixed8(0));

  return totalIn.minus(totalOut);
}

function parseTxHistory(
  rawTxs: NeoscanPastTx[],
  address: string
): PastTransaction[] {
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

/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param url - URL of a neoscan service.
 * @returns URL of a good RPC endpoint.
 */
export async function getRPCEndpoint(url: string): Promise<string> {
  const response = await axios.get(url + "/v1/get_all_nodes");
  let nodes = response.data as RpcNode[];
  if (internal.settings.httpsOnly) {
    nodes = filterHttpsOnly(nodes);
  }
  const goodNodes = findGoodNodesFromHeight(nodes);
  const bestRPC = await getBestUrl(goodNodes);
  return bestRPC;
}

/**
 * Get the current height of the light wallet DB
 * @param url - URL of a neoscan service.
 * @return  Current height as reported by provider
 */
export async function getHeight(url: string): Promise<number> {
  const response = await axios.get(url + "/v1/get_height");
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
  url: string,
  address: string
): Promise<PastTransaction[]> {
  const response = await axios.get(
    url + "/v1/get_last_transactions_by_address/" + address
  );
  const data = response.data as NeoscanPastTx[];
  log.info(`Retrieved History for ${address} from neoscan ${url}`);
  return parseTxHistory(response.data, address);
}
