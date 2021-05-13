/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { tx } from "@cityofzion/neon-core";
import { mocked } from "ts-jest/utils";
import { getVerificationSignatureForSmartContract as _getVerificationSignatureForSmartContract } from "../../src/funcs/common";
import * as mint from "../../src/funcs/mint";
import { DoInvokeConfig } from "../../src/funcs/types";

jest.mock("../../src/funcs/common");

const getVerificationSignatureForSmartContract = mocked(
  _getVerificationSignatureForSmartContract,
  false
);

describe("addAttributeForMintToken", () => {
  test("skips if no script object present", async () => {
    const config = {
      tx: new tx.ContractTransaction({} as any),
    } as DoInvokeConfig;

    const result = await mint.addAttributeForMintToken(config);

    expect(result.tx!.attributes.length).toBe(0);
  });

  test("adds attribute if script object present", async () => {
    const config = {
      script: {
        operation: "mintTokens",
        scriptHash: "abcd",
      },
      tx: new tx.ContractTransaction({} as any),
    } as DoInvokeConfig;

    const result = await mint.addAttributeForMintToken(config);

    expect(result.tx!.attributes.length).toBe(1);
    expect(
      result.tx!.attributes[0].equals({
        usage: tx.TxAttrUsage.Script,
        data: "cdab",
      })
    ).toBeTruthy();
  });
});

describe("addSignatureForMintToken", () => {
  test("skips if no script object present", async () => {
    const config = {
      tx: new tx.ContractTransaction({} as any),
    } as DoInvokeConfig;

    const result = await mint.addSignatureForMintToken(config);

    expect(result.tx!.scripts.length).toBe(0);
  });

  test("appends signature if script object present", async () => {
    const expectedSignature = {};
    const config = {
      url: "mockUrl",
      account: {
        scriptHash: "abce",
      },
      script: {
        operation: "mintTokens",
        scriptHash: "abcd",
      },
      tx: new tx.ContractTransaction({} as any),
    } as DoInvokeConfig;

    getVerificationSignatureForSmartContract.mockImplementationOnce(
      () => expectedSignature
    );

    const result = await mint.addSignatureForMintToken(config);

    expect(getVerificationSignatureForSmartContract).toBeCalledWith(
      config.url,
      config.script.scriptHash
    );
    expect(result.tx!.scripts.length).toBe(1);
    expect(result.tx!.scripts[0]).toBe(expectedSignature);
  });
});
