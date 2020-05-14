import * as hash from "../../src/u/hash";

describe.each([
  [
    "",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "9c1185a5c5e9fc54612808977ee8f548b2258d31",
  ],
  [
    "000102030405060708090a0b0c0d0e0f",
    "be45cb2605bf36bebde684841a28f0fd43c69850a3dce5fedba69928ee3a8991",
    "696c7528a3545e25bec296e0d39b5f898bec97f7",
  ],
  // [
  //   "00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31",
  //   "ad3c854da227c7e99c4abfad4ea41d71311160df2e415e713318c70d67c6b41c",
  //   "8fcabb8fec931c35470058945c2c2f490370c27e"
  // ],
  // [
  //   "0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352",
  //   "0b7c28c9b7290c98d7438e70b3d3f7c848fbd7d1dc194ff83f4f7cc9b1378e98",
  //   "06975f710c79d98ad6384fc446ef1a2034516de5"
  // ]
])("Basic hash", (data: string, sha: string, ripe: string) => {
  test(`sha256: ${data}`, () => {
    const result = hash.sha256(data);
    expect(result).toBe(sha);
  });

  test(`ripemd160: ${data}`, () => {
    const result = hash.ripemd160(data);
    expect(result).toBe(ripe);
  });
});

describe.each([
  // [
  //   // Empty string test
  //   "",
  //   "5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456",
  //   "ba084d3f143f2896809d3f1d7dffed472b39d8de"
  // ],
  [
    // Random hash
    "54657374",
    "c60907e990745f7d91c4423713764d2724571269d3db4856d37c6302792c59a6",
    "0d6d086ce847371e069db7f67c5de45ed9ef1e54",
  ],
  [
    "000102030405060708090a0b0c0d0e0f",
    "fc793c641b354b10b9a264ad4f541f6efe8445a0d05fe39336a126252b166e8b",
    "7a91e1b6ef1be3631b154ac8763a017eb03dc1b0",
  ],
])("Advanced hash", (data: string, hash256Out: string, hash160Out: string) => {
  test(`hash256: ${data}`, () => {
    const result = hash.hash256(data);
    expect(result).toBe(hash256Out);
  });

  test(`hash160: ${data}`, () => {
    const result = hash.hash160(data);
    expect(result).toBe(hash160Out);
  });
});
