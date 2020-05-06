import {
  Transaction,
  TransactionLike,
  WitnessScope,
  TransactionJson,
} from "../../../src/tx";
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
    expect(result.script.toBigEndian()).toEqual("");
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      nonce: 1,
      validUntilBlock: 1000,
      systemFee: 1,
      networkFee: 10,
      script: "00",
    } as Partial<TransactionLike>;

    const result = new Transaction(testObject);
    expect(result instanceof Transaction).toBeTruthy();
    expect(result.version).toBe(testObject.version);
    expect(result.nonce).toBe(testObject.nonce);
    expect(result.validUntilBlock).toBe(testObject.validUntilBlock);
    expect(result.systemFee.toNumber()).toBe(testObject.systemFee);
    expect(result.networkFee.toNumber()).toBe(testObject.networkFee);
    expect(result.script.toBigEndian()).toEqual(testObject.script);
  });

  test("Transaction", () => {
    const testObject = new Transaction({
      version: 1,
      witnesses: [{ invocationScript: "ab", verificationScript: "cd" }],
      systemFee: 1,
      script: "00",
    });

    const result = new Transaction(testObject);
    expect(result instanceof Transaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.script).toStrictEqual(testObject.script);
    expect(result.witnesses[0]).not.toBe(testObject.witnesses[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new Transaction({
      systemFee: 2,
      networkFee: 4,
    });
    expect(tx.fees).toBe(6);
  });

  test("hash", () => {
    const tx = new Transaction({
      nonce: 12345,
      validUntilBlock: 1000,
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
          scopes: WitnessScope.Global,
        },
      ],
    });
    expect(tx.getScriptHashesForVerifying()).toStrictEqual([
      "39e9c91012be63a58504e52b7318c1274554ae3d",
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
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
    witnesses: [{ invocationScript: "ab", verificationScript: "cd" }],
    script: "00",
  } as Partial<TransactionLike>;

  const transaction = new Transaction(expected);
  const result = transaction.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1: Partial<TransactionLike> = {
    version: 0,
    nonce: 123,
    sender: "39e9c91012be63a58504e52b7318c1274554ae3d",
    systemFee: 12,
    networkFee: 13,
    validUntilBlock: 1000,
    attributes: [],
    witnesses: [{ invocationScript: "ab", verificationScript: "cd" }],
    script: "00",
  };

  const obj2: Partial<TransactionLike> = {
    version: 0,
    nonce: 1234,
    sender: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
    systemFee: 12,
    networkFee: 1,
    validUntilBlock: 1000,
    attributes: [],
    witnesses: [{ invocationScript: "ab", verificationScript: "cd" }],
    script: "00",
  };
  const tx1 = new Transaction(obj1);
  const tx2 = new Transaction(obj2);

  test.each([
    ["Invocation1 === Invocation1", tx1, tx1, true],
    ["Invocation1 !== Invocation2", tx1, tx2, false],
    ["Invocation1 === Obj1", tx1, obj1, true],
    ["Invocation1 !== Obj2", tx1, obj2, false],
  ])(
    "%s",
    (
      _msg: string,
      a: Transaction,
      b: Partial<TransactionLike>,
      cond: boolean
    ) => {
      expect(a.equals(b)).toBe(cond);
    }
  );
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
      witnesses: [],
      script: "00",
    });
  }

  test("addCosigner", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addCosigner({
      account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
      scopes: WitnessScope.Global,
    });
    expect(tx1.cosigners[0].account.toBigEndian()).toBe(
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    );
    expect(tx1.cosigners[0].scopes).toBe(WitnessScope.Global);
    const addDuplicate = (): Transaction =>
      tx1.addCosigner({
        account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
        scopes: WitnessScope.Global,
      });
    expect(addDuplicate).toThrowError();
  });

  test("addAttribute", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addAttribute({
      usage: 129,
      data: "72e9a2",
    });
    expect(tx1.attributes[0].usage).toBe(129);
    expect(tx1.attributes[0].data.toBigEndian()).toBe("72e9a2");
  });

  test("addWitness", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addWitness({
      invocationScript: "ab",
      verificationScript:
        "4c210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba0b680a906ad4",
    });
    expect(tx1.witnesses[0].invocationScript.toBigEndian()).toBe("ab");
    expect(tx1.witnesses[0].verificationScript.toBigEndian()).toBe(
      "4c210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba0b680a906ad4"
    );
  });

  test("sign", () => {
    const tx1 = createTxforTestAddMethods();
    const account = new Account(
      "9600debdb033bae62179baadb439c65088a450d5eecff782f641778fab23e21d"
    );
    tx1.witnesses = [];
    tx1.sign(account);
    expect(tx1.witnesses[0].verificationScript.toBigEndian()).toBe(
      "0c210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba0b410a906ad4"
    );
    expect(tx1.witnesses[0].invocationScript.toBigEndian()).toBe(
      "40fa815c5d09d985e1a083a6a8492b42c1bfe769bd792134b3dacac14020c089792bac252f73781658a2c0828fa0c132de9e8a0946293ab9b4750d5d38936f39d4"
    );
  });
});

const dataSet = Object.keys(samples).map((k) => {
  const s = samples[k];
  return [s.txid, s.serialized, s.deserialized];
});

describe.each(dataSet)(
  "transform %s",
  (_: string, serialized: string, json: TransactionJson) => {
    const neonObj = Transaction.fromJson(json);
    const deserialized = Transaction.deserialize(serialized);
    test("deserialize", () => {
      expect(deserialized).toEqual(neonObj);
    });

    test("toJson", () => {
      const result = deserialized.toJson();
      expect(result).toEqual(json);
    });

    test("serialize", () => {
      const result = deserialized.serialize(true);
      expect(result).toEqual(serialized);
    });
  }
);
