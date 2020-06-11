import Query from "../../src/rpc/Query";
import { Transaction } from "../../src/tx";

describe("constructor", () => {
  test("RPCRequest", () => {
    const req = { id: 999, method: "method", params: [1, 2, 3] };
    const result = new Query({ id: 999, method: "method", params: [1, 2, 3] });

    expect(result instanceof Query).toBeTruthy();
    expect(result.export()).toEqual(Object.assign({ jsonrpc: "2.0" }, req));
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
  ])(
    "%s",
    (msg: string, a: Query<unknown[], unknown>, b: unknown, cond: boolean) => {
      expect(a.equals(b)).toBe(cond);
    }
  );
});

describe("static", () => {
  test("getBestBlockHash", () => {
    const result = Query.getBestBlockHash();
    expect(result.method).toEqual("getbestblockhash");
    expect(result.params).toEqual([]);
  });

  describe("getBlock", () => {
    test("hash/index with verbose arg", () => {
      const result = Query.getBlock("test", 1);
      expect(result.method).toEqual("getblock");
      expect(result.params).toEqual(["test", 1]);
    });

    test("with defaults", () => {
      const result = Query.getBlock("test");
      expect(result.method).toEqual("getblock");
      expect(result.params).toEqual(["test", 0]);
    });
  });

  test("getBlockCount", () => {
    const result = Query.getBlockCount();
    expect(result.method).toEqual("getblockcount");
    expect(result.params).toEqual([]);
  });

  test("getBlockHash", () => {
    const result = Query.getBlockHash(123);
    expect(result.method).toEqual("getblockhash");
    expect(result.params).toEqual([123]);
  });

  describe("getBlockHeader", () => {
    test("param in number", () => {
      const result = Query.getBlockHeader(123, 0);
      expect(result.method).toEqual("getblockheader");
      expect(result.params).toEqual([123, 0]);
    });

    test("param in blockhash", () => {
      const result1 = Query.getBlockHeader("blockhash", 1);
      expect(result1.method).toEqual("getblockheader");
      expect(result1.params).toEqual(["blockhash", 1]);
    });
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
    const result = Query.getRawMemPool(0);
    expect(result.method).toEqual("getrawmempool");
    expect(result.params).toEqual([0]);
  });

  describe("getRawTransaction", () => {
    test("all args", () => {
      const result = Query.getRawTransaction("test", 1);
      expect(result.method).toEqual("getrawtransaction");
      expect(result.params).toEqual(["test", 1]);
    });

    test("defaults", () => {
      const result = Query.getRawTransaction("test");
      expect(result.method).toEqual("getrawtransaction");
      expect(result.params).toEqual(["test", 0]);
    });
  });

  test("getStorage", () => {
    const result = Query.getStorage("contract", "key");
    expect(result.method).toEqual("getstorage");
    expect(result.params).toEqual(["contract", "key"]);
  });

  test("getTransactionHeight", () => {
    const result = Query.getTransactionHeight("hash");
    expect(result.method).toEqual("gettransactionheight");
    expect(result.params).toEqual(["hash"]);
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

  describe("invokeFunction", () => {
    test("no params", () => {
      const result = Query.invokeFunction("hash", "method");
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual(["hash", "method", [], []]);
    });

    test("multiple params", () => {
      const params = [jest.fn(), jest.fn(), jest.fn()];
      const result = Query.invokeFunction("hash", "method", params);
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual(["hash", "method", params, []]);
    });

    test("multiple params with checkedWitnessHashes", () => {
      const params = [jest.fn(), jest.fn(), jest.fn()];
      const result = Query.invokeFunction("hash", "method", params, [
        "abcdabcdabcdabcdabcd",
      ]);
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual([
        "hash",
        "method",
        params,
        ["abcdabcdabcdabcdabcd"],
      ]);
    });
  });

  describe("invokeScript", () => {
    test("script", () => {
      const result = Query.invokeScript("script");
      expect(result.method).toEqual("invokescript");
      expect(result.params).toEqual(["script", []]);
    });

    test("script with checkWitnessHashes", () => {
      const result = Query.invokeScript("script", ["abcdabcdabcdabcdabcd"]);
      expect(result.method).toEqual("invokescript");
      expect(result.params).toEqual(["script", ["abcdabcdabcdabcdabcd"]]);
    });
  });

  describe("listPlugins", () => {
    const result = Query.listPlugins();
    expect(result.method).toEqual("listplugins");
    expect(result.params).toEqual([]);
  });

  describe("sendRawTransaction", () => {
    test("hexstring", () => {
      const result = Query.sendRawTransaction("abcd");
      expect(result.method).toEqual("sendrawtransaction");
      expect(result.params).toEqual(["abcd"]);
    });

    test("Transaction", () => {
      const tx = new Transaction();
      const result = Query.sendRawTransaction(tx);
      expect(result.method).toEqual("sendrawtransaction");
      expect(result.params).toEqual([tx.serialize(true)]);
    });
  });

  test("submitBlock", () => {
    const result = Query.submitBlock("block");
    expect(result.method).toEqual("submitblock");
    expect(result.params).toEqual(["block"]);
  });

  test("validateAddress", () => {
    const result = Query.validateAddress("addr");
    expect(result.method).toEqual("validateaddress");
    expect(result.params).toEqual(["addr"]);
  });
});
