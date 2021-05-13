import { u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
import * as neoCli from "../../../src/provider/neoCli/core";

jest.mock("axios");

const testUrl = "http://testurl.com";
const testAddress = "testAddress";

describe("getRPCEndpoint", () => {
  test("returns self as RPC endpoint", () => {
    const result = neoCli.getRPCEndpoint(testUrl);
    expect(result).toEqual(testUrl);
  });
});

describe("getBalance", () => {
  test("returns successful balance", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          result: {
            balance: [
              {
                unspent: [
                  {
                    txid: "0917f5cbfeccbe9c385965e7884bd10450c652325c7aa7bd8c61b0f52a019b7f",
                    n: 0,
                    value: 24088,
                  },
                ],
                asset_hash:
                  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
                asset: "GAS",
                asset_symbol: "GAS",
                amount: 24088,
              },
              {
                unspent: [
                  {
                    txid: "94f11dd277dd48cf1fccef8c02664adacdd9890410aaed8ddb01535433b3fc41",
                    n: 0,
                    value: 100000000,
                  },
                ],
                asset_hash:
                  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
                asset: "NEO",
                asset_symbol: "NEO",
                amount: 100000000,
              },
            ],
            address: testAddress,
          },
        },
      })
    );

    axios.post = httpCall;

    expect(await neoCli.getBalance(testUrl, testAddress)).toEqual(
      new wallet.Balance({
        net: testUrl,
        address: testAddress,
        assetSymbols: ["GAS", "NEO"],
        assets: {
          NEO: {
            unspent: [
              {
                value: 100000000,
                txid: "94f11dd277dd48cf1fccef8c02664adacdd9890410aaed8ddb01535433b3fc41",
                index: 0,
              },
            ],
            balance: 100000000,
          } as wallet.AssetBalanceLike,
          GAS: {
            unspent: [
              {
                value: 24088,
                txid: "0917f5cbfeccbe9c385965e7884bd10450c652325c7aa7bd8c61b0f52a019b7f",
                index: 0,
              },
            ],
            balance: 24088,
          } as wallet.AssetBalanceLike,
        },
      })
    );
  });
  test("returns empty balance for new address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          result: {
            balance: [],
            address: testAddress,
          },
        },
      })
    );

    axios.post = httpCall;

    expect(await neoCli.getBalance(testUrl, testAddress)).toEqual(
      new wallet.Balance({
        net: testUrl,
        address: testAddress,
      })
    );
  });
  test("throws when given invalid address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          error: {
            code: -32602,
            message: "Invalid params",
          },
        },
      })
    );
    axios.post = httpCall;

    expect(neoCli.getBalance(testUrl, testAddress)).rejects.toThrowError();
  });
});

describe("getClaims", () => {
  test("returns successful claims", async () => {
    const testClaim = {
      end_height: 231,
      generated: 1464,
      n: 0,
      start_height: 48,
      sys_fee: 0,
      txid: "dc44739e2f97743f2ed258988327560e2185ed13eec0097938eef4aea584bf04",
      unclaimed: 1464,
      value: 100000000,
    };
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          result: {
            address: testAddress,
            claimable: [testClaim],
            unclaimed: 1464,
          },
        },
      })
    );

    axios.post = httpCall;

    expect(await neoCli.getClaims(testUrl, testAddress)).toEqual(
      new wallet.Claims({
        net: testUrl,
        address: testAddress,
        claims: [
          {
            claim: testClaim.unclaimed,
            txid: testClaim.txid,
            index: testClaim.n,
            value: testClaim.value,
            start: testClaim.start_height,
            end: testClaim.end_height,
          },
        ],
      })
    );
  });
  test("returns empty claims for new address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          result: {
            claimable: [],
            address: testAddress,
            unclaimed: 0,
          },
        },
      })
    );

    axios.post = httpCall;

    expect(await neoCli.getClaims(testUrl, testAddress)).toEqual(
      new wallet.Claims({
        net: testUrl,
        address: testAddress,
        claims: [],
      })
    );
  });
  test("throws when given invalid address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          error: {
            code: -32602,
            message: "Invalid params",
          },
        },
      })
    );
    axios.post = httpCall;

    expect(neoCli.getClaims(testUrl, testAddress)).rejects.toThrowError();
  });
});

describe("getMaxClaimAmount", () => {
  test("get successful max claims", async () => {
    const testValues = {
      available: 100,
      unavailable: 200,
      unclaimed: 300,
    };
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          result: testValues,
        },
      })
    );

    axios.post = httpCall;

    expect(await neoCli.getMaxClaimAmount(testUrl, testAddress)).toEqual(
      new u.Fixed8(testValues.unclaimed).div(100000000)
    );
  });

  test("throws when given invalid address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          jsonrpc: "2.0",
          id: 5,
          error: {
            code: -32602,
            message: "Invalid params",
          },
        },
      })
    );
    axios.post = httpCall;

    expect(
      neoCli.getMaxClaimAmount(testUrl, testAddress)
    ).rejects.toThrowError();
  });
});
