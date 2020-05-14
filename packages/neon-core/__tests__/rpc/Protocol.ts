import { DEFAULT_SYSFEE } from "../../src/consts";
import Protocol from "../../src/rpc/Protocol";

describe("constructor", () => {
  test("empty", () => {
    const result = new Protocol();
    expect(result instanceof Protocol).toBeTruthy();
    expect(result.magic).toEqual(0);
    expect(result.addressVersion).toEqual(23);
    expect(result.standbyValidators).toEqual([]);
    expect(result.seedList).toEqual([]);
    expect(result.systemFee).toEqual(DEFAULT_SYSFEE);
  });

  test("ProtocolLike", () => {
    const testObject = {
      Magic: 999999,
      AddressVersion: 99,
      StandbyValidators: ["1", "2", "3", "4"],
      SeedList: ["a", "b", "c", "d"],
      SystemFee: {
        EnrollmentTransaction: 1000,
        IssueTransaction: 500,
        PublishTransaction: 500,
        RegisterTransaction: 10000,
      },
    };

    const result = new Protocol(testObject);
    expect(result.magic).toEqual(testObject.Magic);
    expect(result.addressVersion).toEqual(testObject.AddressVersion);
    expect(result.standbyValidators).toEqual(testObject.StandbyValidators);
    expect(result.seedList).toEqual(testObject.SeedList);
    expect(result.systemFee).toEqual(testObject.SystemFee);
  });

  test("Protocol", () => {
    const testObject = {
      Magic: 999999,
      AddressVersion: 99,
    };

    const protocolObj = new Protocol(testObject);
    const result = new Protocol(protocolObj);
    expect(result instanceof Protocol).toBeTruthy();
    expect(result).not.toBe(protocolObj);
    expect(result.systemFee).not.toBe(protocolObj.systemFee);
  });
});

describe("export", () => {
  test("export to ProtocolJSON", () => {
    const expected = {
      Magic: 999999,
      AddressVersion: 99,
      StandbyValidators: ["1", "2", "3", "4"],
      SeedList: ["a", "b", "c", "d"],
      SystemFee: {
        EnrollmentTransaction: 1000,
        IssueTransaction: 500,
        PublishTransaction: 500,
        RegisterTransaction: 10000,
      },
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
    SeedList: ["a", "b", "c", "d"],
    SystemFee: {
      EnrollmentTransaction: 1000,
      IssueTransaction: 500,
      PublishTransaction: 500,
      RegisterTransaction: 10000,
    },
  };
  const obj2 = {
    magic: 999998,
    addressVersion: 99,
    StandbyValidators: ["1", "2", "3", "4"],
    SeedList: ["a", "b", "c", "d"],
    SystemFee: {
      EnrollmentTransaction: 1000,
      IssueTransaction: 500,
      PublishTransaction: 500,
      RegisterTransaction: 10000,
    },
  };
  const protocol1 = new Protocol(obj1);
  const protocol2 = new Protocol(obj2);

  test.each([
    ["Protocol1 === Protocol1", protocol1, protocol1, true],
    ["Protocol1 !== Protocol2", protocol1, protocol2, false],
    ["Protocol1 === Obj1", protocol1, obj1, true],
    ["Protocol1 !== Obj2", protocol1, obj2, false],
  ])("%s", (msg: string, a: Protocol, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});
