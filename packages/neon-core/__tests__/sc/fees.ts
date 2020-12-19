import {
  calculateExecutionFee,
  InteropServiceCode,
  OpCode,
  OpToken,
} from "../../src/sc";

describe("calculateExecutionFees", () => {
  test("zero", () => {
    const result = calculateExecutionFee("", 1);

    expect(result.toString()).toBe("0");
  });

  test("single signature verification fee", () => {
    const result = calculateExecutionFee(
      [
        new OpToken(OpCode.PUSHDATA1, "0".repeat(66)),
        new OpToken(OpCode.PUSHNULL),
        new OpToken(
          OpCode.SYSCALL,
          InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
        ),
      ],
      30
    );

    expect(result.toString()).toBe("983310");
  });

  test("multisig verification fee", () => {
    const result = calculateExecutionFee(
      [
        new OpToken(OpCode.PUSH2),
        new OpToken(OpCode.PUSHDATA1, "0".repeat(66)),
        new OpToken(OpCode.PUSHDATA1, "1".repeat(66)),
        new OpToken(OpCode.PUSHDATA1, "2".repeat(66)),
        new OpToken(OpCode.PUSH3),
        new OpToken(OpCode.PUSHNULL),
        new OpToken(
          OpCode.SYSCALL,
          InteropServiceCode.NEO_CRYPTO_CHECKMULTISIGWITHECDSASECP256R1
        ),
      ],
      30
    );

    expect(result.toString()).toBe("1966890");
  });

  test("invocationScript fee", () => {
    const result = calculateExecutionFee(
      [new OpToken(OpCode.PUSHDATA1, "0".repeat(128))],
      30
    );

    expect(result.toString()).toBe("240");
  });
});
