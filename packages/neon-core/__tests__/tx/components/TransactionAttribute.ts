import {
  TransactionAttribute,
  TransactionAttributeJson,
  HighPriorityAttribute,
  OracleResponseTransactionAttributeJson,
  OracleResponseAttribute,
} from "../../../src/tx/components/TransactionAttribute";
import { StringStream } from "../../../src/u";

describe("Tx Attributes", () => {
  test("high priority", () => {
    const input: TransactionAttributeJson = {
      type: "HighPriority",
    };
    const result = TransactionAttribute.fromJson(input);
    expect(result).toBeInstanceOf(HighPriorityAttribute);
    expect(result.toJson()).toEqual(input);
    expect(result.size).toBe(1);
    expect(result.serialize()).toEqual("01");

    const ss = new StringStream("01");
    const deserializeResult = TransactionAttribute.deserialize(ss);
    expect(deserializeResult).toBeInstanceOf(HighPriorityAttribute);
  });

  test("oracle response", () => {
    const input: OracleResponseTransactionAttributeJson = {
      type: "OracleResponse",
      id: 123,
      code: "Success",
      result: "AQID",
    };
    const result = TransactionAttribute.fromJson(input);
    expect(result).toBeInstanceOf(OracleResponseAttribute);
    expect(result.toJson()).toEqual(input);
    expect(result.size).toBe(14);
    const captured = "117b000000000000000003010203";
    expect(result.serialize()).toEqual(captured);
    const ss = new StringStream(captured);
    const deserialized = TransactionAttribute.deserialize(ss);
    expect(deserialized).toBeInstanceOf(OracleResponseAttribute);
  });
});
