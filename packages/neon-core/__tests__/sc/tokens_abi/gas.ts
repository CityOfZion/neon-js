import { GAS } from "../../../src/sc";

describe("GAS Native Contract", () => {
  const gas = new GAS();
  test("balanceOf", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = gas.balanceOf(addr);
    expect(result.hex).toBe(
      "14e849739c4d7711fed5a4e27fa3d5ae950038d04951c10962616c616e63654f6668eb43f4f4"
    );
    expect(result.fee.toNumber()).toBe(0.0100727);
  });

  test("decimals", () => {
    const result = gas.decimals();
    expect(result.hex).toBe("00c108646563696d616c7368eb43f4f4");
    expect(result.fee.toNumber()).toBe(0.0000715);
  });

  test("getSysFeeAmount", () => {
    const result = gas.getSysFeeAmount(10000);
    expect(result.hex).toBe(
      "02102751c10f676574537973466565416d6f756e7468eb43f4f4"
    );
    expect(result.fee.toNumber()).toBe(0.0100727);
  });

  test("name", () => {
    const result = gas.name();
    expect(result.hex).toBe("00c1046e616d6568eb43f4f4");
    expect(result.fee.toNumber()).toBe(0.0000715);
  });

  test("supportedStandards", () => {
    const result = gas.supportedStandards();
    expect(result.hex).toBe(
      "00c112737570706f727465645374616e646172647368eb43f4f4"
    );
    expect(result.fee.toNumber()).toBe(0.0000715);
  });

  test("symbol", () => {
    const result = gas.symbol();
    expect(result.hex).toBe("00c10673796d626f6c68eb43f4f4");
    expect(result.fee.toNumber()).toBe(0.0000715);
  });

  test("totalSupply", () => {
    const result = gas.totalSupply();
    expect(result.hex).toBe("00c10b746f74616c537570706c7968eb43f4f4");
    expect(result.fee.toNumber()).toBe(0.0100715);
  });

  test("transfer", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = gas.transfer(addr, addr, 10000);
    expect(result.hex).toBe(
      "060010a5d4e80014e849739c4d7711fed5a4e27fa3d5ae950038d04914e849739c4d7711fed5a4e27fa3d5ae950038d04953c1087472616e7366657268eb43f4f4"
    );
    expect(result.fee.toNumber()).toBe(0.0800751);
  });
});
