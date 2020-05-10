import {
  WitnessScope,
  parse,
  toString,
} from "../../../src/tx/components/WitnessScope";

describe("parse", () => {
  test.each([
    ["null", "", WitnessScope.Global],
    ["single CallByEntry", "CalledByEntry", WitnessScope.CalledByEntry],
    ["single Global", "Global", WitnessScope.Global],
    ["single CustomContracts", "CustomContracts", WitnessScope.CustomContracts],
    [
      "all",
      "CalledByEntry,  CustomContracts,CustomGroups",
      WitnessScope.CalledByEntry |
        WitnessScope.CustomContracts |
        WitnessScope.CustomGroups,
    ],
  ])("%s", (_: string, stringFlags: string, expected: WitnessScope) => {
    const result = parse(stringFlags);
    expect(result).toEqual(expected);
  });
});

describe("toString", () => {
  test.each([
    ["single CallByEntry", "CalledByEntry", WitnessScope.CalledByEntry],
    ["single Global", "Global", WitnessScope.Global],
    ["single CustomContracts", "CustomContracts", WitnessScope.CustomContracts],
    [
      "all",
      "CalledByEntry,CustomContracts,CustomGroups",
      WitnessScope.CalledByEntry |
        WitnessScope.CustomContracts |
        WitnessScope.CustomGroups,
    ],
  ])("%s", (_: string, expected: string, flag: WitnessScope) => {
    const result = toString(flag);
    expect(result).toEqual(expected);
  });
});
