import { ScriptHash } from "../../src/basic/ScriptHash";

describe("Static Constructor", () => {
  test("FromScriptHash, handle 0x prefix", () => {
    const hex = ScriptHash.fromHexString(
      "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
    const hex2 = ScriptHash.fromHexString(
      "0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
    expect(hex.value).toBe("ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9");
    expect(hex2.value).toBe("ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9");
    expect(hex.isLittleEndian).toBeTruthy();
  });

  test("FromScriptHash, non-40-length will fail", () => {
    const func = function() {
      ScriptHash.fromHexString("a3b4");
    };
    expect(func).toThrowError();
  });

  test("FromASCIIString", () => {
    const hex = ScriptHash.fromASCIIString("this is a test123456");
    expect(hex.isLittleEndian).toBeTruthy();
    expect(hex.value).toBe("3635343332317473657420612073692073696874");
  });
});
