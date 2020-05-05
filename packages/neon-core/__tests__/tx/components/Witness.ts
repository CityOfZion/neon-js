import Witness, { WitnessLike } from "../../../src/tx/components/Witness";
import { Account } from "../../../src/wallet";

describe("constructor", () => {
  test("empty", () => {
    const f = (): Witness => new Witness(undefined);
    expect(f).toThrow(
      "Witness requires invocationScript and verificationScript fields"
    );
  });

  test("WitnessLike", () => {
    const testObject = {
      invocationScript: "ab",
      verificationScript: "cd",
    } as WitnessLike;

    const result = new Witness(testObject);
    expect(result instanceof Witness).toBeTruthy();
    expect(result.invocationScript.toBigEndian()).toEqual(
      testObject.invocationScript
    );
    expect(result.verificationScript.toBigEndian()).toEqual(
      testObject.verificationScript
    );
  });

  test("Witness", () => {
    const testObject = new Witness({
      invocationScript: "ab",
      verificationScript: "cd",
    });

    const result = new Witness(testObject);
    expect(result instanceof Witness).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.invocationScript).toEqual(testObject.invocationScript);
    expect(result.verificationScript).toEqual(testObject.verificationScript);
  });
});

describe("ScriptHash property", () => {
  it("getter", () => {
    const testObject = new Witness({
      invocationScript:
        "4051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b20783",
      verificationScript:
        "21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa",
    });

    expect(testObject.scriptHash).toEqual(
      "dec317f6e4335db8a98418bd16960bf4e7fce4c7"
    );
  });
});

describe("export", () => {
  test("export to WitnessLike", () => {
    const expected = {
      invocationScript: "ab",
      verificationScript: "cd",
    };

    const txAttr = new Witness(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1: WitnessLike = {
    invocationScript: "ab",
    verificationScript: "cd",
  };
  const obj2: WitnessLike = {
    invocationScript: "ef",
    verificationScript: "12",
  };
  const witness1 = new Witness(obj1);
  const witness2 = new Witness(obj2);

  test.each([
    ["Witness1 === Witness1", witness1, witness1, true],
    ["Witness1 !== Witness2", witness1, witness2, false],
    ["Witness1 === Obj1", witness1, obj1, true],
    ["Witness1 !== Obj2", witness1, obj2, false],
  ])(
    "%s",
    (_msg: string, a: Witness, b: Partial<WitnessLike>, cond: boolean) => {
      expect(a.equals(b)).toBe(cond);
    }
  );
});

const dataSet = [
  [
    "Basic Output",
    {
      invocationScript:
        "4051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b20783",
      verificationScript:
        "21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa",
    },
    "414051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b207832721031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa",
  ],
];

describe("serialize", () => {
  test.each(dataSet)(
    "%s",
    (_msg: string, data: WitnessLike, expected: string) => {
      const result = new Witness(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (_msg: string, expected: WitnessLike, data: string) => {
      const result = Witness.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});

describe.skip("buildMultiSig", () => {
  const msg = "1234";
  const signatures = [
    "e634f503454fc99d72aa3ab6048cb0cf33ed2afec8c9f38a6c4b87126f0da6c62e39205c86178d95a191ec76fb09b2380b8df1074ea62e02cb9d4a5e1c6372a2",
    "f81e7b0ac2e415dac37bf189827f2e716c53e383faf973d9e222bbb44bb0c55d181726460397a90e9f26013ac3eb17019f0667d78915d5d7ded4d9f87ef785ac",
    "9ed10d60df8d8ac2fe719448ea732638963649f41c44bdbe6eb10e7dd7d6c5c71d82738f1d33c58fe8350f5c4c51b388a41c32768b598afb978f08a56eef72d7",
  ];

  const witnesses = [
    new Witness({
      invocationScript:
        "40e634f503454fc99d72aa3ab6048cb0cf33ed2afec8c9f38a6c4b87126f0da6c62e39205c86178d95a191ec76fb09b2380b8df1074ea62e02cb9d4a5e1c6372a2",
      verificationScript:
        "2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef68747476aa",
    }),
    new Witness({
      invocationScript:
        "40f81e7b0ac2e415dac37bf189827f2e716c53e383faf973d9e222bbb44bb0c55d181726460397a90e9f26013ac3eb17019f0667d78915d5d7ded4d9f87ef785ac",
      verificationScript:
        "21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa",
    }),
    new Witness({
      invocationScript:
        "409ed10d60df8d8ac2fe719448ea732638963649f41c44bdbe6eb10e7dd7d6c5c71d82738f1d33c58fe8350f5c4c51b388a41c32768b598afb978f08a56eef72d7",
      verificationScript:
        "2102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa68747476aa",
    }),
  ];
  const orderedSigExpectedInvocationScript = [signatures[0], signatures[1]]
    .map((s) => "40" + s)
    .join("");
  const verificationScript =
    "522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa5368c7c34cba";

  const account = new Account({
    address: "ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd",
    contract: {
      script:
        "522102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa5368c7c34cba",
      parameters: [
        { name: "parameter0", type: "Signature" },
        { name: "parameter1", type: "Signature" },
      ],
      deployed: false,
    },
  });
  test.each([
    [
      "constructs Witness given correctly ordered signatures",
      msg,
      signatures,
      verificationScript,
      orderedSigExpectedInvocationScript,
    ],
    [
      "constructs Witness given unordered signatures",
      msg,
      [signatures[1], signatures[2], signatures[0]],
      verificationScript,
      orderedSigExpectedInvocationScript,
    ],
    [
      "constructs Witness given unordered individual witnesses",
      msg,
      [witnesses[1], witnesses[2], witnesses[0]],
      verificationScript,
      orderedSigExpectedInvocationScript,
    ],
    [
      "constructs Witness given random signatures/witnesses and Account",
      msg,
      [signatures[1], signatures[2], witnesses[0]],
      account,
      orderedSigExpectedInvocationScript,
    ],
  ])(
    "%s",
    (
      _: string,
      tx: string,
      sigs: (Witness | string)[],
      vScript: string | Account,
      expectedInvocationScript: string
    ) => {
      const result = Witness.buildMultiSig(tx, sigs, vScript);

      expect(result.verificationScript.toBigEndian()).toEqual(
        verificationScript
      );
      expect(result.invocationScript.toBigEndian()).toEqual(
        expectedInvocationScript
      );
    }
  );

  test("throws if invalid signature given", () => {
    const wrongSigs = [signatures[0].replace("1", "0"), signatures[1]];
    const throwingFunc = (): Witness =>
      Witness.buildMultiSig(msg, wrongSigs, verificationScript);
    expect(throwingFunc).toThrowError("Invalid signature given");
  });

  test("throws if insufficient signatures", () => {
    const oneSig = [signatures[1]];
    const throwingFunc = (): Witness =>
      Witness.buildMultiSig(msg, oneSig, verificationScript);
    expect(throwingFunc).toThrowError("Insufficient signatures");
  });
});
