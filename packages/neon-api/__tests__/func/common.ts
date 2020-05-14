import { rpc, tx, wallet } from "@cityofzion/neon-core";
import * as common from "../../src/funcs/common";
import { DoInvokeConfig, SendAssetConfig } from "../../src/funcs/types";
import { Provider } from "../../src/provider/common";

const mockProvider: Provider = {
  name: "mockProvider",
  getBalance: jest.fn(),
  getClaims: jest.fn(),
  getHeight: jest.fn(),
  getMaxClaimAmount: jest.fn(),
  getRPCEndpoint: jest.fn(),
  getTransactionHistory: jest.fn(),
};

describe("checkProperty", () => {
  test("throws error if property not found", () => {
    const testObject: { [key: string]: number | null } = { a: 1, b: 2 };
    const f = (): boolean => {
      common.checkProperty(testObject, "c");
      return true;
    };
    expect(f).toThrow();
  });

  test("throws error if property is null", () => {
    const testObject: { [key: string]: number | null } = { a: null, b: 2 };
    const f = (): boolean => {
      common.checkProperty(testObject, "a");
      return true;
    };
    expect(f).toThrow();
  });
});

describe("modifyTransactionForEmptyTransaction", () => {
  test("performs operation on empty tx", async () => {
    const config: DoInvokeConfig = {
      api: mockProvider,
      account: new wallet.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"),
      tx: new tx.InvocationTransaction(),
      script: "",
    };

    const result = await common.modifyTransactionForEmptyTransaction(config);
    expect(result.tx.attributes.length).toBe(2);
  });

  test("Ignore transactions with inputs", async () => {
    const config: SendAssetConfig = {
      api: mockProvider,
      account: new wallet.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"),
      tx: new tx.ContractTransaction({
        inputs: [{ prevHash: "", prevIndex: 0 }],
      }),
    };

    const result = await common.modifyTransactionForEmptyTransaction(config);

    expect(result.tx.attributes.length).toBe(0);
  });
});

describe("getVerificationSignatureForSmartContract", () => {
  test("returns signature", async () => {
    const url = "http://localhost:3000";
    const smartContractScriptHash = "1234";
    const mockExecute = jest.fn(() => ({
      result: {
        parameters: [1, 2],
      },
    }));
    const mockGetContractState = jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
      };
    });
    rpc.Query.getContractState = mockGetContractState;

    const result = await common.getVerificationSignatureForSmartContract(
      url,
      smartContractScriptHash
    );

    expect(result).toEqual(
      expect.objectContaining({
        invocationScript: "0000",
        verificationScript: "",
      })
    );
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
        b: 2,
      },
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
        b: 2,
      },
    };
    const result = common.extractDump(config);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(Object.keys(config))
    );
  });
});
