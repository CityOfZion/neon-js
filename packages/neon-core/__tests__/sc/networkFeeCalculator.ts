import {
  calculateExecutionFee,
  generateFakeInvocationScript,
  generateFakeMultiSigVerificationScript,
  generateFakeSingleSignatureVerificationScript,
} from "../../src/sc";
import { BigInteger } from "../../src/u";

describe("calculateExecutionFees", () => {
  test("zero", () => {
    const result = calculateExecutionFee("");

    expect(result.toString()).toBe("0");
  });

  test("single signature verification fee", () => {
    const result = calculateExecutionFee(
      generateFakeSingleSignatureVerificationScript()
    );

    expect(result.toString()).toBe("1000210");
  });

  test("multisig verification fee", () => {
    const result = calculateExecutionFee(
      generateFakeMultiSigVerificationScript(3, 2)
    );

    expect(result.toString()).toBe("1000390");
  });

  test("invocationScript fee", () => {
    const result = calculateExecutionFee([generateFakeInvocationScript()]);

    expect(result.toString()).toBe("180");
  });
});
