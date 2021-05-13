import { str2hexstring } from "../../src/u";
import { sign, verify } from "../../src/wallet/signing";

const _dataSet = [
  [
    "City of Zion",
    "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1",
    "02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5",
  ],
  [
    "Morpheus",
    "L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML",
    "04c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26a4ddc2ceb4ddc55ae7b2920f79fdbfe5b91e6184d7d487e71030007a56a302f2",
  ],
  [
    "我的密码",
    "793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13",
    "04c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26a4ddc2ceb4ddc55ae7b2920f79fdbfe5b91e6184d7d487e71030007a56a302f2",
  ],
  [
    "MyL33tP@33w0rd",
    "L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E",
    "02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26",
  ],
];

const keyCombinations = [
  [
    "privateKey & EncodedPublicKey",
    "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1",
    "02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5",
  ],
  [
    "privateKey & UnencodedPublicKey",
    "793466a3dfe3935a475d02290e37000a3e835f6740f9733e72e979d6e1166e13",
    "04c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26a4ddc2ceb4ddc55ae7b2920f79fdbfe5b91e6184d7d487e71030007a56a302f2",
  ],
  [
    "WIF & UnencodedPublicKey",
    "L2qkBc4ogTZERR4Watg4QoQq37w8fxrVZkYrPk7ZZSoRUZsr9yML",
    "04963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5ab872395851e9b1b0dbee1f46c11cc7928912ddb452964099931e05f7f9efd5c",
  ],
  [
    "WIF & EncodedPublicKey",
    "L1HKLWratxFhX94XSn98JEULQYKGhRycf4nREe3Cs8EPQStF5u9E",
    "02c1a9b2d0580902a6c2d09a8febd0a7a13518a9a61d08183f09ff929b66ac7c26",
  ],
];

const messages = ["City of Zion", "Morpheus", "我的密码", "MyL33tP@33w0rd"];

describe("Key combinations", () => {
  test.each(keyCombinations)(
    "%s",
    (msg: string, priKey: string, pubKey: string) => {
      const hex = str2hexstring(msg);
      const sig = sign(hex, priKey);
      const result = verify(hex, sig, pubKey);
      expect(result).toBe(true);
    }
  );
});

describe("Different messages", () => {
  const priKey =
    "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1";
  const pubKey =
    "02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5";
  test.each(messages)("%s", (msg: string) => {
    const hex = str2hexstring(msg);
    const sig = sign(hex, priKey);
    const result = verify(hex, sig, pubKey);
    expect(result).toBe(true);
  });
});
