import Query, { QueryLike } from "../../src/rpc/Query";
import { ContractParam } from "../../src/sc";
import { Transaction, Signer } from "../../src/tx";
import { HexString } from "../../src/u";

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
    (
      msg: string,
      a: Query<unknown[], unknown>,
      b: Partial<Query<unknown[], unknown> | QueryLike<unknown[]>>,
      cond: boolean
    ) => {
      expect(a.equals(b)).toBe(cond);
    }
  );
});

describe("JSONRPC spec", () => {
  test("allows structured values in params", () => {
    const objectquery = {
      method: "objectquery",
      params: {
        key: "value",
        anotherfield: 1,
        thirdfield: [1, 2, 3],
        fourthfield: {
          nested: "string",
        },
      },
    };
    const result = new Query(objectquery);

    const exportedQuery = result.export();

    expect(exportedQuery.jsonrpc).toBe("2.0");
    expect(exportedQuery.method).toBe(objectquery.method);
    expect(exportedQuery.params).toBe(objectquery.params);
  });
});
describe("static", () => {
  test("traverseIterator", () => {
    const result = Query.traverseIterator(
      "testSessionId",
      "testIteratorId",
      10
    );
    expect(result.method).toEqual("traverseiterator");
    expect(result.params).toEqual(["testSessionId", "testIteratorId", 10]);
  });
  test("calculateNetworkFee", () => {
    const result = Query.calculateNetworkFee("12345");
    expect(result.method).toEqual("calculatenetworkfee");
    expect(result.params).toEqual(["12345"]);
  });
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

  test("getCommittee", () => {
    const result = Query.getCommittee();
    expect(result.method).toEqual("getcommittee");
    expect(result.params).toEqual([]);
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
    const result = Query.getStorage("contract", "0b");
    expect(result.method).toEqual("getstorage");
    expect(result.params).toEqual(["contract", "Cw=="]);
  });

  test("getTransactionHeight", () => {
    const result = Query.getTransactionHeight("hash");
    expect(result.method).toEqual("gettransactionheight");
    expect(result.params).toEqual(["hash"]);
  });

  test("getNextBlockValidators", () => {
    const result = Query.getNextBlockValidators();
    expect(result.method).toEqual("getnextblockvalidators");
    expect(result.params).toEqual([]);
  });

  test("getVersion", () => {
    const result = Query.getVersion();
    expect(result.method).toEqual("getversion");
    expect(result.params).toEqual([]);
  });

  describe("invokeContractVerify", () => {
    test("no params", () => {
      const result = Query.invokeContractVerify("hash");
      expect(result.method).toEqual("invokecontractverify");
      expect(result.params).toEqual(["hash", [], []]);
    });

    test("multiple params", () => {
      const result = Query.invokeContractVerify(
        "hash",
        [ContractParam.integer(1)],
        [new Signer({ account: "ab".repeat(20), scopes: "CalledByEntry" })]
      );

      expect(result.method).toEqual("invokecontractverify");
      expect(result.params).toEqual([
        "hash",
        [{ type: "Integer", value: "1" }],
        [{ account: "0x" + "ab".repeat(20), scopes: "CalledByEntry" }],
      ]);
    });
  });

  describe("invokeFunction", () => {
    test("no params", () => {
      const result = Query.invokeFunction("hash", "method");
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual(["hash", "method", [], []]);
    });

    test("multiple params", () => {
      const inputParams = [
        1,
        ContractParam.integer(2),
        { type: "Integer", value: "3" },
      ];
      const result = Query.invokeFunction("hash", "method", inputParams);
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual([
        "hash",
        "method",
        [1, { type: "Integer", value: "2" }, { type: "Integer", value: "3" }],
        [],
      ]);
    });

    test("multiple params with signers", () => {
      const inputParams = [
        1,
        ContractParam.integer(2),
        { type: "Integer", value: "3" },
      ];
      const result = Query.invokeFunction("hash", "method", inputParams, [
        new Signer({ account: "ab".repeat(20) }),
        {
          account: "cd".repeat(20),
          scopes: "CalledByEntry",
        },
      ]);
      expect(result.method).toEqual("invokefunction");
      expect(result.params).toEqual([
        "hash",
        "method",
        [1, { type: "Integer", value: "2" }, { type: "Integer", value: "3" }],
        [
          {
            account: "0x" + "ab".repeat(20),
            scopes: "None",
          },
          {
            account: "cd".repeat(20),
            scopes: "CalledByEntry",
          },
        ],
      ]);
    });
  });

  describe("invokeScript", () => {
    test("base64 input", () => {
      const result = Query.invokeScript("EBES");
      expect(result.method).toEqual("invokescript");
      expect(result.params).toEqual(["EBES", []]);
    });

    test("HexString", () => {
      const result = Query.invokeScript(HexString.fromHex("101112"));
      expect(result.method).toEqual("invokescript");
      expect(result.params).toEqual(["EBES", []]);
    });

    test("script with signers", () => {
      const result = Query.invokeScript("MDAxMTIy", [
        new Signer({ account: "ab".repeat(20) }),
        {
          account: "cd".repeat(20),
          scopes: "CalledByEntry",
        },
      ]);
      expect(result.method).toEqual("invokescript");
      expect(result.params).toEqual([
        "MDAxMTIy",
        [
          {
            account: "0x" + "ab".repeat(20),
            scopes: "None",
          },
          {
            account: "cd".repeat(20),
            scopes: "CalledByEntry",
          },
        ],
      ]);
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
      expect(result.params).toEqual([
        HexString.fromHex(tx.serialize(true)).toBase64(),
      ]);
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
