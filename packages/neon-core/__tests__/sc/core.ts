import { createScript } from "../../src/sc/core";
import * as _u from "../../src/u";
import testIntents from "./scriptIntents.json";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createScript", () => {
  test("single ScriptIntent", () => {
    const result = createScript(testIntents[1].scriptIntent);
    expect(result).toBe(testIntents[1].script);
  });

  test("hexstring", () => {
    const input1 = "ab";
    const input2 = "cd";
    const result = createScript(input1, input2);
    expect(result).toBe("abcd");
  });

  test("multiple ScriptIntents", () => {
    const intents = [testIntents[1], testIntents[2]];
    const input = intents.map((i) => i.scriptIntent);
    const expected = intents.map((i) => i.script).join("");
    const result = createScript(...input);
    expect(result).toBe(expected);
  });
});
