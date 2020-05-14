import {
  ContractTransaction,
  InvocationTransaction,
  Transaction,
} from "../../../src/tx";

describe("deserialize", () => {
  test("deserialize unsigned tx", () => {
    const result = Transaction.deserialize(
      "d1012502e80351c10a6d696e74546f6b656e73676c3f26d7b3a8b2079d053ceb86d13a2fe42b402900e1f5050000000000016ee3ab02e4b1955e38e5e3a8219887bfe62431ed1e476559875e59609d6e85c4000001e72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60f035e0d90b000000f00cf8e363c29f33f8333df8462d06cae499b5fa"
    );

    expect(result).toBeInstanceOf(InvocationTransaction);
    expect(result.attributes.length).toBe(0);
    expect(result.inputs.length).toBe(1);
    expect(result.outputs.length).toBe(1);
    expect(result.scripts.length).toBe(0);
  });

  test("deserialize signed tx", () => {
    const result = Transaction.deserialize(
      "800000022d9848a35942a8860b944d6c5f51c358bf2a8fbced8fd94975f38212cd448f7b0200b0c73210bc15bd74a25c07dcb7110f1d1be02c7818a5f9f8157af1ee5d7e18260100049b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000003775292229eccdf904f16fff8e83e7cffdc0f0cee72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c6001000000000000003775292229eccdf904f16fff8e83e7cffdc0f0ce9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500c2eb0b0000000035b20010db73bf86371075ddfba4e6596f1ff35de72d286979ee6cb1b7e65dfddfb2e384100b8d148e7758de42e4168b71792c60e60300000000000035b20010db73bf86371075ddfba4e6596f1ff35d014140053539269d07c6d6a14f2f05c3676f97b803fe1cf6e10480878ca59b4713d58bf7f6864e817e760133633104b070657d36f662784493a2c8df63777cc2037c7d2321031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9ac"
    );

    expect(result).toBeInstanceOf(ContractTransaction);
    expect(result.attributes.length).toBe(0);
    expect(result.inputs.length).toBe(2);
    expect(result.outputs.length).toBe(4);
    expect(result.scripts.length).toBe(1);
  });
});
