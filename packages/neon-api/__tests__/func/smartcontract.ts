import { tx } from "@cityofzion/neon-core";
import { getVerificationSignatureForSmartContract } from "../../src/funcs/common";
import * as smartcontract from "../../src/funcs/smartcontract";

jest.mock("../../src/funcs/common");

describe("addAttributeIfExecutingAsSmartContract", () => {
  test("skip if not sendingFromSmartContract", async () => {
    const config = {
      tx: { addAttribute: jest.fn() },
    } as any;

    await smartcontract.addAttributeIfExecutingAsSmartContract(config);
    expect(config.tx.addAttribute).not.toBeCalled();
  });

  test("add attribute if sendingFromSmartContract", async () => {
    const config = {
      account: {
        scriptHash: "abcd",
      },
      sendingFromSmartContract: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
      tx: { addAttribute: jest.fn() },
    } as any;

    await smartcontract.addAttributeIfExecutingAsSmartContract(config);
    expect(config.tx.addAttribute).toBeCalledWith(
      tx.TxAttrUsage.Script,
      "11c4d1f4fba619f2628870d36e3a9773e874705b"
    );
  });
});

describe("addSignatureIfExecutingAsSmartContract", () => {
  test("skip if not sendingFromSmartContract", async () => {
    const config = {
      tx: { addAttribute: jest.fn() },
    } as any;

    await smartcontract.addSignatureIfExecutingAsSmartContract(config);
    expect(config.tx.addAttribute).not.toBeCalled();
    expect(getVerificationSignatureForSmartContract).not.toBeCalled();
  });

  test("add signature if sendingFromSmartContract", async () => {
    const mockSignature = jest.fn();
    const config = {
      url: "mockUrl",
      account: {
        scriptHash: "abcd",
      },
      sendingFromSmartContract: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
      tx: { addWitness: jest.fn(), addAttribute: jest.fn(), scripts: [] },
    } as any;
    getVerificationSignatureForSmartContract.mockResolvedValueOnce(
      mockSignature
    );
    await smartcontract.addSignatureIfExecutingAsSmartContract(config);
    expect(getVerificationSignatureForSmartContract).toBeCalledWith(
      config.url,
      config.sendingFromSmartContract
    );
    expect(config.tx.addWitness).toBeCalled();
  });
});
