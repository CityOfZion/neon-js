import * as verify from "../../src/wallet/verify";

describe("Verify: Valid", () => {
  test.each([
    "L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML",
    "KysNqEuLb3wmZJ6PsxbA9Bh6ewTybEda4dEiN9X7X48dJPkLWZ5a",
    "L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E",
  ])("WIF: %s", (i: string) => {
    expect(verify.isWIF(i)).toBeTruthy();
  });

  test.each(["6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF"])(
    "NEP2: %s",
    (i: string) => {
      expect(verify.isNEP2(i)).toBeTruthy();
    }
  );

  test.each([
    "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1",
    "4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548",
    "793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13",
  ])("PrivateKey: %s", (i: string) => {
    expect(verify.isPrivateKey(i)).toBeTruthy();
  });

  test.each([
    "02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5",
    "03c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321",
    "02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26",
  ])("EncodedPublicKey: %s", (i: string) => {
    expect(verify.isPublicKey(i, true)).toBeTruthy();
  });

  test.each([
    "04963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5ab872395851e9b1b0dbee1f46c11cc7928912ddb452964099931e05f7f9efd5c",
    "04c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321869971106d82de8ffd0d424eea84a0d67294eecab7b89e861b3bb1fc37f8d905",
    "04c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26a4ddc2ceb4ddc55ae7b2920f79fdbfe5b91e6184d7d487e71030007a56a302f2",
  ])("UnencodedPublicKey: %s", (i: string) => {
    expect(verify.isPublicKey(i, false)).toBeTruthy();
  });

  test.each(["0000000000000000000000000000000000000000"])(
    "ScriptHash: %s",
    (i: string) => {
      expect(verify.isScriptHash(i)).toBeTruthy();
    }
  );

  test.each([
    "Adc4jT59RjDLdXbBni6xzg6SEcLVhHZ5Z9",
    "ARCvt1d5qAGzcHqJCWA2MxvhTLQDb9dvjQ",
    "AYYrr4GauveRr45WwAJyw6izvEMvasBBXH",
  ])("Address: %s", (i: string) => {
    expect(verify.isAddress(i)).toBeTruthy();
  });
});

describe("Verify: Invalid", () => {
  test.each([
    "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ",
    "KysNqEuLb3wmZJ6PsxbA9Bh6ehTybEda4dEiN9X7X48dJPkLWZ5a",
  ])("WIF: %s", (i: string) => {
    expect(verify.isWIF(i)).toBeFalsy();
  });

  test.each([
    "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRf",
    "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRf@",
    "7PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF",
    "6PRRWQToT7GCPe21SYwLUBC9LSWsuzFoP63PNZCdvm3wWUKtpkJTW9Uwpa",
  ])("NEP2: %s", (i: string) => {
    expect(verify.isNEP2(i)).toBeFalsy();
  });

  test.each([
    "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce",
    "4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd654g",
    "793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e1364",
  ])("PrivateKey: %s", (i: string) => {
    expect(verify.isPrivateKey(i)).toBeFalsy();
  });

  test.each([
    "800C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D",
    "01c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321",
    "02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c2g",
  ])("EncodedPublicKey: %s", (i: string) => {
    expect(verify.isPublicKey(i, true)).toBeFalsy();
  });

  test.each([
    "02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5ab872395851e9b1b0dbee1f46c11cc7928912ddb452964099931e05f7f9efd5c",
    "04c467ba44afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f321869971106d82de8ffd0d424eea84a0d67294eecab7b89e861b3bb1fc37f8d907",
  ])("UnencodedPublicKey: %s", (i: string) => {
    expect(verify.isPublicKey(i, false)).toBeFalsy();
  });

  test.each([
    "00000000000000000000000000000000000000",
    "332432324324143214325323654765876985988z",
  ])("ScriptHash: %s", (i: string) => {
    expect(verify.isScriptHash(i)).toBeFalsy();
  });

  test.each([
    "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    "AYYrr4GauveRr45WwAJyw6izvEMvasBBXh",
    "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
  ])("Address: %s", (i: string) => {
    expect(verify.isAddress(i)).toBeFalsy();
  });
});
