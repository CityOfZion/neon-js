import { OpCode, OpToken } from "../../src/sc";

describe("constructor", () => {
  test("opcode", () => {
    const result = new OpToken(OpCode.SYSCALL);

    expect(result).toBeInstanceOf(OpToken);
    expect(result.code).toBe(OpCode.SYSCALL);
    expect(result.params).toBe(undefined);
  });

  test("opcode and params", () => {
    const result = new OpToken(OpCode.SYSCALL, "abcdefgh");

    expect(result).toBeInstanceOf(OpToken);
    expect(result.code).toBe(OpCode.SYSCALL);
    expect(result.params).toBe("abcdefgh");
  });
});

describe("toInstruction", () => {
  test("opcode", () => {
    const result = new OpToken(OpCode.SYSCALL).toInstruction();

    expect(result).toBe("SYSCALL");
  });

  test("opcode and params", () => {
    const result = new OpToken(OpCode.SYSCALL, "01020304").toInstruction();

    expect(result).toBe("SYSCALL 01020304");
  });
});

describe("fromScript", () => {
  test.each([
    ["empty", "", []],
    ["single opcode", "0b", [new OpToken(OpCode.PUSHNULL)]],
    [
      "single opcode with params",
      "4101020304",
      [new OpToken(OpCode.SYSCALL, "01020304")],
    ],
  ])("%s", (_: string, script: string, tokens: OpToken[]) => {
    const result = OpToken.fromScript(script);

    expect(result).toEqual(expect.arrayContaining(tokens));
  });
});
