import Claims from "../../src/wallet/Claims";
import ClaimItem from "../../src/wallet/components/ClaimItem";

describe("constructor", () => {
  test("empty", () => {
    const result = new Claims();

    expect(result instanceof Claims).toBeTruthy();
    expect(result).toMatchObject({
      address: "",
      net: "NoNet",
      claims: [],
    });
  });

  test("ClaimsLike", () => {
    const testObject = {
      address: "address",
      net: "UnitTestNet",
      claims: [
        {
          claim: 1,
          txid: "tx1",
          index: 0,
          value: 1,
        },
        {
          claim: 2,
          txid: "tx2",
          index: 1,
          value: 2,
        },
      ],
    };

    const result = new Claims(testObject);
    expect(result instanceof Claims).toBeTruthy();
    expect(result.address).toBe(testObject.address);
    expect(result.net).toBe(testObject.net);
    for (let i = 0; i < result.claims.length; i++) {
      expect(result.claims[i] instanceof ClaimItem).toBeTruthy();
      expect(result.claims[i].equals(testObject.claims[i])).toBeTruthy();
    }
  });

  test("Claims", () => {
    const testObject = new Claims({
      address: "address",
      net: "UnitTestNet",
      claims: [
        {
          claim: 1,
          txid: "tx1",
          index: 0,
          value: 1,
        },
        {
          claim: 2,
          txid: "tx2",
          index: 1,
          value: 2,
        },
      ],
    });

    const result = new Claims(testObject);
    expect(result).not.toBe(testObject);
    expect(result.address).toBe(testObject.address);
    expect(result.net).toBe(testObject.net);
    for (let i = 0; i < result.claims.length; i++) {
      expect(result.claims[i] instanceof ClaimItem).toBeTruthy();
      expect(result.claims[i]).not.toBe(testObject.claims[i]);
      expect(result.claims[i].equals(testObject.claims[i])).toBeTruthy();
    }
  });
});

describe("export", () => {
  test("export to ClaimsLike", () => {
    const expected = {
      address: "address",
      net: "UnitTestNet",
      claims: [
        {
          claim: 1,
          txid: "tx1",
          index: 0,
          value: 1,
        },
        {
          claim: 2,
          txid: "tx2",
          index: 1,
          value: 2,
        },
      ],
    };

    const claimsObj = new Claims(expected);
    const result = claimsObj.export();
    expect(result).toEqual(expected);
  });
});

describe("slice", () => {
  const testObject = new Claims({
    address: "address",
    net: "UnitTestNet",
    claims: [
      {
        claim: 1,
        txid: "tx1",
        index: 1,
        value: 1,
      },
      {
        claim: 2,
        txid: "tx2",
        index: 2,
        value: 2,
      },
      {
        claim: 3,
        txid: "tx3",
        index: 3,
        value: 3,
      },
      {
        claim: 4,
        txid: "tx4",
        index: 4,
        value: 4,
      },
    ],
  });
  const result = testObject.slice(1, 3);
  expect(result instanceof Claims).toBeTruthy();
  expect(result.address).toBe(testObject.address);
  expect(result.net).toBe(testObject.net);
  expect(result.claims.length).toBe(2);
  expect(result.claims).toEqual([testObject.claims[1], testObject.claims[2]]);
});
