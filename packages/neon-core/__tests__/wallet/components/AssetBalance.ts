import AssetBalance from "../../../src/wallet/components/AssetBalance";
import Coin from "../../../src/wallet/components/Coin";

const DEFAULT_HASH =
  "290d1ada0276f703904960aa6f10baae1b17af9fe2fbe58799032be9484a9422";

const dataSet = [
  {
    balance: 1,
    hash: DEFAULT_HASH,
    unspent: [{ index: 0, txid: "coin1", value: 1 }],
    spent: [{ index: 1, txid: "coin2", value: 1.2 }],
    unconfirmed: [{ index: 2, txid: "coin3", value: 3 }],
  },
  {
    balance: 7,
    hash: DEFAULT_HASH,
    unspent: [
      { index: 0, txid: "coin1", value: 1 },
      { index: 1, txid: "coin1", value: 6 },
    ],
    spent: [{ index: 1, txid: "coin2", value: 1.2 }],
    unconfirmed: [{ index: 3, txid: "coin3", value: 0.1 }],
  },
];
describe("constructor", () => {
  test("onlyHash", () => {
    const result = new AssetBalance({ hash: DEFAULT_HASH });
    expect(result instanceof AssetBalance).toBeTruthy();
    expect(result).toMatchObject({
      unspent: [],
      spent: [],
      unconfirmed: [],
      hash: DEFAULT_HASH,
    });
  });

  test("empty", () => {
    expect(() => {
      new AssetBalance();
    }).toThrow();
  });

  test("AssetBalanceLike", () => {
    const testObject = dataSet[0];

    const result = new AssetBalance(testObject);
    expect(result instanceof AssetBalance).toBeTruthy();
    expect(result.balance.toNumber()).toEqual(testObject.balance);
    for (let i = 0; i < result.unspent.length; i++) {
      expect(result.unspent[i] instanceof Coin).toBeTruthy();
      expect(result.unspent[i].equals(testObject.unspent[i])).toBeTruthy();
    }
    for (let i = 0; i < result.spent.length; i++) {
      expect(result.spent[i] instanceof Coin).toBeTruthy();
      expect(result.spent[i].equals(testObject.spent[i])).toBeTruthy();
    }
    for (let i = 0; i < result.unconfirmed.length; i++) {
      expect(result.unconfirmed[i] instanceof Coin).toBeTruthy();
      expect(
        result.unconfirmed[i].equals(testObject.unconfirmed[i])
      ).toBeTruthy();
    }
  });

  test("AssetBalance", () => {
    const testObject = new AssetBalance(dataSet[0]);

    const result = new AssetBalance(testObject);
    expect(result).not.toBe(testObject);
    expect(result.balance.equals(testObject.balance)).toBeTruthy();
    expect(result.unspent).toEqual(testObject.unspent);
    expect(result.spent).toEqual(testObject.spent);
    expect(result.unconfirmed).toEqual(testObject.unconfirmed);
  });
});

describe("getter", () => {
  test("balance", () => {
    const testObject = dataSet[1];

    const result = new AssetBalance(testObject);
    expect(result.balance.toNumber()).toBe(7);
  });
});

describe("export", () => {
  test("export to basic JS types", () => {
    const expected = dataSet[1];
    const c = new AssetBalance(expected);
    const result = c.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const object1 = dataSet[0];
  const object2 = dataSet[1];

  const assetBalance1 = new AssetBalance(object1);
  const assetBalance2 = new AssetBalance(object2);

  test.each([
    ["assetBalance1 === assetBalance1", assetBalance1, assetBalance1, true],
    ["assetBalance1 !== assetBalance2", assetBalance1, assetBalance2, false],
    ["assetBalance1 === object1", assetBalance1, object1, true],
    ["assetBalance1 === object2", assetBalance1, object2, false],
  ])("%s", (msg: string, a: AssetBalance, b: any, cond: boolean) => {
    expect(a.equals(b) === cond).toBeTruthy();
  });
});
