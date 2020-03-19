import BIP44 from "../src/BIP44";

const BIP44_PURPOSE = "8000002C";
const NEO_COINTYPE = "80000378";

test("Defaults to zeroth address", () => {
  const result = BIP44();
  expect(result.length).toBe(40);
  const portions = result.match(/.{1,8}/g);
  expect(portions[0]).toEqual(BIP44_PURPOSE);
  expect(portions[1]).toEqual(NEO_COINTYPE);
  expect(portions[2]).toEqual("80000000");
  expect(portions[3]).toEqual("00000000");
  expect(portions[4]).toEqual("00000000");
});

test("Produces a string with the correct numbers", () => {
  const randInt = (): number => Math.floor(Math.random() * 100);
  const account = randInt();
  const change = randInt();
  const address = randInt();

  const result = BIP44(address, change, account);
  expect(result.length).toBe(40);
  const portions = result.match(/.{1,8}/g);
  expect(portions[0]).toEqual(BIP44_PURPOSE);
  expect(portions[1]).toEqual(NEO_COINTYPE);
  expect(parseInt(portions[2], 16)).toEqual(0x80000000 + account);
  expect(parseInt(portions[3], 16)).toEqual(change);
  expect(parseInt(portions[4], 16)).toEqual(address);
});

test("Errors when given negative number", () => {
  expect(() => BIP44(-1)).toThrow(/invalid input/);
});

test("Errors when given non-integer", () => {
  expect(() => BIP44(1.1)).toThrow(/invalid input/);
});
