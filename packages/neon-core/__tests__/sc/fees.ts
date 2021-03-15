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
        new OpToken(OpCode.SYSCALL, InteropServiceCode.NEO_CRYPTO_CHECKSIG),
      ],
      30
    );

    expect(result.toString()).toBe("983280");
  });

  test("multisig verification fee", () => {
    const result = calculateExecutionFee(
      [
        new OpToken(OpCode.PUSH2),
        new OpToken(OpCode.PUSHDATA1, "0".repeat(66)),
        new OpToken(OpCode.PUSHDATA1, "1".repeat(66)),
        new OpToken(OpCode.PUSHDATA1, "2".repeat(66)),
        new OpToken(OpCode.PUSH3),
        new OpToken(
          OpCode.SYSCALL,
          InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG
        ),
      ],
      30
    );

    expect(result.toString()).toBe("1966860");
  });

  test("invocationScript fee", () => {
    const result = calculateExecutionFee(
      [new OpToken(OpCode.PUSHDATA1, "0".repeat(128))],
      30
    );

    expect(result.toString()).toBe("240");
  });
});
