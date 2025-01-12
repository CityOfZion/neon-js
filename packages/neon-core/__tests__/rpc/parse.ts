import {
  buildParser,
  IntegerParser,
  NoOpParser,
  SimpleParser,
  StringParser,
} from "../../src/rpc/parse";
import { StackItemJson } from "../../src/sc";

describe("buildParser", () => {
  it("errors when input !== length of parsers", () => {
    const parser = buildParser(jest.fn(), jest.fn());
    expect(() =>
      parser({
        script: "",
        state: "HALT",
        gasconsumed: "0",
        stack: [{ type: "Integer", value: "1" }],
        exception: null,
      }),
    ).toThrow("Wrong number of items to parse!");
  });
});

describe("noOpParser", () => {
  it("returns value of item", () => {
    const expected = "123";
    const result = NoOpParser({ type: "Integer", value: expected });
    expect(result).toBe(expected);
  });
});

describe("IntegerParser", () => {
  test.each([
    ["empty string", { type: "ByteString", value: "" }, 0],
    ["random integer", { type: "Integer", value: "9" }, 9],
  ] as [string, StackItemJson, number][])(
    "%s",
    (_msg: string, item: StackItemJson, expected: number) => {
      const result = IntegerParser(item);
      expect(result).toBe(expected);
    },
  );
});

describe("StringParser", () => {
  test.each([
    ["RPX", { type: "ByteString", value: "525058" }],
    ["Qlink Token", { type: "ByteArray", value: "516c696e6b20546f6b656e" }],
  ] as [string, StackItemJson][])("%s", (msg: string, item: StackItemJson) => {
    const result = StringParser(item);
    expect(result).toBe(msg);
  });
});

describe("SimpleParser", () => {
  test("parses based on type", () => {
    const result = SimpleParser({
      script: "",
      state: "HALT",
      gasconsumed: "0",
      stack: [
        { type: "ByteString", value: "525058" },
        { type: "Integer", value: "1" },
      ],
      exception: null,
    });
    expect(result).toEqual(["RPX", 1]);
  });

  test("errors when meeting unknown type", () => {
    expect(() =>
      SimpleParser({
        script: "",
        state: "HALT",
        gasconsumed: "0",

        // @ts-expect-error Providing unknown types outside of TS
        stack: [{ type: "Weird", value: null }],
      }),
    ).toThrow("Unknown type");
  });
});
