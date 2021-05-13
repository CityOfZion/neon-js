import { ASSETS } from "../consts";
import { Query } from "../rpc";
import { Transaction } from "../tx";
import { BaseTransaction } from "../tx/transaction/BaseTransaction";
import Fixed8 from "../u/Fixed8";
import AssetBalance, { AssetBalanceLike } from "./components/AssetBalance";
import Coin from "./components/Coin";

export interface BalanceLike {
  address: string;
  net: string;
  assetSymbols: string[];
  assets: { [sym: string]: Partial<AssetBalanceLike> };
  tokenSymbols: string[];
  tokens: { [sym: string]: number | string | Fixed8 };
}

async function verifyCoin(url: string, c: Coin): Promise<boolean> {
  const response = await Query.getTxOut(c.txid, c.index).execute(url);
  if (!response.result) {
    return false;
  }
  return c.index === response.result.n && c.value.equals(response.result.value);
}

/**
 * Verifies a list of Coins
 * @param url RPC Node to verify against.
 * @param coinArr Coins to verify.
 */
async function verifyCoins(url: string, coinArr: Coin[]): Promise<boolean[]> {
  const promises = coinArr.map((c) => verifyCoin(url, c));
  return await Promise.all(promises);
}

/**
 * Verifies an AssetBalance
 * @param url RPC Node to verify against.
 * @param assetBalance AssetBalance to verify.
 */
async function verifyAssetBalance(
  url: string,
  assetBalance: AssetBalance
): Promise<AssetBalance> {
  const newAssetBalance = {
    balance: new Fixed8(0),
    spent: [] as Coin[],
    unspent: [] as Coin[],
    unconfirmed: [] as Coin[],
  };
  const validCoins = await verifyCoins(url, assetBalance.unspent);
  validCoins.forEach((valid, i) => {
    const coin = assetBalance.unspent[i];
    if (valid) {
      newAssetBalance.unspent.push(coin);
      newAssetBalance.balance = newAssetBalance.balance.add(coin.value);
    } else {
      newAssetBalance.spent.push(coin);
    }
  });
  return new AssetBalance(newAssetBalance);
}

function exportAssets(assets: { [sym: string]: AssetBalance }): {
  [sym: string]: AssetBalanceLike;
} {
  const output: { [sym: string]: AssetBalanceLike } = {};
  const keys = Object.keys(assets);
  for (const key of keys) {
    output[key] = assets[key].export();
  }
  return output;
}

function exportTokens(tokens: {
  [sym: string]: Fixed8;
}): Record<string, number> {
  const out: { [sym: string]: number } = {};
  Object.keys(tokens).forEach((symbol) => {
    out[symbol] = tokens[symbol].toNumber();
  });
  return out;
}

/**
 * Represents a balance available for an Account.
 * Contains balances for both UTXO assets and NEP5 tokens.
 */
export class Balance {
  /** The address for this Balance */
  public address: string;
  /** The network for this Balance */
  public net: string;
  /** The symbols of assets found in this Balance. Use this symbol to find the corresponding key in the assets object. */
  public assetSymbols: string[];
  /** The object containing the balances for each asset keyed by its symbol. */
  public assets: { [sym: string]: AssetBalance };
  /** The symbols of NEP5 tokens found in this Balance. Use this symbol to find the corresponding balance in the tokens object. */
  public tokenSymbols: string[];
  /** The token balances in this Balance for each token keyed by its symbol. */
  public tokens: { [sym: string]: Fixed8 };

  public constructor(bal: Partial<BalanceLike> = {}) {
    this.address = bal.address || "";
    this.net = bal.net || "NoNet";
    this.assetSymbols = [];
    this.assets = {};
    if (typeof bal.assets === "object") {
      const keys = Object.keys(bal.assets);
      for (const key of keys) {
        if (typeof bal.assets[key] === "object") {
          this.addAsset(key, bal.assets?.[key]);
        }
      }
    }
    this.tokenSymbols = [];
    this.tokens = {};
    if (typeof bal.tokens === "object") {
      const keys = Object.keys(bal.tokens);
      for (const key of keys) {
        this.addToken(key, bal.tokens?.[key]);
      }
    }
  }

  public get [Symbol.toStringTag](): string {
    return "Balance";
  }

  /**
   * Adds a new asset to this Balance.
   * @param  sym The symbol to refer by. This function will force it to upper-case.
   * @param assetBalance The assetBalance if initialized. Default is a zero balance object.
   */
  public addAsset(sym: string, assetBalance?: Partial<AssetBalanceLike>): this {
    sym = sym.toUpperCase();
    this.assetSymbols.push(sym);
    this.assetSymbols.sort();
    const cleanedAssetBalance = new AssetBalance(assetBalance);
    this.assets[sym] = cleanedAssetBalance;
    return this;
  }

  /**
   * Adds a new NEP-5 Token to this Balance.
   * @param sym - The NEP-5 Token Symbol to refer by.
   * @param tokenBalance - The amount of tokens this account holds.
   */
  public addToken(
    sym: string,
    tokenBalance: string | number | Fixed8 = 0
  ): this {
    sym = sym.toUpperCase();
    this.tokenSymbols.push(sym);
    this.tokens[sym] = new Fixed8(tokenBalance);
    return this;
  }

  /**
   * Applies a Transaction to a Balance, removing spent coins and adding new coins. This currently applies only to Assets.
   * @param tx Transaction that has been sent and accepted by Node.
   * @param confirmed If confirmed, new coins will be added to unspent. Else, new coins will be added to unconfirmed property first.
   */
  public applyTx(tx: BaseTransaction | string, confirmed = false): Balance {
    tx = tx instanceof BaseTransaction ? tx : Transaction.deserialize(tx);
    const symbols = this.assetSymbols;
    // Spend coins
    for (const input of tx.inputs) {
      const findFunc = (el: Coin): boolean =>
        el.txid === input.prevHash && el.index === input.prevIndex;
      for (const sym of symbols) {
        const assetBalance = this.assets[sym];
        const ind = assetBalance.unspent.findIndex(findFunc);
        if (ind >= 0) {
          const spentCoin = assetBalance.unspent.splice(ind, 1);
          assetBalance.spent = assetBalance.spent.concat(spentCoin);
          break;
        }
      }
    }

    // Add new coins
    const hash = tx.hash;
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i];
      const sym = ASSETS[output.assetId];
      const assetBalance = this.assets[sym];
      if (!assetBalance) {
        this.addAsset(sym);
      }
      const coin = new Coin({ index: i, txid: hash, value: output.value });
      if (confirmed) {
        const findFunc = (el: Coin): boolean =>
          el.txid === coin.txid && el.index === coin.index;
        const unconfirmedIndex = assetBalance.unconfirmed.findIndex(findFunc);
        if (unconfirmedIndex >= 0) {
          assetBalance.unconfirmed.splice(unconfirmedIndex, 1);
        }
        if (!assetBalance.unspent) {
          assetBalance.unspent = [];
        }
        assetBalance.unspent.push(coin);
      } else {
        if (!assetBalance.unconfirmed) {
          assetBalance.unconfirmed = [];
        }
        assetBalance.unconfirmed.push(coin);
      }
      this.assets[sym] = assetBalance;
    }

    return this;
  }

  /**
   * Informs the Balance that the next block is confirmed, thus moving all unconfirmed transaction to unspent.
   */
  public confirm(): Balance {
    for (const sym of this.assetSymbols) {
      const assetBalance = this.assets[sym];
      assetBalance.unspent = assetBalance.unspent.concat(
        assetBalance.unconfirmed
      );
      assetBalance.unconfirmed = [];
    }
    return this;
  }

  /**
   * Export this class as a plain JS object
   */
  public export(): BalanceLike {
    return {
      net: this.net,
      address: this.address,
      assetSymbols: this.assetSymbols,
      assets: exportAssets(this.assets),
      tokenSymbols: this.tokenSymbols,
      tokens: exportTokens(this.tokens),
    };
  }

  /**
   * Verifies the coins in balance are unspent. This is an expensive call.
   *
   * Any coins categorised incorrectly are moved to their correct arrays.
   * @param url NEO Node to check against.
   */
  public verifyAssets(url: string): Promise<this> {
    const promises: Promise<AssetBalance>[] = [];
    const symbols = this.assetSymbols;
    symbols.map((key) => {
      const assetBalance = this.assets[key];
      promises.push(verifyAssetBalance(url, assetBalance));
    });
    return Promise.all(promises).then((newBalances) => {
      symbols.map((sym, i) => {
        this.assets[sym] = newBalances[i];
      });
      return this;
    });
  }
}

export default Balance;
