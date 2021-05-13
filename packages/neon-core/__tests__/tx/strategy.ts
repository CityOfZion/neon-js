import {
  balancedApproach,
  biggestFirst,
  calculationStrategyFunction,
  smallestFirst,
} from "../../src/tx/strategy";
import { Fixed8 } from "../../src/u";
import { AssetBalance } from "../../src/wallet/components";
import Coin from "../../src/wallet/components/Coin";

describe("Strategy", () => {
  let coins: Coin[];
  let assetBalance: AssetBalance;

  beforeEach(() => {
    coins = [
      new Coin({ txid: "1", value: 1 }),
      new Coin({ txid: "2", value: 2 }),
      new Coin({ txid: "3", value: 3 }),
      new Coin({ txid: "4", value: 4 }),
      new Coin({ txid: "5", value: 5 }),
      new Coin({ txid: "6", value: 6 }),
      new Coin({ txid: "7", value: 7 }),
    ];
    assetBalance = new AssetBalance({
      unspent: coins.slice(0),
    });
  });

  describe("insufficient funds", () => {
    test.each([
      ["smallestFirst", smallestFirst],
      ["biggestFirst", biggestFirst],
      ["balancedApproach", balancedApproach],
    ])("%s", (msg: string, func: calculationStrategyFunction) => {
      const f = (): Coin[] => func(assetBalance, new Fixed8(100));
      expect(f).toThrow("Insufficient assets");
    });
  });
  test("smallestFirst", () => {
    const result = smallestFirst(assetBalance, new Fixed8(4));
    expect(result).toEqual(
      expect.arrayContaining([coins[0], coins[1], coins[2]])
    );
  });

  test("biggestFirst", () => {
    const result = biggestFirst(assetBalance, new Fixed8(4));
    expect(result).toEqual(expect.arrayContaining([coins[6]]));
  });

  describe("balancedApproach", () => {
    test("tiny requiredAmt", () => {
      const result = balancedApproach(assetBalance, new Fixed8(0.1));
      expect(result).toEqual(expect.arrayContaining([coins[0]]));
    });
    test("exact", () => {
      const result = balancedApproach(assetBalance, new Fixed8(4));
      expect(result).toEqual(expect.arrayContaining([coins[3]]));
    });

    test("with change", () => {
      const result = balancedApproach(assetBalance, new Fixed8(4.1));
      expect(result).toEqual(expect.arrayContaining([coins[0], coins[3]]));
    });

    test("big amt", () => {
      const result = balancedApproach(assetBalance, new Fixed8(20));
      expect(result).toEqual(
        expect.arrayContaining([
          coins[6],
          coins[0],
          coins[1],
          coins[2],
          coins[3],
          coins[4],
        ])
      );
    });

    test("all", () => {
      const result = balancedApproach(assetBalance, new Fixed8(28));
      expect(result).toEqual(
        expect.arrayContaining([
          coins[0],
          coins[1],
          coins[2],
          coins[3],
          coins[4],
          coins[5],
          coins[6],
        ])
      );
    });
  });
});
