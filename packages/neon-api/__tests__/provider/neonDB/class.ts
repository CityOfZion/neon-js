import { rpc, settings } from "@cityofzion/neon-core";
import neonDB from "../../../src/provider/neonDB/class";
import * as core from "../../../src/provider/neonDB/core";
jest.mock("../../../src/provider/neonDB/core");

const unitTestNetUrl = "http://testurl.com";
beforeEach(() => {
  jest.resetModules();
  settings.networks.UnitTestNet = new rpc.Network({
    name: "UnitTestNet",
    extra: { neonDB: unitTestNetUrl, neoscan: "http://wrongurl.com" },
  });
});

describe("constructor", () => {
  test("url", () => {
    const expectedUrl = "www.test.com";
    const result = new neonDB(expectedUrl);
    expect(result.name).toMatch(expectedUrl);
  });

  test("Network name", () => {
    const result = new neonDB("UnitTestNet");
    expect(result.name).toMatch(unitTestNetUrl);
  });
});

// TODO: Refactor for better testing of getRPCEndpoint

test("getBalance", async () => {
  const expectedUrl = "www.test.com";
  const expectedAddress = "address";
  const obj = new neonDB(expectedUrl);
  await obj.getBalance(expectedAddress);
  expect(core.getBalance).toBeCalledWith(expectedUrl, expectedAddress);
});

test("getClaims", async () => {
  const expectedUrl = "www.test.com";
  const expectedAddress = "address";
  const obj = new neonDB(expectedUrl);
  await obj.getClaims(expectedAddress);
  expect(core.getClaims).toBeCalledWith(expectedUrl, expectedAddress);
});

test("getMaxClaimAmount", async () => {
  const expectedUrl = "www.test.com";
  const expectedAddress = "address";
  const obj = new neonDB(expectedUrl);
  await obj.getMaxClaimAmount(expectedAddress);
  expect(core.getMaxClaimAmount).toBeCalledWith(expectedUrl, expectedAddress);
});

test("getHeight", async () => {
  const expectedUrl = "www.test.com";
  const obj = new neonDB(expectedUrl);
  await obj.getHeight();
  expect(core.getHeight).toBeCalledWith(expectedUrl);
});

test("getTransactionHistory", async () => {
  const expectedUrl = "www.test.com";
  const expectedAddress = "address";
  const obj = new neonDB(expectedUrl);
  await obj.getTransactionHistory(expectedAddress);
  expect(core.getTransactionHistory).toBeCalledWith(
    expectedUrl,
    expectedAddress
  );
});
