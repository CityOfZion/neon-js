import { tx } from "@cityofzion/neon-core";
import { extractAmount, extractAsset, extractAttributes } from "../src/extract";
import { TransactionAttributeLike } from "@cityofzion/neon-core/lib/tx";

describe("extractAsset", () => {
  test("return undefined when no asset seen", () => {
    const testCase = {};
    const result = extractAsset(testCase);
    expect(result).toBeUndefined();
  });

  test("return assetId of neo when match word 'neo'", () => {
    const testCase = { asset: "neo" };
    const result = extractAsset(testCase);
    expect(result).toEqual(
      "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
    );
  });

  test("return assetId of gas when match word 'gas'", () => {
    const testCase = { asset: "gas" };
    const result = extractAsset(testCase);
    expect(result).toEqual(
      "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"
    );
  });

  test("return assetId when no matches but valid string encountered", () => {
    const expected = "someScriptHash";
    const testCase = { asset: expected };
    const result = extractAsset(testCase);
    expect(result).toEqual(expected);
  });
});

describe("extractAmount", () => {
  test("return undefined when no amount seen", () => {
    const testCase = {};
    const result = extractAmount(testCase);
    expect(result).toBeUndefined();
  });

  test("return number when amount seen", () => {
    const expected = 123.456;
    const testCase = { amount: expected.toString() };
    const result = extractAmount(testCase);
    expect(result).toEqual(expected);
  });
});

describe("extractAttributes", () => {
  test("return empty array when no attributes found", () => {
    const testCase = {};
    const result = extractAttributes(testCase);
    expect(result).toEqual([]);
  });

  test("ignores unknown attributes", () => {
    const testCase = {
      asset: "1234",
      ecdh04: "1234",
    };
    const result = extractAttributes(testCase);
    expect(result).toEqual([]);
  });

  test("return array of known matchable attributes", () => {
    const testCase = {
      url: "expectedUrl",
    };
    const result = extractAttributes(testCase);
    expect(result.length).toEqual(4);
    expect(result).toEqual(
      expect.arrayContaining([
        { usage: tx.TxAttrUsage.Url, data: "expectedUrl" },
      ])
    );
  });

  const processingTestCases = [
    [
      "Url",
      {
        Url: "https%3A%2F%2Fcityofzion.io%2Fneon-js",
      },
      {
        usage: tx.TxAttrUsage.Url,
        data: "68747470733a2f2f636974796f667a696f6e2e696f2f6e656f6e2d6a73",
      },
    ],
  ];

  test.each(processingTestCases)(
    "postprocess attribute: %s",
    (_: string, testCase: unknown, expected: TransactionAttributeLike) => {
      const result = extractAttributes(testCase);
      expect(result).toEqual(expect.arrayContaining([expected]));
    }
  );
});
