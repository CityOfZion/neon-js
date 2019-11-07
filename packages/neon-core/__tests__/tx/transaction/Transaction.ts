import {
  Transaction,
  TransactionLike,
  Witness,
  WitnessScope,
  TransactionAttribute
} from "../../../src/tx";
import samples from "./Transaction.json";
import { Account } from "../../../src/wallet";
import { str2hexstring } from "../../../src/u";

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
      "4c5f49fd484037109d11358c6054f637c0414ee4018a91316e0925a87fe26ac0"
    );
  });

  test("signers", () => {
    const tx = new Transaction({
      sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
      cosigners: [
        {
          account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
          scopes: WitnessScope.Global
        }
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
    cosigners: [],
    systemFee: 12,
    networkFee: 13,
    validUntilBlock: 1000,
    attributes: [],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    script: "00"
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

  test("addCosigner", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addCosigner({
      account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
      scopes: WitnessScope.Global
    });
    expect(tx1.cosigners[0].account).toBe(
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    );
    expect(tx1.cosigners[0].scopes).toBe(WitnessScope.Global);
    const addDuplicate = function() {
      tx1.addCosigner({
        account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
        scopes: WitnessScope.Global
      });
    };
    expect(addDuplicate).toThrowError();
  });

  test("addAttribute", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addAttribute(
      new TransactionAttribute({
        usage: 129,
        data: "72e9a2"
      })
    );
    expect(tx1.attributes[0].usage).toBe(129);
    expect(tx1.attributes[0].data).toBe("72e9a2");
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
      "40ab51e521a287dfeb83a51b1444ca31fbdc88d2181c156e65d30b3423d24bed693feb5ac8511c24efd766c664a3b09ec9cf2e24588226aab16175d84dc0fcbeea"
    );
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
