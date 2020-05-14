import Fixed8 from "../../../src/u/Fixed8";
import ClaimItem, {
  ClaimItemLike,
} from "../../../src/wallet/components/ClaimItem";

describe("constructor", () => {
  test("empty", () => {
    const result = new ClaimItem();
    expect(result instanceof ClaimItem).toBeTruthy();
    expect(result).toEqual({
      claim: new Fixed8(0),
      txid: "",
      index: 0,
      value: 0,
    });
  });

  test("ClaimItemLike", () => {
    const testObject = {
      claim: 0.12345,
      index: 1,
      txid: "id",
      value: 100,
    } as ClaimItemLike;

    const result = new ClaimItem(testObject);
    expect(result instanceof ClaimItem).toBeTruthy();
    expect(result.claim.toNumber()).toEqual(testObject.claim);
    expect(result.index).toEqual(testObject.index);
    expect(result.txid).toEqual(testObject.txid);
    expect(result.value).toEqual(testObject.value);
  });

  test("ClaimItem", () => {
    const testObject = new ClaimItem({ index: 1, txid: "test" });

    const result = new ClaimItem(testObject);
    expect(result).not.toBe(testObject);
    expect(result.claim.equals(testObject.claim)).toBeTruthy();
    expect(result.index).toEqual(testObject.index);
    expect(result.txid).toEqual(testObject.txid);
  });
});

describe("export", () => {
  test("export to basic JS types", () => {
    const expected = {
      claim: 0.1234,
      index: 1,
      txid: "12345678",
      value: 1,
      start: 10000,
    };
    const c = new ClaimItem(expected);
    const result = c.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const object1 = {
    claim: 0.1234,
    index: 1,
    txid: "object1",
    value: 1.23,
  };
  const object2 = {
    claim: 0.1234,
    index: 2,
    txid: "object2",
    value: 2.34,
  };

  const claim1 = new ClaimItem(object1);
  const claim2 = new ClaimItem(object2);

  test.each([
    ["ClaimItem1 === ClaimItem1", claim1, claim1, true],
    ["ClaimItem1 !== ClaimItem2", claim1, claim2, false],
    ["ClaimItem1 === object1", claim1, object1, true],
    ["ClaimItem1 === object2", claim1, object2, false],
  ])("%s", (msg: string, a: ClaimItem, b: any, cond: boolean) => {
    expect(a.equals(b) === cond).toBeTruthy();
  });
});
