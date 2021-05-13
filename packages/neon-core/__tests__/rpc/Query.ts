import _axios from "axios";
import { mocked } from "ts-jest/utils";
import Query from "../../src/rpc/Query";
import { ContractTransaction } from "../../src/tx";

jest.mock("axios");

const axios = mocked(_axios, true);

describe("constructor", () => {
  test("RPCRequest", () => {
    const req = { id: 999, method: "method", params: [1, 2, 3] };
    const result = new Query({ id: 999, method: "method", params: [1, 2, 3] });

    expect(result instanceof Query).toBeTruthy();
    expect(result.req).toEqual(Object.assign({ jsonrpc: "2.0" }, req));
  });
});

describe("export", () => {
  const req = { id: 999, method: "method", params: [1, 2, 3] };
  const q = new Query({ id: 999, method: "method", params: [1, 2, 3] });
  const result = q.export();
  expect(result).toEqual(Object.assign({ jsonrpc: "2.0" }, req));
});

describe("equals", () => {
  const obj1 = { id: 999, method: "method1", params: [1, "2", {}] };
  const obj2 = { id: 999, method: "method2", params: [{}] };
  const query1 = new Query(obj1);
  const query2 = new Query(obj2);

  test.each([
    ["Query1 === Query1", query1, query1, true],
    ["Query1 !== Query2", query1, query2, false],
    ["Query1 === Obj1", query1, obj1, true],
    ["Query1 !== Obj2", query1, obj2, false],
  ])("%s", (msg: string, a: Query, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

describe("static", () => {
  test("getAccountState", () => {
    const result = Query.getAccountState("test");
    expect(result.method).toEqual("getaccountstate");
    expect(result.params).toEqual(["test"]);
  });

  test("getAssetState", () => {
    const result = Query.getAssetState("test");
    expect(result.method).toEqual("getassetstate");
    expect(result.params).toEqual(["test"]);
  });

  describe("getBlock", () => {
    test("hash/index with verbose arg", () => {
      const result = Query.getBlock("test", 0);
      expect(result.method).toEqual("getblock");
      expect(result.params).toEqual(["test", 0]);
    });

    test("with defaults", () => {
      const result = Query.getBlock("test");
      expect(result.method).toEqual("getblock");
      expect(result.params).toEqual(["test", 1]);
    });
  });

  test("getBlockHash", () => {
    const result = Query.getBlockHash(123);
    expect(result.method).toEqual("getblockhash");
    expect(result.params).toEqual([123]);
  });

  test("getBestBlockHash", () => {
    const result = Query.getBestBlockHash();
    expect(result.method).toEqual("getbestblockhash");
    expect(result.params).toEqual([]);
  });

  test("getBlockSysFee", () => {
    const result = Query.getBlockSysFee(123);
    expect(result.method).toEqual("getblocksysfee");
    expect(result.params).toEqual([123]);
  });

  test("getConnectionCount", () => {
    const result = Query.getConnectionCount();
    expect(result.method).toEqual("getconnectioncount");
    expect(result.params).toEqual([]);
  });

  test("getContractState", () => {
    const result = Query.getContractState("hash");
    expect(result.method).toEqual("getcontractstate");
    expect(result.params).toEqual(["hash"]);
  });

  test("getPeers", () => {
    const result = Query.getPeers();
    expect(result.method).toEqual("getpeers");
    expect(result.params).toEqual([]);
  });

  test("getRawMemPool", () => {
    const result = Query.getRawMemPool();
    expect(result.method).toEqual("getrawmempool");
    expect(result.params).toEqual([]);
  });

  describe("getRawTransaction", () => {
    test("all args", () => {
      const result = Query.getRawTransaction("test", 0);
      expect(result.method).toEqual("getrawtransaction");
      expect(result.params).toEqual(["test", 0]);
    });

    test("defaults", () => {
      const result = Query.getRawTransaction("test");
      expect(result.method).toEqual("getrawtransaction");
      expect(result.params).toEqual(["test", 1]);
    });
  });

  test("getStorage", () => {
    const result = Query.getStorage("contract", "key");
    expect(result.method).toEqual("getstorage");
    expect(result.params).toEqual(["contract", "key"]);
  });

  test("getTxOut", () => {
    const result = Query.getTxOut("hash", 1);
    expect(result.method).toEqual("gettxout");
    expect(result.params).toEqual(["hash", 1]);
  });

  test("getValidators", () => {
    const result = Query.getValidators();
    expect(result.method).toEqual("getvalidators");
    expect(result.params).toEqual([]);
  });

  test("getVersion", () => {
    const result = Query.getVersion();
    expect(result.method).toEqual("getversion");
    expect(result.params).toEqual([]);
  });

  describe("invoke", () => {
    test("no params", () => {
      const result = Query.invoke("hash");
      expect(result.method).toEqual("invoke");
      expect(result.params).toEqual(["hash", []]);
    });

    test("muliple params", () => {
      const params = [jest.fn(), jest.fn(), jest.fn()];
      const result = Query.invoke("hash", params[0], params[1], params[2]);
      expect(result.method).toEqual("invoke");
      expect(result.params).toEqual(["hash", params]);
    });
  });

  describe("invokeFunction", () => {
    test("no params", () => {
      const result = Query.invokeFunction("hash", "method");
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual(["hash", "method", []]);
    });

    test("multiple params", () => {
      const params = [jest.fn(), jest.fn(), jest.fn()];
      const result = Query.invokeFunction(
        "hash",
        "method",
        params[0],
        params[1],
        params[2]
      );
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual(["hash", "method", params]);
    });
  });

  describe("invokeScript", () => {
    const result = Query.invokeScript("script");
    expect(result.method).toEqual("invokescript");
    expect(result.params).toEqual(["script"]);
  });

  describe("sendRawTransaction", () => {
    test("hexstring", () => {
      const result = Query.sendRawTransaction("abcd");
      expect(result.method).toEqual("sendrawtransaction");
      expect(result.params).toEqual(["abcd"]);
    });

    test("Transaction", () => {
      const tx = new ContractTransaction();
      const result = Query.sendRawTransaction(tx);
      expect(result.method).toEqual("sendrawtransaction");
      expect(result.params).toEqual([tx.serialize(true)]);
    });
  });

  test("validateAddress", () => {
    const result = Query.validateAddress("addr");
    expect(result.method).toEqual("validateaddress");
    expect(result.params).toEqual(["addr"]);
  });

  test("getUnspents", () => {
    const result = Query.getUnspents("addr");
    expect(result.method).toEqual("getunspents");
    expect(result.params).toEqual(["addr"]);
  });

  test("getUnclaimed", () => {
    const result = Query.getUnclaimed("addr");
    expect(result.method).toEqual("getunclaimed");
    expect(result.params).toEqual(["addr"]);
  });

  test("getClaimable", () => {
    const result = Query.getClaimable("addr");
    expect(result.method).toEqual("getclaimable");
    expect(result.params).toEqual(["addr"]);
  });
});

describe("execute", () => {
  test("basic success", async () => {
    const url = "testUrl";
    const expected = jest.fn();
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: expected })
    );
    const result = await Query.getVersion().execute(url);
    expect(result).toBe(expected);
  });

  test("basic error", () => {
    const url = "testUrl";
    const expected = jest.fn();
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ error: { message: expected } })
    );
    const result = Query.getVersion().execute(url);
    expect(result).rejects.toThrow();
  });

  test("cannot re-query", async () => {
    const url = "testUrl";
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: "" }));
    const q = Query.getVersion();
    await q.execute(url);
    const r2 = q.execute(url);
    expect(r2).rejects.toThrow("This request has been sent");
  });

  test("calls parser when successful", async () => {
    const url = "testUrl";
    const expected = jest.fn();
    const parser = jest.fn().mockImplementation(() => expected);
    const q = Query.getVersion().parseWith(parser);
    const data = { result: jest.fn() };
    axios.post.mockImplementationOnce(() => Promise.resolve({ data }));

    const result = await q.execute(url);
    expect(result).toBe(expected);
    expect(parser).toBeCalledWith(data.result);
  });
});
