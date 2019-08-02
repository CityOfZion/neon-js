import { NEO } from "../../../src/sc";

describe("NEO Native Contract", () => {
  const neo = new NEO();

  test("balanceOf", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.balanceOf(addr);
    expect(result.hex).toBe(
      "1449d0380095aed5a37fe2a4d5fe11774d9c7349e851c10962616c616e63654f666845c49284"
    );
    expect(result.fee.toNumber()).toBe(0.01);
  });

  test("decimals", () => {
    const result = neo.decimals();
    expect(result.hex).toBe("0008646563696d616c736845c49284");
    expect(result.fee.toNumber()).toBe(0);
  });

  test("getNextBlockValidators", () => {
    const result = neo.getNextBlockValidators();
    expect(result.hex).toBe(
      "00166765744e657874426c6f636b56616c696461746f72736845c49284"
    );
    expect(result.fee.toNumber()).toBe(1);
  });

  test("getRegisteredValidators", () => {
    const result = neo.getRegisteredValidators();
    expect(result.hex).toBe(
      "00176765745265676973746572656456616c696461746f72736845c49284"
    );
    expect(result.fee.toNumber()).toBe(1);
  });

  test("getValidators", () => {
    const result = neo.getValidators();
    expect(result.hex).toBe("000d67657456616c696461746f72736845c49284");
    expect(result.fee.toNumber()).toBe(1);
  });

  test("name", () => {
    const result = neo.name();
    expect(result.hex).toBe("00046e616d656845c49284");
    expect(result.fee.toNumber()).toBe(0);
  });

  test("registerValidator", () => {
    const pubkey =
      "02ec3712c5e5b349445cc4ad038ecc34cdceff3b010be522b8690228e3a4525f6c";
    const result = neo.registerValidator(pubkey);
    expect(result.hex).toBe(
      "4230326563333731326335653562333439343435636334616430333865636333346364636566663362303130626535323262383639303232386533613435323566366351c111726567697374657256616c696461746f726845c49284"
    );
    expect(result.fee.toNumber()).toBe(0.05);
  });

  test("supportedStandards", () => {
    const result = neo.supportedStandards();
    expect(result.hex).toBe(
      "0012737570706f727465645374616e64617264736845c49284"
    );
    expect(result.fee.toNumber()).toBe(0);
  });

  test("symbol", () => {
    const result = neo.symbol();
    expect(result.hex).toBe("000673796d626f6c6845c49284");
    expect(result.fee.toNumber()).toBe(0);
  });

  test("totalSupply", () => {
    const result = neo.totalSupply();
    expect(result.hex).toBe("000b746f74616c537570706c796845c49284");
    expect(result.fee.toNumber()).toBe(0.01);
  });

  test("transfer", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.transfer(addr, addr, 10000);
    expect(result.hex).toBe(
      "060010a5d4e8001449d0380095aed5a37fe2a4d5fe11774d9c7349e81449d0380095aed5a37fe2a4d5fe11774d9c7349e853c1087472616e736665726845c49284"
    );
    expect(result.fee.toNumber()).toBe(0.08);
  });

  test("unclaimedGas", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.unclaimedGas(addr, 1000);
    expect(result.hex).toBe(
      "02e8031449d0380095aed5a37fe2a4d5fe11774d9c7349e852c10c756e636c61696d65644761736845c49284"
    );
    expect(result.fee.toNumber()).toBe(0.03);
  });

  test("vote", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const pubkey =
      "02ec3712c5e5b349445cc4ad038ecc34cdceff3b010be522b8690228e3a4525f6c";
    const result = neo.vote(addr, [pubkey]);
    expect(result.hex).toBe(
      "4230326563333731326335653562333439343435636334616430333865636333346364636566663362303130626535323262383639303232386533613435323566366351c11449d0380095aed5a37fe2a4d5fe11774d9c7349e852c104766f74656845c49284"
    );
    expect(result.fee.toNumber()).toBe(5);
  });
});
