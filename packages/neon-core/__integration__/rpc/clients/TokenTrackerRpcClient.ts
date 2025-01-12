import { rpc } from "../../../src";
import * as TestHelpers from "../../../../../testHelpers";

let client: rpc.TokenTrackerRpcClient;
const address = "NR4SHeS9kfgN5EXVcAuFwfu6Y56xaSPxg9";

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.TokenTrackerRpcClient(url);
}, 20000);

describe("TokenTrackerRpcClient", () => {
  describe("getNep11Transfers", () => {
    test("empty address", async () => {
      const result = await client.getNep11Transfers("0".repeat(40));
      expect(result.received.length).toBe(0);
      expect(result.sent.length).toBe(0);
    });
  });

  describe("getNep11Balances", () => {
    test("empty address", async () => {
      const result = await client.getNep11Balances("0".repeat(40));
      expect(result.balance.length).toBe(0);
    });
  });

  describe("getNep17Transfers", () => {
    test("empty address", async () => {
      const result = await client.getNep17Transfers("0".repeat(40));
      expect(result.received.length).toBe(0);
      expect(result.sent.length).toBe(0);
    });

    // We set startTime to beginning of UTC to get all transactions.
    test("address with endtime", async () => {
      const result = await client.getNep17Transfers(
        address,
        "0",
        Date.now().toString(),
      );
      expect(result.address).toBe(address);
      expect(result.received.length).toBeGreaterThan(0);
      expect(result.sent.length).toBeGreaterThan(0);

      result.received.forEach((i) => {
        expect(Object.keys(i)).toEqual(
          expect.arrayContaining([
            "timestamp",
            "assethash",
            "transferaddress",
            "amount",
            "blockindex",
            "transfernotifyindex",
            "txhash",
          ]),
        );
      });
      result.sent.forEach((i) => {
        expect(Object.keys(i)).toEqual(
          expect.arrayContaining([
            "timestamp",
            "assethash",
            "transferaddress",
            "amount",
            "blockindex",
            "transfernotifyindex",
            "txhash",
          ]),
        );
      });
    });
  });

  describe("getNep17Balances", () => {
    test("empty address", async () => {
      const result = await client.getNep17Balances("0".repeat(40));
      expect(result.balance.length).toBe(0);
    });

    test("address with some assets", async () => {
      const result = await client.getNep17Balances(address);
      expect(result.address).toBe(address);
      expect(result.balance.length).toBeGreaterThan(0);
      result.balance.forEach((b) => {
        expect(Object.keys(b)).toEqual(
          expect.arrayContaining(["assethash", "lastupdatedblock", "amount"]),
        );
      });
    });
  });
});
