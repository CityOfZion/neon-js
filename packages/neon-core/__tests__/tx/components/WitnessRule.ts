import {
  CalledByEntryWitnessCondition,
  GroupWitnessCondition,
  WitnessCondition,
  WitnessConditionType,
} from "../../../src/tx/components/WitnessCondition";
import {
  WitnessRule,
  WitnessRuleAction,
  WitnessRuleJson,
} from "../../../src/tx/components/WitnessRule";

describe("constructor", () => {
  test("empty", () => {
    const result = new WitnessRule();
    expect(result.action).toBe(WitnessRuleAction.Deny);
    expect(result.condition).toBeInstanceOf(WitnessCondition);
    expect(result.condition.type).toBe(WitnessConditionType.CalledByEntry);
  });

  test("WitnessRuleLike", () => {
    const result = new WitnessRule({
      action: 1,
      condition: {
        type: "ScriptHash",
        hash: "0".repeat(40),
      },
    });

    expect(result.action).toBe(WitnessRuleAction.Allow);
    expect(result.condition).toBeInstanceOf(WitnessCondition);
  });
});

describe("JSON", () => {
  const jsonTestCases: [string, WitnessRuleJson, WitnessRule][] = [
    [
      "base case",
      { action: "Allow", condition: { type: "CalledByEntry" } },
      new WitnessRule({
        action: 1,
        condition: new CalledByEntryWitnessCondition(),
      }),
    ],
    [
      "group",
      { action: "Deny", condition: { type: "Group", group: "0".repeat(66) } },
      new WitnessRule({
        action: WitnessRuleAction.Deny,
        condition: new GroupWitnessCondition("0".repeat(66)),
      }),
    ],
  ];

  test.each(jsonTestCases)(
    "fromJson %s",
    (_: string, json: WitnessRuleJson, neonObj: WitnessRule) => {
      const result = WitnessRule.fromJson(json);
      expect(result.action).toEqual(neonObj.action);
      expect(result.condition).toEqual(neonObj.condition);
    }
  );

  test.each(jsonTestCases)(
    "toJson %s",
    (_: string, json: WitnessRuleJson, neonObj: WitnessRule) => {
      const result = neonObj.toJson();
      expect(result).toEqual(json);
    }
  );
});
