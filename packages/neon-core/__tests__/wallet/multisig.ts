import {
  constructMultiSigVerificationScript,
  getPublicKeysFromVerificationScript,
  getSigningThresholdFromVerificationScript,
} from "../../src/wallet";

const testData: [string, number, string[], string][] = [
  [
    "1 key 1 threshold",
    1,
    ["03118a2b7962fa0226fa35acf5d224855b691c7ea978d1afe2c538631d5f7be85e"],
    "110c2103118a2b7962fa0226fa35acf5d224855b691c7ea978d1afe2c538631d5f7be85e11417bce6ca5",
  ],
  [
    "3 keys 2 threshold",
    2,
    [
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa",
    ],
    "120c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef0c21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c90c2102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa13417bce6ca5",
  ],
];

describe("constructMultiSigVerificationScript", () => {
  test.each(testData)(
    "%s",
    (_: string, threshold: number, keys: string[], script: string) => {
      const result = constructMultiSigVerificationScript(threshold, keys);
      expect(result).toBe(script);
    }
  );
});

describe("getPublicKeysFromVerificationScript", () => {
  test.each(testData)(
    "%s",
    (_: string, _threshold: number, keys: string[], script: string) => {
      const result = getPublicKeysFromVerificationScript(script);
      expect(result).toStrictEqual(keys);
    }
  );
});

describe("getSigningThresholdFromVerificationScript", () => {
  test.each(testData)(
    "%s",
    (_: string, threshold: number, _keys: string[], script: string) => {
      const result = getSigningThresholdFromVerificationScript(script);
      expect(result).toBe(threshold);
    }
  );
});
