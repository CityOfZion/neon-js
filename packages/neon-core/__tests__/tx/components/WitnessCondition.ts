import {
  AndWitnessCondition,
  BooleanWitnessCondition,
  CalledByContractWitnessCondition,
  CalledByEntryWitnessCondition,
  CalledByGroupWitnessCondition,
  GroupWitnessCondition,
  NotWitnessCondition,
  OrWitnessCondition,
  ScriptHashWitnessCondition,
  WitnessCondition,
  WitnessConditionJson,
  WitnessConditionType,
} from "../../../src/tx/components/WitnessCondition";
import { StringStream } from "../../../src/u";

describe("static", () => {
  test("json conversion", async () => {
    const input: WitnessConditionJson = {
      type: "And",
      expressions: [
        {
          type: "Boolean",
          expression: true,
        },
        {
          type: "ScriptHash",
          hash: "1".repeat(40),
        },
      ],
    };
    const result = WitnessCondition.fromJson(input);

    expect(result.type).toBe(WitnessConditionType.And);

    const castedResult = result as AndWitnessCondition;
    expect(castedResult.expressions.length).toBe(2);
    expect(castedResult.expressions[0]).toBeInstanceOf(BooleanWitnessCondition);
    expect(castedResult.expressions[1]).toBeInstanceOf(
      ScriptHashWitnessCondition
    );

    const jsonResult = result.toJson();

    expect(jsonResult).toEqual(input);
  });

  test("serialization", () => {
    const bytes =
      "1903b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c";
    const result = WitnessCondition.deserialize(new StringStream(bytes));

    expect(result.type).toBe(WitnessConditionType.Group);
    const castedResult = result as GroupWitnessCondition;
    expect(castedResult.group.toString()).toEqual(
      "03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c"
    );

    const serialized = result.serialize();

    expect(serialized).toEqual(bytes);
  });
});

describe("serialization", () => {
  test("and condition", () => {
    const input: WitnessConditionJson = {
      type: "And",
      expressions: [
        {
          type: "Boolean",
          expression: true,
        },
        {
          type: "Boolean",
          expression: false,
        },
      ],
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.And);

    const castedResult = result as AndWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("020200010000");
  });

  test("bool condition", () => {
    const input: WitnessConditionJson = {
      type: "Boolean",
      expression: true,
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.Boolean);
    const castedResult = result as BooleanWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("0001");
  });

  test("not condition", () => {
    const input: WitnessConditionJson = {
      type: "Not",
      expression: {
        type: "Boolean",
        expression: true,
      },
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.Not);

    const castedResult = result as NotWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("010001");
  });

  test("or condition", () => {
    const input: WitnessConditionJson = {
      type: "Or",
      expressions: [
        {
          type: "Boolean",
          expression: true,
        },
        {
          type: "Boolean",
          expression: false,
        },
      ],
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.Or);

    const castedResult = result as OrWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("030200010000");
  });

  test("CalledByContract condition", () => {
    const input: WitnessConditionJson = {
      type: "CalledByContract",
      hash: "0x489e98351485bbd85be99618285932172f1862e4",
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.CalledByContract);

    const castedResult = result as CalledByContractWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("28e462182f173259281896e95bd8bb851435989e48");
  });

  test("CalledByEntry condition", () => {
    const input: WitnessConditionJson = {
      type: "CalledByEntry",
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.CalledByEntry);

    const castedResult = result as CalledByEntryWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual("20");
  });

  test("CalledByGroup condition", () => {
    const input: WitnessConditionJson = {
      type: "CalledByGroup",
      group:
        "02158c4a4810fa2a6a12f7d33d835680429e1a68ae61161c5b3fbc98c7f1f17765",
    };
    const result = WitnessCondition.fromJson(input);
    expect(result.type).toBe(WitnessConditionType.CalledByGroup);

    const castedResult = result as CalledByGroupWitnessCondition;
    const bytes = castedResult.serialize();
    expect(bytes).toEqual(
      "2902158c4a4810fa2a6a12f7d33d835680429e1a68ae61161c5b3fbc98c7f1f17765"
    );
  });
});

describe("deserialization", () => {
  test("and condition", () => {
    const bytes = "020200010000";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.And);
    const castedResult = result as AndWitnessCondition;
    expect(castedResult.expressions.length).toBe(2);

    expect(castedResult.expressions[0].type).toBe(WitnessConditionType.Boolean);
    const castedExpr1 = castedResult.expressions[0] as BooleanWitnessCondition;
    expect(castedExpr1.expression).toBe(true);

    expect(castedResult.expressions[1].type).toBe(WitnessConditionType.Boolean);
    const castedExpr2 = castedResult.expressions[1] as BooleanWitnessCondition;
    expect(castedExpr2.expression).toBe(false);
  });

  test("bool condition", () => {
    const bytes = "0001";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.Boolean);
    const castedResult = result as BooleanWitnessCondition;
    expect(castedResult.expression).toBe(true);
  });

  test("not condition", () => {
    const bytes = "010001";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.Not);
    const castedResult = result as NotWitnessCondition;
    expect(castedResult.expression).toBeInstanceOf(BooleanWitnessCondition);
    const boolCondition = castedResult.expression as BooleanWitnessCondition;
    expect(boolCondition.expression).toBe(true);
  });

  test("or condition", () => {
    const bytes = "030200010000";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.Or);
    const castedResult = result as OrWitnessCondition;
    expect(castedResult.expressions.length).toBe(2);

    expect(castedResult.expressions[0].type).toBe(WitnessConditionType.Boolean);
    const castedExpr1 = castedResult.expressions[0] as BooleanWitnessCondition;
    expect(castedExpr1.expression).toBe(true);

    expect(castedResult.expressions[1].type).toBe(WitnessConditionType.Boolean);
    const castedExpr2 = castedResult.expressions[1] as BooleanWitnessCondition;
    expect(castedExpr2.expression).toBe(false);
  });

  test("CalledByContract condition", () => {
    const bytes = "28e462182f173259281896e95bd8bb851435989e48";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.CalledByContract);
    const castedResult = result as CalledByContractWitnessCondition;
    expect(castedResult.hash.toString()).toBe(
      "489e98351485bbd85be99618285932172f1862e4"
    );
  });

  test("CalledByEntry condition", () => {
    const bytes = "20";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.CalledByEntry);
  });

  test("CalledByGroup condition", () => {
    const bytes =
      "2902158c4a4810fa2a6a12f7d33d835680429e1a68ae61161c5b3fbc98c7f1f17765";
    const result = WitnessCondition.deserialize(new StringStream(bytes));
    expect(result.type).toBe(WitnessConditionType.CalledByGroup);
    const castedResult = result as CalledByGroupWitnessCondition;
    expect(castedResult.group.toString()).toBe(
      "02158c4a4810fa2a6a12f7d33d835680429e1a68ae61161c5b3fbc98c7f1f17765"
    );
  });
});
