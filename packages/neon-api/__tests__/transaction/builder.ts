import { TransactionBuilder } from "../../src/transaction";
import { tx, u } from "@cityofzion/neon-core";

describe("constructor", () => {
  test("no param", () => {
    const txBuilder = new TransactionBuilder();
    expect(txBuilder.build().script).toBe("");
  });

  test("with param", () => {
    const txBuilder = new TransactionBuilder({ script: "abcd" });
    expect(txBuilder.build().script).toBe("abcd");
  });
});

describe("setter", () => {
  test("addAttributes", () => {
    const transaction = new TransactionBuilder()
      .addAttributes({
        usage: 129,
        data: "abcd"
      })
      .build();
    expect(transaction.attributes[0].data).toBe("abcd");
  });

  test("addCosigners", () => {
    const transaction = new TransactionBuilder()
      .addCosigners({
        account: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
        scopes: tx.WitnessScope.Global
      })
      .build();
    expect(transaction.cosigners[0].account).toBe(
      "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
  });

  test("addIntents", () => {
    const transaction = new TransactionBuilder()
      .addIntents({
        scriptHash: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
        operation: "test",
        args: [1, 2]
      })
      .build();
    expect(transaction.script).toBe(
      "525152c1047465737414f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
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
