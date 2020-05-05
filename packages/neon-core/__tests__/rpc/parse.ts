import {
  buildParser,
  Fixed8Parser,
  IntegerParser,
  NoOpParser,
  SimpleParser,
  StringParser,
} from "../../src/rpc/parse";
import { StackItemLike } from "../../src/sc";

describe("buildParser", () => {
  it("errors when input !== length of parsers", () => {
    const parser = buildParser(jest.fn(), jest.fn());
    expect(() =>
      parser({
        script: "",
        state: "HALT",
        gas_consumed: "0",
        stack: [{ type: "Integer", value: 1 }],
      })
    ).toThrow("Wrong number of items to parse!");
  });
});

describe("noOpParser", () => {
  it("returns value of item", () => {
    const expected = 123;
    const result = NoOpParser({ type: "Integer", value: expected });
    expect(result).toBe(expected);
  });
});

describe("IntegerParser", () => {
  test.each([
    ["empty string", { type: "ByteArray", value: "" }, 0],
    ["random integer", { type: "Integer", value: "9" }, 9],
  ])("%s", (msg: string, item: StackItemLike, expected: number) => {
    const result = IntegerParser(item);
    expect(result).toBe(expected);
  });
});

describe("Fixed8Parser", () => {
  test.each([
    ["0", { type: "ByteArray", value: "" }],
    ["40000", { type: "ByteArray", value: "00409452a303" }],
  ])("%s", (msg: string, item: StackItemLike) => {
    const result = Fixed8Parser(item);
    expect(result.toString()).toBe(msg);
  });
});

describe("StringParser", () => {
  test.each([
    ["RPX", { type: "ByteArray", value: "525058" }],
    ["Qlink Token", { type: "ByteArray", value: "516c696e6b20546f6b656e" }],
  ])("%s", (msg: string, item: StackItemLike) => {
    const result = StringParser(item);
    expect(result).toBe(msg);
  });
});

describe("SimpleParser", () => {
  test("parses based on type", () => {
    const result = SimpleParser({
      script: "",
      state: "HALT",
      gas_consumed: "0",
      stack: [
        { type: "ByteArray", value: "525058" },
        { type: "Integer", value: "1" },
      ],
    });
    expect(result).toEqual(["RPX", 1]);
  });

  test("errors when meeting unknown type", () => {
    expect(() =>
      SimpleParser({
        script: "",
        state: "HALT",
        gas_consumed: "0",
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        stack: [{ type: "Weird", value: null }],
      })
    ).toThrow("Unknown type");
  });
});
