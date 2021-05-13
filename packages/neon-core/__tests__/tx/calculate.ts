import { ASSET_ID } from "../../src/consts";
import { TransactionInput, TransactionOutput } from "../../src/tx";
import { calculateInputs } from "../../src/tx/calculate";
import { Balance } from "../../src/wallet";
import { AssetBalanceLike } from "../../src/wallet/components";

describe("calculateInputs", () => {
  test("errors if no funds", () => {
    const balance = new Balance();
    const intents = [
      new TransactionOutput({
        value: 1,
        assetId: ASSET_ID.NEO,
        scriptHash: "ab",
      }),
    ];
    const f = (): { inputs: TransactionInput[]; change: TransactionOutput[] } =>
      calculateInputs(balance, intents);
    expect(f).toThrow();
  });

  test("errors if insufficient funds", () => {
    const balance = new Balance();
    balance.addAsset("NEO", {
      balance: 1,
      unspent: [{ txid: "", value: 1, index: 0 }],
    } as AssetBalanceLike);
    const intents = [
      new TransactionOutput({
        value: 2,
        assetId: ASSET_ID.NEO,
        scriptHash: "ab",
      }),
    ];
    const f = (): { inputs: TransactionInput[]; change: TransactionOutput[] } =>
      calculateInputs(balance, intents);
    expect(f).toThrow("Insufficient");
  });

  test("successfully calculate using default strategy", () => {
    const balance = new Balance({
      assets: {
        NEO: {
          unspent: [{ value: 10, txid: "ab", index: 0 }],
        },
        GAS: {
          unspent: [{ value: 1.5, txid: "cd", index: 0 }],
        },
        TEST: {
          unspent: [{ value: 1, txid: "ef", index: 0 }],
        },
      },
      address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
    });
    const intents = [
      new TransactionOutput({
        value: 1,
        assetId: ASSET_ID.NEO,
        scriptHash: "5df31f6f59e6a4fbdd75103786bf73db1000b235",
      }),
      new TransactionOutput({
        value: 0.5,
        assetId: ASSET_ID.GAS,
        scriptHash: "5df31f6f59e6a4fbdd75103786bf73db1000b235",
      }),
    ];
    const fees = 0.1;

    const result = calculateInputs(balance, intents, fees);

    expect(result.inputs).toEqual(
      expect.arrayContaining([
        { prevHash: "ab", prevIndex: 0 },
        { prevHash: "cd", prevIndex: 0 },
      ])
    );

    expect(result.change.map((c) => c.export())).toEqual(
      expect.arrayContaining([
        {
          value: 9,
          assetId: ASSET_ID.NEO,
          scriptHash: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
        },
        {
          value: 0.9,
          assetId: ASSET_ID.GAS,
          scriptHash: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
        },
      ])
    );
  });
});
