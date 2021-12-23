import {
  AndWitnessCondition,
  BooleanWitnessCondition,
  GroupWitnessCondition,
  ScriptHashWitnessCondition,
  WitnessCondition,
  WitnessConditionType,
} from "../../../src/tx/components/WitnessCondition";
import { StringStream } from "../../../src/u";

describe("static", async () => {
  test("json conversion", async () => {
    const result = WitnessCondition.fromJson({
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
    });

    expect(result.type).toBe(WitnessConditionType.And);

    const castedResult = result as AndWitnessCondition;
    expect(castedResult.expressions.length).toBe(2);
    expect(castedResult.expressions[0]).toBeInstanceOf(BooleanWitnessCondition);
    expect(castedResult.expressions[1]).toBeInstanceOf(
      ScriptHashWitnessCondition
    );

    const jsonResult = result.toJson();

    expect(jsonResult).toEqual(result);
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
