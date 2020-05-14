import Balance, { BalanceLike } from "../../src/wallet/Balance";
import { AssetBalance, AssetBalanceLike } from "../../src/wallet/components";

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
        ASS: {} as AssetBalanceLike,
      },
      tokens: { TOK: 1 },
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
      assetSymbols: ["ASS"],
      tokenSymbols: ["TOK"],
      assets: {
        ASS: {
          balance: 1,
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
