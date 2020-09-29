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

describe("prettyPrint", () => {
  test("opcode", () => {
    const result = new OpToken(OpCode.SYSCALL).prettyPrint();

    expect(result).toBe("SYSCALL");
  });

  test("opcode and params", () => {
    const result = new OpToken(OpCode.SYSCALL, "01020304").prettyPrint();

    expect(result).toBe("SYSCALL      01020304");
  });

  test("custom padding", () => {
    const result = OpToken.fromScript("210c0500000000014101020304").map((t) =>
      t.prettyPrint(8)
    );

    expect(result).toEqual([
      "NOP",
      "PUSHDATA1 0000000001",
      "SYSCALL  01020304",
    ]);
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
    [
      "simple jump",
      "212203371140",
      [
        new OpToken(OpCode.NOP),
        new OpToken(OpCode.JMP, "03"),
        new OpToken(OpCode.ABORT),
        new OpToken(OpCode.PUSH1),
        new OpToken(OpCode.RET),
      ],
    ],
    [
      "new array with type",
      "12c421",
      [new OpToken(OpCode.PUSH2), new OpToken(OpCode.NEWARRAY_T, "21")],
    ],
    [
      "multisig script",
      "120c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef0c21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c90c2102232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa130b41138defaf",
      [
        new OpToken(OpCode.PUSH2),
        new OpToken(
          OpCode.PUSHDATA1,
          "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef"
        ),
        new OpToken(
          OpCode.PUSHDATA1,
          "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9"
        ),
        new OpToken(
          OpCode.PUSHDATA1,
          "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa"
        ),
        new OpToken(OpCode.PUSH3),
        new OpToken(OpCode.PUSHNULL),
        new OpToken(OpCode.SYSCALL, "138defaf"),
      ],
    ],
  ])("%s", (_: string, script: string, tokens: OpToken[]) => {
    const result = OpToken.fromScript(script);

    expect(result).toEqual(expect.arrayContaining(tokens));
  });
});

describe("parseInt", () => {
  test.each([
    [0, new OpToken(OpCode.PUSH0)],
    [-1, new OpToken(OpCode.PUSHM1)],
    [16, new OpToken(OpCode.PUSH16)],
    [127, new OpToken(OpCode.PUSHINT8, "7f")],
    [32512, new OpToken(OpCode.PUSHINT16, "007f")],
    [-1, new OpToken(OpCode.PUSHINT8, "00ff")],
    [-2, new OpToken(OpCode.PUSHINT16, "feff")],
    [-3, new OpToken(OpCode.PUSHINT32, "fdffffff")],
    [-4, new OpToken(OpCode.PUSHINT64, "fcffffffffffffff")],
    [-5, new OpToken(OpCode.PUSHINT128, "fbffffffffffffffffffffffffffffff")],
    [
      -6,
      new OpToken(
        OpCode.PUSHINT256,
        "faffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ),
    ],
  ])("%d", (expected: number, input: OpToken) => {
    const result = OpToken.parseInt(input);
    expect(result).toBe(expected);
  });
});
