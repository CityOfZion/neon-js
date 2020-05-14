import { tx } from "@cityofzion/neon-core";
import { extractAmount, extractAsset, extractAttributes } from "../src/extract";

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
      ecdh02: jest.fn(),
      ecdh03: jest.fn(),
      script: jest.fn(),
      hash10: jest.fn(),
    };
    const result = extractAttributes(testCase as any);
    expect(result.length).toEqual(4);
    expect(result).toEqual(
      expect.arrayContaining([
        { usage: tx.TxAttrUsage.ECDH02, data: testCase.ecdh02 },
        { usage: tx.TxAttrUsage.ECDH03, data: testCase.ecdh03 },
        { usage: tx.TxAttrUsage.Script, data: testCase.script },
        { usage: tx.TxAttrUsage.Hash10, data: testCase.hash10 },
      ])
    );
  });

  const processingTestCases = [
    [
      "Description",
      {
        description: "!%40%23%24%25%5E%26*()_%2B",
      },
      {
        usage: tx.TxAttrUsage.Description,
        data: "21402324255e262a28295f2b",
      },
    ],
    [
      "DescriptionUrl",
      {
        descriptionUrl: "https%3A%2F%2Fcityofzion.io%2Fneon-js",
      },
      {
        usage: tx.TxAttrUsage.DescriptionUrl,
        data: "68747470733a2f2f636974796f667a696f6e2e696f2f6e656f6e2d6a73",
      },
    ],
    [
      "Remark",
      { remark: "what%3F" },
      { usage: tx.TxAttrUsage.Remark, data: "776861743f" },
    ],
  ];

  for (let i = 2; i <= 15; i++) {
    const testcase = [`Remark${i}`, {}, { data: "776861743f" }] as any;
    testcase[1][`remark${i}`] = "what%3F";
    testcase[2].usage = tx.TxAttrUsage[`Remark${i}`];
    processingTestCases.push(testcase);
  }
  test.each(processingTestCases)(
    "postprocess attribute: %s",
    (_: string, testCase: any, expected: any) => {
      const result = extractAttributes(testCase);
      expect(result).toEqual(expect.arrayContaining([expected]));
    }
  );
});
