import StringStream from "../../src/u/StringStream";

describe("constructor", () => {
  test.each([[""], ["0102030405"], "randomstring"])(
    "construct with %s",
    (data: string) => {
      const result = new StringStream(data);
      expect(result.str).toBe(data);
    }
  );
});

describe("isEmpty", () => {
  test("empty string is always empty", () => {
    const result = new StringStream();
    expect(result.isEmpty()).toBeTruthy();
  });

  test("isEmpty when correct number of bytes read off", () => {
    const ss = new StringStream("0102030405");
    for (let i = 0; i < 4; i++) {
      ss.read();
      expect(ss.isEmpty()).toBeFalsy();
    }
    ss.read();
    expect(ss.isEmpty()).toBeTruthy();
  });
});

describe("peek", () => {
  test("peek does not move pter", () => {
    const ss = new StringStream("0102030405");
    const peek1 = ss.peek();
    const peek2 = ss.peek();
    expect(peek1).toBe(peek2);
  });

  test.each([
    [1, "01"],
    [2, "0102"],
    [3, "010203"],
    [4, "01020304"],
    [5, "0102030405"],
    [6, "0102030405"],
  ])(
    "peek returns number of bytes indicated",
    (num: number, expected: string) => {
      const ss = new StringStream("0102030405");
      const result = ss.peek(num);
      expect(result).toBe(expected);
    }
  );
});

describe("reading", () => {
  test("reads byte", () => {
    const bytes = ["01", "02", "03", "04", "05"];
    const ss = new StringStream(bytes.join(""));
    for (const b of bytes) {
      const readByte = ss.read();
      expect(readByte).toBe(b);
    }
  });

  test("reads multiple bytes", () => {
    const ss = new StringStream("0102030405");
    const result = ss.read(3);
    expect(result).toBe("010203");
  });
});

describe("readVarBytes", () => {
  test.each([
    ["uint8", "05"],
    ["uint16", "fd0500"],
    ["uint32", "fe05000000"],
    ["uint64", "ff0500000000000000"],
  ])("%s", (msg: string, data: string) => {
    const expected = "0102030405";
    const ss = new StringStream(data + expected);
    const result = ss.readVarBytes();
    expect(result).toBe(expected);
  });
});
