import { rpc, tx } from "@cityofzion/neon-core";
import * as common from "../../src/funcs/common";
import { DoInvokeConfig } from "../../src/funcs/types";

describe("checkProperty", () => {
  test("throws error if property not found", () => {
    const testObject = { a: 1, b: 2 };
    const f = () => {
      common.checkProperty(testObject, "c" as any);
    };
    expect(f).toThrow();
  });

  test("throws error if property is null", () => {
    const testObject = { a: null, b: 2 };
    const f = () => {
      common.checkProperty(testObject, "a");
    };
    expect(f).toThrow();
  });
});

describe("modifyTransactionForEmptyTransaction", () => {
  test("performs operation on empty tx", async () => {
    const config = {
      account: { address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW" },
      tx: new tx.ContractTransaction()
    } as DoInvokeConfig;

    const result = await common.modifyTransactionForEmptyTransaction(config);
    expect(result.tx!.attributes.length).toBe(2);
  });

  test("Ignore transactions with inputs", async () => {
    const config = {
      address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
      tx: new tx.ContractTransaction({
        inputs: [{ prevHash: "", prevIndex: 0 } as any]
      } as tx.Transaction)
    } as DoInvokeConfig;

    const result = await common.modifyTransactionForEmptyTransaction(config);

    expect(result.tx!.attributes.length).toBe(0);
  });
});

describe("getVerificationSignatureForSmartContract", () => {
  test("returns signature", async () => {
    const url = "http://localhost:3000";
    const smartContractScriptHash = "1234";
    const mockExecute = jest.fn(() => ({
      result: {
        parameters: [1, 2]
      }
    }));
    const mockGetContractState = jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute
      };
    });
    rpc.Query.getContractState = mockGetContractState;

    const result = await common.getVerificationSignatureForSmartContract(
      url,
      smartContractScriptHash
    );

    expect(result).toEqual({
      invocationScript: "0000",
      verificationScript: ""
    });
    expect(mockGetContractState).toBeCalledWith(smartContractScriptHash);
    expect(mockExecute).toBeCalledWith(url);
  });
});

describe("extractDump", () => {
  test("filters sensitive info", () => {
    const config = {
      privateKey: { a: 1 },
      address: "nonsensitive",
      nested: {
        a: 1,
        b: 2
      }
    };
    const result = common.extractDump(config);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["address", "nested"])
    );
    expect(config).toHaveProperty("privateKey");
  });

  test("does nothing if no sensitive fields", () => {
    const config = {
      publicKey: { a: 1 },
      address: "nonsensitive",
      nested: {
        a: 1,
        b: 2
      }
    };
    const result = common.extractDump(config);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(Object.keys(config))
    );
  });
});
