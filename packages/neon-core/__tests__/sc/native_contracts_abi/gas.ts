import { GAS } from "../../../src/sc";

describe("GAS Native Contract", () => {
  const gas = new GAS();
  test("balanceOf", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = gas.balanceOf(addr);
    expect(result).toBe(
      "14e849739c4d7711fed5a4e27fa3d5ae950038d04951c10962616c616e63654f66142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("decimals", () => {
    const result = gas.decimals();
    expect(result).toBe(
      "00c108646563696d616c73142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("getSysFeeAmount", () => {
    const result = gas.getSysFeeAmount(10000);
    expect(result).toBe(
      "02102751c10f676574537973466565416d6f756e74142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("name", () => {
    const result = gas.name();
    expect(result).toBe(
      "00c1046e616d65142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("supportedStandards", () => {
    const result = gas.supportedStandards();
    expect(result).toBe(
      "00c112737570706f727465645374616e6461726473142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("symbol", () => {
    const result = gas.symbol();
    expect(result).toBe(
      "00c10673796d626f6c142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("totalSupply", () => {
    const result = gas.totalSupply();
    expect(result).toBe(
      "00c10b746f74616c537570706c79142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });

  test("transfer", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = gas.transfer(addr, addr, 10000);
    expect(result).toBe(
      "060010a5d4e80014e849739c4d7711fed5a4e27fa3d5ae950038d04914e849739c4d7711fed5a4e27fa3d5ae950038d04953c1087472616e73666572142582d1b275e86c8f0e93a9b2facd5fdb760976a168627d5b52"
    );
  });
});
