import { Transaction, TransactionLike, Witness } from "../../../src/tx";
import samples from "./Transaction.json";
import { Account } from "../../../src/wallet";

describe("constructor", () => {
  test("empty", () => {
    const result = new Transaction();

    expect(result instanceof Transaction).toBeTruthy();
    expect(result.version).toBe(0);
    expect(result.nonce).toBeDefined();
    expect(result.validUntilBlock).toBeDefined();
    expect(result.systemFee.toNumber()).toBe(0);
    expect(result.networkFee.toNumber()).toBe(0);
    expect(result.script).toEqual("");
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      nonce: 1,
      validUntilBlock: 1000,
      systemFee: 1,
      networkFee: 10,
      script: "00"
    } as Partial<TransactionLike>;

    const result = new Transaction(testObject);
    expect(result instanceof Transaction).toBeTruthy();
    expect(result.version).toBe(testObject.version);
    expect(result.nonce).toBe(testObject.nonce);
    expect(result.validUntilBlock).toBe(testObject.validUntilBlock);
    expect(result.systemFee.toNumber()).toBe(testObject.systemFee);
    expect(result.networkFee.toNumber()).toBe(testObject.networkFee);
    expect(result.script).toEqual(testObject.script);
  });

  test("Transaction", () => {
    const testObject = new Transaction({
      version: 1,
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      systemFee: 1,
      script: "00"
    });

    const result = new Transaction(testObject);
    expect(result instanceof Transaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.script).toBe(testObject.script);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });

  test("Intents", () => {
    const testObject = {
      intents: [{ scriptHash: "NEO", operation: "transfer", args: [10] }],
      script: "00"
    } as Partial<TransactionLike>;

    const result = new Transaction(testObject);
    expect(result.script).toBe("005a51c1087472616e736665726845c49284");
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new Transaction({
      systemFee: 2,
      networkFee: 4
    });
    expect(tx.fees).toBe(6);
  });

  test("hash", () => {
    const tx = new Transaction({
      nonce: 12345,
      validUntilBlock: 1000
    });
    expect(tx.hash).toBe(
      "cb1715e1649b7c37ac8bc8856dda05e9a0888f4103b1307d60ddaa96f4c26c31"
    );
  });

  test("signers", () => {
    const tx = new Transaction({
      sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
      attributes: [
        { usage: "Cosigner", data: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26" }
      ]
    });
    expect(tx.getScriptHashesForVerifying()).toStrictEqual([
      "39e9c91012be63a58504e52b7318c1274554ae3d",
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    ]);
  });
});

describe("export", () => {
  const expected = {
    version: 1,
    nonce: 123,
    sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
    systemFee: 12,
    networkFee: 13,
    validUntilBlock: 1000,
    attributes: [],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    script: "00",
    intents: []
  } as Partial<TransactionLike>;

  const transaction = new Transaction(expected);
  const result = transaction.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    version: 0,
    nonce: 123,
    sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
    systemFee: 12,
    networkFee: 13,
    validUntilBlock: 1000,
    attributes: [],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    script: "00"
  };

  const obj2 = {
    version: 0,
    nonce: 1234,
    sender: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
    systemFee: 12,
    networkFee: 1,
    validUntilBlock: 1000,
    attributes: [],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    script: "00"
  };
  const tx1 = new Transaction(obj1);
  const tx2 = new Transaction(obj2);

  test.each([
    ["Invocation1 === Invocation1", tx1, tx1, true],
    ["Invocation1 !== Invocation2", tx1, tx2, false],
    ["Invocation1 === Obj1", tx1, obj1, true],
    ["Invocation1 !== Obj2", tx1, obj2, false]
  ])("%s", (msg: string, a: Transaction, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

describe("Add Methods", () => {
  function createTxforTestAddMethods(): Transaction {
    return new Transaction({
      version: 0,
      nonce: 123,
      sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
      systemFee: 12,
      networkFee: 13,
      validUntilBlock: 1000,
      attributes: [],
      scripts: [],
      script: "00"
    });
  }

  test("addAttribute", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addAttribute(32, "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26");
    expect(tx1.attributes[0].usage).toBe(32);
    expect(tx1.attributes[0].data).toBe(
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    );
  });

  test("addWitness", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addWitness(
      new Witness({
        invocationScript: "ab",
        verificationScript:
          "210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba68747476aa"
      })
    );
    expect(tx1.scripts[0].invocationScript).toBe("ab");
    expect(tx1.scripts[0].verificationScript).toBe(
      "210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba68747476aa"
    );
  });

  test("sign", () => {
    const tx1 = createTxforTestAddMethods();
    const account = new Account(
      "9600debdb033bae62179baadb439c65088a450d5eecff782f641778fab23e21d"
    );
    tx1.scripts = [];
    tx1.sign(account);
    expect(tx1.scripts[0].verificationScript).toBe(
      "210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba68747476aa"
    );
    expect(tx1.scripts[0].invocationScript).toBe(
      "4073b9a44d007966c19e3010202aeed6dd9a158ab2b49d42eb14a3ab43509112674117a3e4cb0c9eadb45e93db621a3d0d6aa1a66086dc55b08a8e28de740e7dd7"
    );
  });

  test("addIntents", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addIntents({ scriptHash: "NEO", operation: "transfer", args: [10] });
    expect(tx1.intents.length).toBe(1);
    expect(tx1.script).toBe("005a51c1087472616e736665726845c49284");
  });
});

describe("Fee Related", () => {
  function createTxforTestFeeMethods(): Transaction {
    return new Transaction({
      version: 0,
      nonce: 123,
      sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
      systemFee: 12,
      networkFee: 0,
      validUntilBlock: 1000,
      attributes: [],
      scripts: [],
      intents: [{ scriptHash: "NEO", operation: "transfer", args: [10] }]
    });
  }

  describe("calculateNetworkFee", () => {
    test("true as param to assign networkFee", () => {
      const tx1 = createTxforTestFeeMethods();
      tx1.calculateNetworkFee(true);
      expect(tx1.networkFee.toNumber()).toBe(0.0115024);
    });

    test("false as param to assign networkFee", () => {
      const tx1 = createTxforTestFeeMethods();
      tx1.calculateNetworkFee(false);
      expect(tx1.networkFee.toNumber()).toBe(0);
    });
  });

  test("useCalculatedSystemFee", () => {
    const tx1 = createTxforTestFeeMethods();
    tx1.useCalculatedSystemFee();
    expect(tx1.systemFee.toNumber()).toBe(0.0800718);
  });

  test("regulateSystemFee", () => {
    const tx1 = createTxforTestFeeMethods();
    tx1.useCalculatedSystemFee();
    tx1.regulateSystemFee();
    expect(tx1.systemFee.toNumber()).toBe(1);
  });
});

const dataSet = Object.keys(samples).map(k => {
  const s = samples[k];
  return [s.txid, s.serialized, s.deserialized];
});

describe.each(dataSet)(
  "%s",
  (
    txid: string,
    serialized: string,
    deserialized: Partial<TransactionLike>
  ) => {
    let tx: Transaction;
    test("Serialize properly", () => {
      tx = new Transaction(deserialized);
      expect(tx.serialize()).toBe(serialized);
    });

    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof Transaction).toBeTruthy();
    });

    test("exports properly", () => {
      const result = tx.export();
      expect(result).toEqual(deserialized);
    });

    test("produce correct hash", () => {
      expect(tx.hash).toEqual(txid);
    });
  }
);
