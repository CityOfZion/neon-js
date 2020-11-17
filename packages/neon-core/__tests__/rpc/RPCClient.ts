import _Axios from "axios";
import { mocked } from "ts-jest/utils";
import RPCClient from "../../src/rpc/RPCClient";
import { DEFAULT_RPC } from "../../src/consts";
import { ContractManifest } from "../../src/sc";
import Query from "../../src/rpc/Query";
import { Signer, WitnessScope } from "../../src/tx";

jest.mock("axios");
const Axios = mocked(_Axios, true);

beforeEach(() => {
  Axios.mockReset();
});

describe("constructor", () => {
  test("net", () => {
    const result = new RPCClient("MainNet");
    expect(result.net).toBe(DEFAULT_RPC.MAIN);
  });
  test("only url", () => {
    const url = "http://testUrl.com";
    const result = new RPCClient(url);
    expect(result.net).toBe(url);
  });

  test("url with version", () => {
    const url = "http://testUrl.com";
    const version = "1.2.3";
    const result = new RPCClient(url, version);
    expect(result.version).toBe(version);
  });
});

describe("getters", () => {
  test("default latency", () => {
    const client = new RPCClient("http://testUrl.com");
    expect(client.latency).toBe(99999);
  });

  test("average latency", () => {
    const client = new RPCClient("http://testUrl.com");
    const latencies = [1, 5, 10, 20, 30, 40, 50];
    const ave = [1, 3, 5, 9, 13, 21, 30];
    for (let i = 0; i < latencies.length; i++) {
      client.latency = latencies[i];
      expect(client.latency).toBe(ave[i]);
    }
  });
});

describe("execute", () => {
  test("rpc success returns result", async () => {
    const expectedQuery = new Query<[], number>({
      params: [],
      method: "test",
    });
    Axios.post.mockImplementationOnce(async (url, data) => {
      expect(url).toEqual("http://testUrl.com");
      expect(data).toEqual(expectedQuery.export());
      return {
        data: {
          jsonrpc: "2.0",
          id: data.id,
          result: "1234",
        },
      };
    });

    const client = new RPCClient("http://testUrl.com");

    const result = await client.execute(expectedQuery);
    expect(result).toBe("1234");
  });

  test("rpc error will throw", async () => {
    const expectedErrorMessage = "expectedErrorMessage";
    const query = new Query<[], number>({
      params: [],
      method: "test",
    });
    Axios.post.mockImplementationOnce(async (url, data) => {
      return {
        data: {
          jsonrpc: "2.0",
          id: data.id,
          error: {
            code: 1,
            message: expectedErrorMessage,
          },
        },
      };
    });

    const client = new RPCClient("http://testUrl.com");
    expect(client.execute(query)).rejects.toThrow(expectedErrorMessage);
  });
});

describe("RPC Methods", () => {
  let client: RPCClient;

  beforeEach(() => {
    client = new RPCClient("http://testUrl.com");
  });

  describe("getBestBlockHash", () => {
    test("success", async () => {
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getbestblockhash",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: "1234",
          },
        };
      });

      const result = await client.getBestBlockHash();
      expect(result).toEqual("1234");
    });
  });

  describe("getBlock", () => {
    test("index with height, verbose = default 0", async () => {
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblock",
          params: [123, 0],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: "1234",
          },
        };
      });

      const result = await client.getBlock(123);
      expect(result).toEqual("1234");
    });

    test("index with hash, verbose = 1", async () => {
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblock",
          params: ["hash", 1],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getBlock("hash", 1);
      expect(result).toEqual(expected);
    });
  });

  describe("getBlockCount", () => {
    test("success", async () => {
      const expected = 123;
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblockcount",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getBlockCount();
      expect(result).toEqual(expected);
    });
  });

  describe("getBlockHash", () => {
    test("success", async () => {
      const expected = "1234";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblockhash",
          params: [123],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getBlockHash(123);
      expect(result).toEqual(expected);
    });
  });

  describe("getBlockHeader", () => {
    test("index with height, verbose = default0", async () => {
      const expected = "1234";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblockheader",
          params: [234, 0],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getBlockHeader(234);
      expect(result).toEqual(expected);
    });

    test("index with hash, verbose = 1", async () => {
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getblockheader",
          params: ["hash", 1],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getBlockHeader("hash", 1);
      expect(result).toEqual(expected);
    });
  });

  describe("getConnectionCount", () => {
    test("success", async () => {
      const expected = 100;
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getconnectioncount",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getConnectionCount();
      expect(result).toEqual(expected);
    });
  });

  describe("getContractState", () => {
    test("success", async () => {
      const successfulResult = {
        id: 1,
        script: "1234",
        hash: "5678",
        manifest: {
          groups: [],
          abi: {
            hash: "1234",
            methods: [],
            events: [],
          },
          permissions: [],
          trusts: "*" as const,
          safemethods: ["a", "b"],
          supportedstandards: [],
          features: {
            storage: true,
            payable: false,
          },
        },
      };
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getcontractstate",
          params: ["5678"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: successfulResult,
          },
        };
      });
      const result = await client.getContractState("5678");

      expect(result).toEqual(successfulResult);
    });
  });

  describe("getPeers", () => {
    test("success", async () => {
      const expected = {
        connected: [{ address: "addressA", port: 1234 }],
        unconnected: [{ address: "addressB", port: 2345 }],
        bad: [{ address: "addressC", port: 3456 }],
      };
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getpeers",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getPeers();
      expect(result).toEqual(expected);
    });
  });

  describe("getRawMemPool", () => {
    test("success with no verbose", async () => {
      const expected = ["a", "b", "c"];
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getrawmempool",
          params: [0],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getRawMemPool();
      expect(result).toEqual(expected);
    });

    test("success with verbose", async () => {
      const expected = {
        verified: ["a", "b", "c"],
        unverified: ["d"],
        height: 1234,
      };
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getrawmempool",
          params: [1],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getRawMemPool(1);
      expect(result).toEqual(expected);
    });
  });

  describe("getRawTransaction", () => {
    test("verbose = 1", async () => {
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getrawtransaction",
          params: ["txid", 1],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getRawTransaction("txid", 1);
      expect(result).toEqual(expected);
    });

    test("verbose = default 0", async () => {
      const expected = "1234";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getrawtransaction",
          params: ["txid", 0],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getRawTransaction("txid");
      expect(result).toEqual(expected);
    });
  });

  describe("getStorage", () => {
    test("success", async () => {
      const expected = "expected";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getstorage",
          params: ["hash", "key"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getStorage("hash", "key");
      expect(result).toEqual(expected);
    });
  });

  describe("getTransactionHeight", () => {
    test("success", async () => {
      const expected = 1234;
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "gettransactionheight",
          params: ["txid"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getTransactionHeight("txid");
      expect(result).toEqual(expected);
    });
  });

  describe("getNextBlockValidators", () => {
    test("success", async () => {
      const expected = [
        {
          publickey: "key",
          votes: "1",
          active: true,
        },
      ];
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getnextblockvalidators",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getNextBlockValidators();
      expect(result).toEqual(expected);
    });
  });

  describe("getVersion", () => {
    test("success", async () => {
      const expected = {
        tcpport: 20333,
        wsport: 20334,
        nonce: 288566725,
        useragent: "/Neo:3.0.0-preview3/",
        magic: 1234567890,
      };
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getversion",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.getVersion();
      expect(result).toEqual(expected);
    });
  });

  describe("invokeFunction", () => {
    test("success", async () => {
      const randomObj = jest.fn();
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "invokefunction",
          params: [
            "hash",
            "method",
            [1, "2", randomObj],
            [
              {
                account: "0x" + "0".repeat(20),
                scopes: "Global",
              },
            ],
          ],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.invokeFunction(
        "hash",
        "method",
        [1, "2", randomObj],
        [
          new Signer({
            account: "0".repeat(20),
            scopes: WitnessScope.Global,
          }),
        ]
      );
      expect(result).toEqual(expected);
    });
  });

  describe("invokeScript", () => {
    test("success", async () => {
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "invokescript",
          params: [
            "script",
            [
              {
                account: "0x" + "0".repeat(20),
                scopes: "Global",
              },
            ],
          ],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.invokeScript("script", [
        new Signer({
          account: "0".repeat(20),
          scopes: WitnessScope.Global,
        }),
      ]);
      expect(result).toEqual(expected);
    });
  });

  describe("listPlugins", () => {
    test("success", async () => {
      const expected = jest.fn();
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "listplugins",
          params: [],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: expected,
          },
        };
      });

      const result = await client.listPlugins();
      expect(result).toEqual(expected);
    });
  });

  describe("sendRawTransaction", () => {
    test("success", async () => {
      const expected = "1234";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "sendrawtransaction",
          params: ["hexstring"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: {
              hash: expected,
            },
          },
        };
      });

      const result = await client.sendRawTransaction("hexstring");
      expect(result).toEqual(expected);
    });
  });

  describe("submitBlock", () => {
    test("success", async () => {
      const expected = "1234";
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "submitblock",
          params: ["hexstring"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: {
              hash: "1234",
            },
          },
        };
      });

      const result = await client.submitBlock("hexstring");
      expect(result).toEqual(expected);
    });
  });

  describe("validateAddress", () => {
    test("success", async () => {
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "validateaddress",
          params: ["addr"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: {
              address: "addr",
              isvalid: true,
            },
          },
        };
      });

      const result = await client.validateAddress("addr");
      expect(result).toEqual(true);
    });
  });

  describe("getUnclaimedGas", () => {
    test("success", async () => {
      Axios.post.mockImplementationOnce(async (url, data) => {
        expect(url).toEqual("http://testUrl.com");
        expect(data).toMatchObject({
          method: "getunclaimedgas",
          params: ["addr"],
        });
        return {
          data: {
            jsonrpc: "2.0",
            id: data.id,
            result: {
              unclaimed: "1234567812345678",
              address: "addr",
            },
          },
        };
      });

      const result = await client.getUnclaimedGas("addr");
      expect(result).toEqual(12345678.12345678);
    });
  });
});
