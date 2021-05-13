import { mocked } from "ts-jest/utils";
import _Query from "../../src/rpc/Query";
import RPCClient from "../../src/rpc/RPCClient";
import { DEFAULT_RPC } from "../../src/consts";
import { wallet } from "../../src";

jest.mock("../../src/rpc/Query");

// eslint-disable-next-line @typescript-eslint/naming-convention
const Query = mocked(_Query, true);

describe("constructor", () => {
  test("net", () => {
    const result = new RPCClient("MainNet");
    expect(result.net).toBe(DEFAULT_RPC.MAIN);
  });
  test("only url", () => {
    const url = "testUrl";
    const result = new RPCClient(url);
    expect(result.net).toBe(url);
  });

  test("url with version", () => {
    const url = "testUrl";
    const version = "1.2.3";
    const result = new RPCClient(url, version);
    expect(result.version).toBe(version);
  });
});

describe("getters", () => {
  test("default latency", () => {
    const client = new RPCClient("url");
    expect(client.latency).toBe(99999);
  });

  test("average latency", () => {
    const client = new RPCClient("url");
    const latencies = [1, 5, 10, 20, 30, 40, 50];
    const ave = [1, 3, 5, 9, 13, 21, 30];
    for (let i = 0; i < latencies.length; i++) {
      client.latency = latencies[i];
      expect(client.latency).toBe(ave[i]);
    }
  });
});

describe("execute", () => {
  test("", async () => {
    const expected = jest.fn();
    const q = {
      req: { method: "" },
      execute: jest.fn().mockImplementation(() => expected),
    } as any;

    const client = new RPCClient("url");

    const result = await client.execute(q);
    expect(result).toBe(expected);
    expect(q.execute).toBeCalledWith("url", undefined);
    expect(client.history).toEqual([q]);
  });
});

describe("RPC Methods", () => {
  let client: RPCClient;

  beforeEach(() => {
    client = new RPCClient("testUrl");
  });

  describe("getAccountState", () => {
    test("success", async () => {
      const address = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
      const expected = jest.fn();
      Query.getAccountState.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getAccountState(address);

      expect(result).toEqual(expected);
      expect(Query.getAccountState).toBeCalledWith(address);
    });

    test("errors if input is not address", () => {
      const result = client.getAccountState("a");

      expect(result).rejects.toThrow("Invalid address");
    });
  });

  describe("getBlock", () => {
    test("success with all args", async () => {
      const expected = jest.fn();
      Query.getBlock.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getBlock(1, 0);

      expect(result).toEqual(expected);
      expect(Query.getBlock).toBeCalledWith(1, 0);
    });

    test("success with defaults", async () => {
      const expected = jest.fn();
      Query.getBlock.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getBlock(1);

      expect(result).toEqual(expected);
      expect(Query.getBlock).toBeCalledWith(1, 1);
    });
  });

  describe("getBlockHash", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getBlockHash.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getBlockHash(1);

      expect(result).toEqual(expected);
      expect(Query.getBlockHash).toBeCalledWith(1);
    });
  });

  describe("getBlockCount", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getBlockCount.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getBlockCount();

      expect(result).toEqual(expected);
      expect(Query.getBlockCount).toBeCalled();
    });
  });

  describe("getBlockSysFee", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getBlockSysFee.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getBlockSysFee(1);

      expect(result).toEqual(expected);
      expect(Query.getBlockSysFee).toBeCalledWith(1);
    });
  });

  describe("getConnectionCount", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getConnectionCount.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getConnectionCount();

      expect(result).toEqual(expected);
      expect(Query.getConnectionCount).toBeCalled();
    });
  });

  describe("getContractState", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getContractState.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getContractState("hash");

      expect(result).toEqual(expected);
      expect(Query.getContractState).toBeCalledWith("hash");
    });
  });

  describe("getPeers", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getPeers.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getPeers();

      expect(result).toEqual(expected);
      expect(Query.getPeers).toBeCalled();
    });
  });

  describe("getRawMemPool", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getRawMemPool.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getRawMemPool();

      expect(result).toEqual(expected);
      expect(Query.getRawMemPool).toBeCalled();
    });
  });

  describe("getRawTransaction", () => {
    test("success with all args", async () => {
      const expected = jest.fn();
      Query.getRawTransaction.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getRawTransaction("txid", 0);

      expect(result).toEqual(expected);
      expect(Query.getRawTransaction).toBeCalledWith("txid", 0);
    });

    test("success with defaults", async () => {
      const expected = jest.fn();
      Query.getRawTransaction.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getRawTransaction("txid");

      expect(result).toEqual(expected);
      expect(Query.getRawTransaction).toBeCalledWith("txid", 1);
    });
  });

  describe("getStorage", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getStorage.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getStorage("hash", "key");

      expect(result).toEqual(expected);
      expect(Query.getStorage).toBeCalledWith("hash", "key");
    });
  });

  describe("getTxOut", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getTxOut.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getTxOut("txid", 1);

      expect(result).toEqual(expected);
      expect(Query.getTxOut).toBeCalledWith("txid", 1);
    });
  });

  describe("getValidators", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getValidators.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getValidators();

      expect(result).toEqual(expected);
      expect(Query.getValidators).toBeCalled();
    });
  });

  describe("getVersion", () => {
    test("success", async () => {
      const versionString = "/NEO:1.2.3/";
      const expected = "1.2.3";
      Query.getVersion.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({
          result: {
            useragent: versionString,
          },
        })),
      }));
      const result = await client.getVersion();

      expect(result).toEqual(expected);
      expect(Query.getVersion).toBeCalled();
      expect(client.version).toEqual(expected);
    });
  });

  describe("invoke", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.invoke.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const randomObj = {};
      const result = await client.invoke("hash", 1, "2", randomObj);

      expect(result).toEqual(expected);
      expect(Query.invoke).toBeCalledWith("hash", 1, "2", randomObj);
    });

    test("pass params as array", async () => {
      const expected = jest.fn();
      Query.invoke.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const randomObj = {};
      const result = await client.invoke("hash", [1, "2", randomObj]);

      expect(result).toEqual(expected);
      expect(Query.invoke).toBeCalledWith("hash", 1, "2", randomObj);
    });
  });

  describe("invokeFunction", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.invokeFunction.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const randomObj = {};
      const result = await client.invokeFunction(
        "hash",
        "method",
        1,
        "2",
        randomObj
      );

      expect(result).toEqual(expected);
      expect(Query.invokeFunction).toBeCalledWith(
        "hash",
        "method",
        1,
        "2",
        randomObj
      );
    });

    test("pass params as array", async () => {
      const expected = jest.fn();
      Query.invokeFunction.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const randomObj = {};
      const result = await client.invokeFunction("hash", "method", [
        1,
        "2",
        randomObj,
      ]);

      expect(result).toEqual(expected);
      expect(Query.invokeFunction).toBeCalledWith("hash", "method", [
        1,
        "2",
        randomObj,
      ]);
    });
  });

  describe("invokeScript", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.invokeScript.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.invokeScript("script");

      expect(result).toEqual(expected);
      expect(Query.invokeScript).toBeCalledWith("script");
    });
  });

  describe("sendRawTransaction", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.sendRawTransaction.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.sendRawTransaction("hexstring");

      expect(result).toEqual(expected);
      expect(Query.sendRawTransaction).toBeCalledWith("hexstring");
    });
  });

  describe("submitBlock", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.submitBlock.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.submitBlock("hexstring");

      expect(result).toEqual(expected);
      expect(Query.submitBlock).toBeCalledWith("hexstring");
    });
  });

  describe("validateAddress", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.validateAddress.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest
          .fn()
          .mockImplementation(() => ({ result: { isvalid: expected } })),
      }));
      const result = await client.validateAddress("addr");

      expect(result).toEqual(expected);
      expect(Query.validateAddress).toBeCalledWith("addr");
    });
  });

  describe("getUnspents", () => {
    test("success", async () => {
      const queryExpected = { balance: [], address: "" };
      Query.getUnspents.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest
          .fn()
          .mockImplementation(() => ({ result: queryExpected })),
      }));
      const result = await client.getUnspents("addr");

      expect(result).toEqual(new wallet.Balance());
      expect(Query.getUnspents).toBeCalledWith("addr");
    });
  });

  describe("getUnclaimed", () => {
    test("success", async () => {
      const expected = jest.fn();
      Query.getUnclaimed.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getUnclaimed("addr");

      expect(result).toEqual(expected);
      expect(Query.getUnclaimed).toBeCalledWith("addr");
    });
  });

  describe("getClaimable", () => {
    test("success", async () => {
      const expected = { claimable: [], address: "", unclaimed: 0 };
      Query.getClaimable.mockImplementationOnce(() => ({
        req: { method: "" },
        execute: jest.fn().mockImplementation(() => ({ result: expected })),
      }));
      const result = await client.getClaimable("addr");

      expect(result).toBeInstanceOf(wallet.Claims);
      expect(Query.getClaimable).toBeCalledWith("addr");
    });
  });
});
