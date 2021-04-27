import { wallet } from "@cityofzion/neon-core";
import { NeoCliBalance, NeoCliClaimable, NeoCliTx } from "./responses";

function transformTx(tx: NeoCliTx): wallet.CoinLike {
  return { index: tx.n, txid: tx.txid, value: tx.value };
}

function transformClaimable(c: NeoCliClaimable): wallet.ClaimItemLike {
  return {
    claim: c.unclaimed,
    txid: c.txid,
    index: c.n,
    value: c.value,
    start: c.start_height,
    end: c.end_height,
  };
}

export function transformBalance({
  net,
  balance,
  address,
}: {
  net: string;
  balance: NeoCliBalance[];
  address: string;
}): wallet.Balance {
  const bal = new wallet.Balance({
    net,
    address,
  });
  for (const assetBalance of balance) {
    if (assetBalance.amount === 0) {
      continue;
    }
    if (assetBalance.unspent.length > 0) {
      bal.addAsset(assetBalance.asset_symbol, {
        unspent: assetBalance.unspent.map(transformTx),
      });
    } else {
      bal.addToken(
        assetBalance.asset_symbol ?? assetBalance.asset,
        assetBalance.amount
      );
    }
  }

  return bal;
}

export function transformClaims({
  net,
  address,
  claims,
}: {
  net: string;
  address: string;
  claims: NeoCliClaimable[];
}): wallet.Claims {
  return new wallet.Claims({
    net,
    address,
    claims: claims.map(transformClaimable),
  });
}
