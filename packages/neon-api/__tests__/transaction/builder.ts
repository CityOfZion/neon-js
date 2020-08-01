import { TransactionBuilder } from "../../src/transaction";
import { tx, u } from "@cityofzion/neon-core";

describe("constructor", () => {
  test("no param", () => {
    // set nonce, or it will be random
    const txBuilder = new TransactionBuilder({ nonce: 1 });
    expect(txBuilder.build().export()).toEqual({
      attributes: [],
      signers: [],
      networkFee: 0,
      nonce: 1,
      script: "",
      witnesses: [],
      systemFee: 0,
      validUntilBlock: 0,
      version: 0,
    });
  });

  test("with param", () => {
    const txBuilder = new TransactionBuilder({
      nonce: 1,
      script: "abcd",
      systemFee: 100,
      networkFee: 1000,
    });
    expect(txBuilder.build().export()).toEqual({
      attributes: [],
      signers: [],
      networkFee: 1000,
      nonce: 1,
      script: "abcd",
      witnesses: [],
      systemFee: 100,
      validUntilBlock: 0,
      version: 0,
    });
  });
});

describe("setter", () => {
  test("addAttributes", () => {
    const transaction = new TransactionBuilder()
      .addAttributes(
        {
          usage: 129,
          data: "abcd",
        },
        {
          usage: 129,
          data: "dcba",
        }
      )
      .build();
    expect(transaction.attributes.map((attr) => attr.export())).toEqual([
      { data: "abcd", usage: 129 },
      { data: "dcba", usage: 129 },
    ]);
  });

  test("addSigner", () => {
    const transaction = new TransactionBuilder()
      .addSigners(
        {
          account: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
          scopes: tx.WitnessScope.Global,
        },
        {
          account: "bd8bf7f95e33415fc242c48d143694a729172d9f",
          scopes: tx.WitnessScope.CalledByEntry,
        }
      )
      .build();
    expect(transaction.signers.map((s) => s.export())).toEqual([
      {
        account: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
        scopes: 128,
      },
      {
        account: "bd8bf7f95e33415fc242c48d143694a729172d9f",
        scopes: 1,
      },
    ]);
    expect(transaction.sender.toBigEndian()).toBe(
      "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
  });

  test.skip("addIntents", () => {
    const transaction = new TransactionBuilder()
      .addIntents(
        {
          scriptHash: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
          operation: "test",
          args: [1, 2],
        },
        {
          scriptHash: "bd8bf7f95e33415fc242c48d143694a729172d9f",
          operation: "balanceOf",
          args: ["bd8bf7f95e33415fc242c48d143694a729172d9f"],
        }
      )
      .build();
    expect(transaction.script.toBigEndian()).toBe(
      "525152c1047465737414f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b5214bd8bf7f95e33415fc242c48d143694a729172d9f51c10962616c616e63654f66149f2d1729a79436148dc442c25f41335ef9f78bbd68627d5b52"
    );
  });

  test("setFee", () => {
    const transaction = new TransactionBuilder()
      .setSystemFee(new u.Fixed8(10))
      .setNetworkFee(new u.Fixed8(2))
      .build();
    expect(transaction.systemFee.equals(10)).toBeTruthy();
    expect(transaction.networkFee.equals(2)).toBeTruthy();
  });
});
