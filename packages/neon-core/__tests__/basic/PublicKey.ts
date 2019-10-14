import { PublicKey } from "../../src/basic/PublicKey";

describe("Static Constructor", () => {
  test("FromScriptHash, handle 0x prefix", () => {
    const hex = PublicKey.fromHexString(
      "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
    const hex2 = PublicKey.fromHexString(
      "0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"
    );
    expect(hex.value).toBe("ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9");
    expect(hex2.value).toBe("ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9");
    expect(hex.isLittleEndian).toBeTruthy();
  });

  test("FromScriptHash, non-30-length will fail", () => {
    const func = function() {
      PublicKey.fromHexString("a3b4");
    };
    expect(func).toThrowError();
  });

  test("FromASCIIString", () => {
    const hex = PublicKey.fromASCIIString("this is a test123456");
    expect(hex.isLittleEndian).toBeTruthy();
    expect(hex.value).toBe("3635343332317473657420612073692073696874");
  });
});
