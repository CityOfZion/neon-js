import Fixed8 from "../../../src/u/Fixed8";
import Coin, { CoinLike } from "../../../src/wallet/components/Coin";

describe("constructor", () => {
  test("empty", () => {
    const result = new Coin();
    expect(result instanceof Coin).toBeTruthy();
    expect(result).toEqual({
      index: 0,
      txid: "",
      value: new Fixed8(0),
    });
  });

  test("CoinLike", () => {
    const testObject = {
      index: 1,
      txid: "id",
      value: 1.2345,
    } as CoinLike;

    const result = new Coin(testObject);
    expect(result instanceof Coin).toBeTruthy();
    expect(result.index).toEqual(testObject.index);
    expect(result.txid).toEqual(testObject.txid);
    expect(result.value.toNumber()).toEqual(testObject.value);
  });

  test("Coin", () => {
    const testObject = new Coin({ index: 1, txid: "test" });

    const result = new Coin(testObject);
    expect(result).not.toBe(testObject);
    expect(result.index).toEqual(testObject.index);
    expect(result.txid).toEqual(testObject.txid);
    expect(result.value.equals(testObject.value)).toBeTruthy();
  });
});

describe("export", () => {
  test("export to basic JS types", () => {
    const expected = { index: 123, txid: "12345678", value: 1.234567 };
    const c = new Coin(expected);
    const result = c.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const object1 = {
    index: 1,
    txid: "object1",
    value: 1.23,
  };
  const object2 = {
    index: 2,
    txid: "object2",
    value: 2.34,
  };

  const coin1 = new Coin(object1);
  const coin2 = new Coin(object2);

  test.each([
    ["Coin1 === Coin1", coin1, coin1, true],
    ["Coin1 !== Coin2", coin1, coin2, false],
    ["Coin1 === object1", coin1, object1, true],
    ["Coin1 === object2", coin1, object2, false],
  ])("%s", (msg: string, a: Coin, b: any, cond: boolean) => {
    expect(a.equals(b) === cond).toBeTruthy();
  });
});
