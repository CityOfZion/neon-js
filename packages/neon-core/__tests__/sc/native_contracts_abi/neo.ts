import { NEO } from "../../../src/sc";

describe("NEO Native Contract", () => {
  const neo = new NEO();

  test("balanceOf", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.balanceOf(addr);
    expect(result).toBe(
      "14e849739c4d7711fed5a4e27fa3d5ae950038d04951c10962616c616e63654f661415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("decimals", () => {
    const result = neo.decimals();
    expect(result).toBe(
      "00c108646563696d616c731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("getNextBlockValidators", () => {
    const result = neo.getNextBlockValidators();
    expect(result).toBe(
      "00c1166765744e657874426c6f636b56616c696461746f72731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("getRegisteredValidators", () => {
    const result = neo.getRegisteredValidators();
    expect(result).toBe(
      "00c1176765745265676973746572656456616c696461746f72731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("getValidators", () => {
    const result = neo.getValidators();
    expect(result).toBe(
      "00c10d67657456616c696461746f72731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("name", () => {
    const result = neo.name();
    expect(result).toBe(
      "00c1046e616d651415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("registerValidator", () => {
    const pubkey =
      "02ec3712c5e5b349445cc4ad038ecc34cdceff3b010be522b8690228e3a4525f6c";
    const result = neo.registerValidator(pubkey);
    expect(result).toBe(
      "4230326563333731326335653562333439343435636334616430333865636333346364636566663362303130626535323262383639303232386533613435323566366351c111726567697374657256616c696461746f721415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("supportedStandards", () => {
    const result = neo.supportedStandards();
    expect(result).toBe(
      "00c112737570706f727465645374616e64617264731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("symbol", () => {
    const result = neo.symbol();
    expect(result).toBe(
      "00c10673796d626f6c1415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("totalSupply", () => {
    const result = neo.totalSupply();
    expect(result).toBe(
      "00c10b746f74616c537570706c791415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("transfer", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.transfer(addr, addr, 10000);
    expect(result).toBe(
      "060010a5d4e80014e849739c4d7711fed5a4e27fa3d5ae950038d04914e849739c4d7711fed5a4e27fa3d5ae950038d04953c1087472616e736665721415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("unclaimedGas", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = neo.unclaimedGas(addr, 1000);
    expect(result).toBe(
      "02e80314e849739c4d7711fed5a4e27fa3d5ae950038d04952c10c756e636c61696d65644761731415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });

  test("vote", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const pubkey =
      "02ec3712c5e5b349445cc4ad038ecc34cdceff3b010be522b8690228e3a4525f6c";
    const result = neo.vote(addr, [pubkey]);
    expect(result).toBe(
      "4230326563333731326335653562333439343435636334616430333865636333346364636566663362303130626535323262383639303232386533613435323566366351c114e849739c4d7711fed5a4e27fa3d5ae950038d04952c104766f74651415caa04214310670d5e5a398e147e0dbed98cf4368627d5b52"
    );
  });
});
