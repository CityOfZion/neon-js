import Protocol from "../../src/rpc/Protocol";

describe("constructor", () => {
  test("empty", () => {
    const result = new Protocol();
    expect(result instanceof Protocol).toBeTruthy();
    expect(result.magic).toEqual(0);
    expect(result.addressVersion).toEqual(23);
    expect(result.standbyValidators).toEqual([]);
    expect(result.seedList).toEqual([]);
  });

  test("ProtocolJSON", () => {
    const testObject = {
      Magic: 999999,
      AddressVersion: 99,
      StandbyValidators: ["1", "2", "3", "4"],
      SeedList: ["a", "b", "c", "d"]
    };

    const result = new Protocol(testObject);
    expect(result.magic).toEqual(testObject.Magic);
    expect(result.addressVersion).toEqual(testObject.AddressVersion);
    expect(result.standbyValidators).toEqual(testObject.StandbyValidators);
    expect(result.seedList).toEqual(testObject.SeedList);
  });

  test("ProtocolLike", () => {
    const testObject = {
      magic: 12345,
      addressVersion: 1,
      standbyValidators: ["2", "3", "4", "5"],
      seedList: ["a", "b", "c", "d"]
    };

    const result = new Protocol(testObject);
    expect(result.magic).toEqual(testObject.magic);
    expect(result.addressVersion).toEqual(testObject.addressVersion);
    expect(result.standbyValidators).toEqual(testObject.standbyValidators);
    expect(result.seedList).toEqual(testObject.seedList);
  });

  test("Protocol", () => {
    const testObject = {
      Magic: 999999,
      AddressVersion: 99
    };

    const protocolObj = new Protocol(testObject);
    const result = new Protocol(protocolObj);
    expect(result instanceof Protocol).toBeTruthy();
    expect(result).not.toBe(protocolObj);
  });
});

describe("export", () => {
  test("toConfiguration", () => {
    const expected = {
      Magic: 999999,
      AddressVersion: 99,
      StandbyValidators: ["1", "2", "3", "4"],
      SeedList: ["a", "b", "c", "d"]
    };

    const protocolObj = new Protocol(expected);
    const result = protocolObj.toConfiguration();
    expect(result).toEqual(expected);
  });

  test("export to ProtocolLike", () => {
    const expected = {
      magic: 4356547,
      addressVersion: 123,
      standbyValidators: ["5", "6", "7", "8"],
      seedList: ["a", "b", "c", "d"]
    };

    const protocolObj = new Protocol(expected);
    const result = protocolObj.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    Magic: 999999,
    AddressVersion: 99,
    StandbyValidators: ["1", "2", "3", "4"],
    SeedList: ["a", "b", "c", "d"]
  };
  const obj2 = {
    magic: 999998,
    addressVersion: 99,
    StandbyValidators: ["1", "2", "3", "4"],
    SeedList: ["a", "b", "c", "d"]
  };
  const protocol1 = new Protocol(obj1);
  const protocol2 = new Protocol(obj2);

  test.each([
    ["Protocol1 === Protocol1", protocol1, protocol1, true],
    ["Protocol1 !== Protocol2", protocol1, protocol2, false],
    ["Protocol1 === Obj1", protocol1, obj1, true],
    ["Protocol1 !== Obj2", protocol1, obj2, false]
  ])("%s", (msg: string, a: Protocol, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});
