import Witness, { WitnessLike } from "../../../src/tx/components/Witness";

describe("constructor", () => {
  test("empty", () => {
    const f = () => new Witness();
    expect(f).toThrow(
      "Witness requires invocationScript and verificationScript fields"
    );
  });

  test("WitnessLike", () => {
    const testObject = {
      invocationScript: "ab",
      verificationScript: "cd"
    } as WitnessLike;

    const result = new Witness(testObject);
    expect(result instanceof Witness).toBeTruthy();
    expect(result.invocationScript).toEqual(testObject.invocationScript);
    expect(result.verificationScript).toEqual(testObject.verificationScript);
  });

  test("Witness", () => {
    const testObject = new Witness({
      invocationScript: "ab",
      verificationScript: "cd"
    });

    const result = new Witness(testObject);
    expect(result instanceof Witness).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to WitnessLike", () => {
    const expected = {
      invocationScript: "ab",
      verificationScript: "cd"
    };

    const txAttr = new Witness(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    invocationScript: "ab",
    verificationScript: "cd"
  };
  const obj2 = {
    invocationScript: "fg",
    verificationScript: ""
  };
  const witness1 = new Witness(obj1);
  const witness2 = new Witness(obj2);

  test.each([
    ["Witness1 === Witness1", witness1, witness1, true],
    ["Witness1 !== Witness2", witness1, witness2, false],
    ["Witness1 === Obj1", witness1, obj1, true],
    ["Witness1 !== Obj2", witness1, obj2, false]
  ])("%s", (msg: string, a: Witness, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Basic Output",
    {
      invocationScript:
        "4051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b20783",
      verificationScript:
        "21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac"
    },
    "414051c2e6e2993c6feb43383131ed2091f4953747d3e16ecad752cdd90203a992dea0273e98c8cd09e9bfcf2dab22ce843429cdf0fcb9ba4ac93ef1aeef40b207832321031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac"
  ]
];

describe("serialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, data: WitnessLike, expected: string) => {
      const result = new Witness(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, expected: WitnessLike, data: string) => {
      const result = Witness.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});
