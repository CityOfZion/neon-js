import { CONST, logging, rpc, u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
import {
  NeoCliClaimable,
  NeoCliGetClaimableResponse,
  NeoCliGetUnclaimedResponse,
  NeoCliGetUnspentsResponse,
  NeoCliTx
} from "./responses";
const log = logging.default("api");

const BASE_REQ = CONST.DEFAULT_REQ;

function throwRpcError(err: rpc.RPCErrorResponse): void {
  throw new Error(`Encounter error code ${err.code}: ${err.message}`);
}

export function getRPCEndpoint(url: string): string {
  return url;
}

function convertNeoCliTx(tx: NeoCliTx): wallet.CoinLike {
  return { index: tx.n, txid: tx.txid, value: tx.value };
}

function convertNeoCliClaimable(c: NeoCliClaimable): wallet.ClaimItemLike {
  return {
    claim: c.unclaimed,
    txid: c.txid,
    index: c.n,
    value: c.value,
    start: c.start_height,
    end: c.end_height
  };
}

/**
 * Get balances of NEO and GAS for an address
 * @param url - URL of a neonDB service.
 * @param address - Address to check.
 * @return  Balance of address
 */
export async function getBalance(
  url: string,
  address: string
): Promise<wallet.Balance> {
  const response = await axios.post(
    url,
    Object.assign({}, BASE_REQ, { method: "getunspents", params: [address] })
  );
  const data = response.data as NeoCliGetUnspentsResponse;
  if (data.error) {
    throwRpcError(data.error);
  }
  const bal = new wallet.Balance({
    net: url,
    address: data.result.address
  });
  for (const assetBalance of data.result.balance) {
    if (assetBalance.amount === 0) {
      continue;
    }
    if (assetBalance.unspent.length > 0) {
      bal.addAsset(assetBalance.asset_symbol, {
        unspent: assetBalance.unspent.map(convertNeoCliTx)
      });
    } else {
      bal.addToken(assetBalance.asset_symbol, assetBalance.amount);
    }
  }
  log.info(`Retrieved Balance for ${address} from neonDB ${url}`);
  return bal;
}

export async function getClaims(
  url: string,
  address: string
): Promise<wallet.Claims> {
  const response = await axios.post(
    url,
    Object.assign({}, BASE_REQ, { method: "getclaimable", params: [address] })
  );
  const data = response.data as NeoCliGetClaimableResponse;
  if (data.error) {
    throwRpcError(data.error);
  }
  return new wallet.Claims({
    net: url,
    address: data.result.address,
    claims: data.result.claimable.map(convertNeoCliClaimable)
  });
}

export async function getMaxClaimAmount(
  url: string,
  address: string
): Promise<u.Fixed8> {
  const response = await axios.post(
    url,
    Object.assign({}, BASE_REQ, { method: "getunclaimed", params: [address] })
  );
  const data = response.data as NeoCliGetUnclaimedResponse;
  if (data.error) {
    throwRpcError(data.error);
  }
  return new u.Fixed8(data.result.unclaimed).div(100000000);
}
