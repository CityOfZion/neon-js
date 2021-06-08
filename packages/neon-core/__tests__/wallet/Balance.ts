import Balance, { BalanceLike } from "../../src/wallet/Balance";
import { AssetBalance, AssetBalanceLike } from "../../src/wallet/components";

const NEO_ASSET_HASH = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"

describe("constructor", () => {
  test("empty", () => {
    const result = new Balance();

    expect(result instanceof Balance).toBeTruthy();
    expect(result).toMatchObject({
      address: "",
      net: "NoNet",
      assetSymbols: [],
      tokenSymbols: [],
      assets: {},
      tokens: {},
    });
  });

  test("BalanceLike", () => {
    const testObject = {
      address: "address",
      net: "UnitTestNet",
      assetSymbols: ["ASS"],
      tokenSymbols: ["TOK"],
      assets: {
        ASS: {hash: NEO_ASSET_HASH} as AssetBalanceLike,
      },
      tokens: { TOK: 1 },
      tokenHashes: {},
    } as BalanceLike;

    const result = new Balance(testObject);
    expect(result instanceof Balance).toBeTruthy();
    expect(result.address).toBe(testObject.address);
    expect(result.net).toBe(testObject.net);
    expect(result.assetSymbols).toEqual(testObject.assetSymbols);
    expect(result.tokenSymbols).toEqual(testObject.tokenSymbols);
    expect(Object.keys(result.tokens)).toEqual(Object.keys(testObject.tokens));
    expect(Object.keys(result.assets)).toEqual(Object.keys(testObject.assets));
    expect(result.assets.ASS instanceof AssetBalance).toBeTruthy();
  });

  test("Balance", () => {
    const testObject = new Balance({
      address: "address",
      net: "UnitTestNet",
      assetSymbols: ["ASS"],
      tokenSymbols: ["TOK"],
      assets: {
        ASS: {
          balance: 1,
          unspent: [{ index: 0, txid: "coin1", value: 1 }],
          hash: NEO_ASSET_HASH
        } as Partial<AssetBalanceLike>,
      },
      tokens: { TOK: 1 },
    });

    const result = new Balance(testObject);
    expect(result).not.toBe(testObject);
    expect(result.assets).not.toBe(testObject.assets);
    expect(result.tokens).not.toBe(testObject.tokens);
  });
});

describe("export", () => {
  test("export to BalanceLike", () => {
    const expected = {
      address: "address",
      net: "UnitTestNet",
      tokenHashes: {},
      assetSymbols: ["ASS"],
      tokenSymbols: ["TOK"],
      assets: {
        ASS: {
          balance: 1,
          hash: NEO_ASSET_HASH,
          unspent: [{ index: 0, txid: "a", value: 1 }],
          spent: [],
          unconfirmed: [],
        } as AssetBalanceLike,
      },
      tokens: { TOK: 1 },
    };

    const balanceObj = new Balance(expected);
    const result = balanceObj.export();
    expect(result).toEqual(expected);
  });
});
