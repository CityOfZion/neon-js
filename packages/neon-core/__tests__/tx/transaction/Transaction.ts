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
    expect(parseFloat(result.systemFee.toDecimal(8))).toBe(0);
    expect(parseFloat(result.networkFee.toDecimal(8))).toBe(0);
    expect(result.script.toBigEndian()).toEqual("");
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      nonce: 1,
      validUntilBlock: 1000,
      systemFee: "1",
      networkFee: "10",
      script: "00",
    } as Partial<TransactionLike>;

    const result = new Transaction(testObject);
    expect(result instanceof Transaction).toBeTruthy();
    expect(result.version).toBe(testObject.version);
    expect(result.nonce).toBe(testObject.nonce);
    expect(result.validUntilBlock).toBe(testObject.validUntilBlock);
    expect(result.systemFee.toString()).toBe(testObject.systemFee);
    expect(result.networkFee.toString()).toBe(testObject.networkFee);
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
    expect(tx.fees).toBe("6");
  });

  test("sender", () => {
    const tx = new Transaction({
      signers: [
        {
          account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
          scopes: WitnessScope.Global,
        },
        {
          account: "39e9c91012be63a58504e52b7318c1274554ae3d",
          scopes: WitnessScope.CustomContracts,
        },
      ],
    });

    expect(tx.sender.toBigEndian()).toBe(
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    );
  });

  test("signers", () => {
    const tx = new Transaction({
      signers: [
        {
          account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
          scopes: WitnessScope.Global,
        },
        {
          account: "39e9c91012be63a58504e52b7318c1274554ae3d",
          scopes: WitnessScope.CustomContracts,
        },
      ],
    });
    expect(tx.getScriptHashesForVerifying()).toStrictEqual([
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
      "39e9c91012be63a58504e52b7318c1274554ae3d",
    ]);
  });
});

describe("export", () => {
  const expected = {
    version: 1,
    nonce: 123,
    systemFee: "12",
    networkFee: "13",
    validUntilBlock: 1000,
    signers: [
      {
        account: "39e9c91012be63a58504e52b7318c1274554ae3d",
        scopes: WitnessScope.Global,
      },
    ],
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
    systemFee: 12,
    networkFee: 13,
    validUntilBlock: 1000,
    signers: [
      {
        account: "39e9c91012be63a58504e52b7318c1274554ae3d",
        scopes: WitnessScope.Global,
      },
    ],
    attributes: [],
    witnesses: [{ invocationScript: "ab", verificationScript: "cd" }],
    script: "00",
  };

  const obj2: Partial<TransactionLike> = {
    version: 0,
    nonce: 1234,
    systemFee: 12,
    networkFee: 1,
    validUntilBlock: 1000,
    signers: [
      {
        account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
        scopes: WitnessScope.Global,
      },
    ],
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
      b: Partial<TransactionLike | Transaction>,
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
      systemFee: "1200000000",
      networkFee: "1300000000",
      validUntilBlock: 1000,
      signers: [
        {
          account: "39e9c91012be63a58504e52b7318c1274554ae3d",
          scopes: WitnessScope.Global,
        },
      ],
      attributes: [],
      witnesses: [],
      script: "00",
    });
  }

  test("addCosigner", () => {
    const tx1 = createTxforTestAddMethods();
    tx1.addSigner({
      account: "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26",
      scopes: WitnessScope.Global,
    });
    expect(tx1.signers[1].account.toBigEndian()).toBe(
      "9b58c48f384a4cf14d98c97fc09a9ba9c42d0e26"
    );
    expect(tx1.signers[1].scopes).toBe(WitnessScope.Global);
    const addDuplicate = (): Transaction =>
      tx1.addSigner({
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
    tx1.sign(account, 1024);
    expect(tx1.witnesses[0].verificationScript.toBigEndian()).toBe(
      "0c210317595a739cfe90ea90b6392814bcdebcd4c920cb149d0ac2d88676f1b0894fba4156e7b327"
    );
    expect(tx1.witnesses[0].invocationScript.toBigEndian()).toBe(
      "0c408fb54a60e1763ec91876f57e6133e7f6e86b11525f016fe26cf85a15f1d8b24d5cc50f3269b64dc0450d32887c8dc73a21ff33bab7547c53f5745165625e2900"
    );
  });
});

const dataSet: [string, string, TransactionJson][] = Object.keys(samples).map(
  (k) => {
    const s = samples[k as keyof typeof samples];
    return [s.txid, s.serialized, s.deserialized];
  }
);

describe.each(dataSet)(
  "transform %s",
  (txid: string, serialized: string, json: TransactionJson) => {
    const neonObj = Transaction.fromJson(json);
    const deserialized = Transaction.deserialize(serialized);
    test("deserialize", () => {
      expect(deserialized).toEqual(neonObj);
    });

    test("toJson", () => {
      const result = deserialized.toJson();
      expect(result).toEqual(Object.assign({}, json, { sender: "" }));
    });

    test("serialize", () => {
      const result = deserialized.serialize(true);
      expect(result).toEqual(serialized);
    });

    test("hash", () => {
      const result = neonObj.hash();
      expect(result).toEqual(txid);
    });
  }
);
