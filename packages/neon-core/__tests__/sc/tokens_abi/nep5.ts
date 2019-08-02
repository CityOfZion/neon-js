import { NEP5 } from "../../../src/sc";

describe("NEP5 ABI", () => {
  const contract_scriptHash = "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9";
  const nep5 = new NEP5(contract_scriptHash);
  test("balanceOf", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = nep5.balanceOf(addr);
    expect(result).toBe(
      "1449d0380095aed5a37fe2a4d5fe11774d9c7349e851c10962616c616e63654f6614f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });

  test("decimals", () => {
    const result = nep5.decimals();
    expect(result).toBe(
      "0008646563696d616c7314f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });

  test("name", () => {
    const result = nep5.name();
    expect(result).toBe(
      "00046e616d6514f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });

  test("symbol", () => {
    const result = nep5.symbol();
    expect(result).toBe(
      "000673796d626f6c14f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });

  test("totalSupply", () => {
    const result = nep5.totalSupply();
    expect(result).toBe(
      "000b746f74616c537570706c7914f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });

  test("transfer", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = nep5.transfer(addr, addr, 10);
    expect(result).toBe(
      "0400ca9a3b1449d0380095aed5a37fe2a4d5fe11774d9c7349e81449d0380095aed5a37fe2a4d5fe11774d9c7349e853c1087472616e7366657214f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec68627d5b52"
    );
  });
});
