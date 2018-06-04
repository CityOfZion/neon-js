import { rpc, settings, u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
import * as common from "../../src/provider/common";
import * as neonDB from "../../src/provider/neonDB";

jest.mock("axios");
jest.mock("../../src/provider/common");

const UnitTestNetUrl = "http://testurl.com";
beforeEach(() => {
  jest.resetModules();
  settings.addNetwork(
    new rpc.Network({
      name: "UnitTestNet",
      extra: { neonDB: UnitTestNetUrl }
    })
  );
});

describe("getAPIEndpoint", () => {
  test("returns URL based on network", () => {
    expect(neonDB.getAPIEndpoint("UnitTestNet")).toBe(
      settings.networks.UnitTestNet.extra.neonDB
    );
  });

  test("returns input when cannot match network", () => {
    const url = "http://localhost:1234";
    expect(neonDB.getAPIEndpoint(url)).toBe(url);
  });

  test("errors when matched network does not have neonDB url", () => {
    settings.addNetwork(new rpc.Network({ name: "WeirdNet" }));
    expect(() => neonDB.getAPIEndpoint("WeirdNet")).toThrow();
  });
});

describe("getRPCEndpoint", () => {
  test("returns good RPC endpoint", async () => {
    const allNodes = [
      { block_height: 5, url: "http://url1", status: true, time: 1 },
      { block_height: 5, url: "http://url2", status: true, time: 2 },
      { block_height: 1, url: "http://url3", status: true, time: 3 },
      { block_height: 1, url: "http://url4", status: false, time: 4 }
    ];
    const filteredNodes = [allNodes[0], allNodes[1], allNodes[2]].map(n => ({
      height: n.block_height,
      url: n.url
    }));
    const goodNodes = [filteredNodes[0], filteredNodes[1]];
    const getCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: { nodes: allNodes }
      })
    );
    axios.get = getCall;
    common.findGoodNodesFromHeight.mockImplementationOnce(() => goodNodes);
    common.getBestUrl.mockImplementationOnce(() =>
      Promise.resolve("http://url2")
    );

    const result = await neonDB.getRPCEndpoint("UnitTestNet");

    expect(getCall).toBeCalledWith(UnitTestNetUrl + "/v2/network/nodes");
    expect(common.findGoodNodesFromHeight).toBeCalledWith(filteredNodes);
    expect(common.getBestUrl).toBeCalledWith(goodNodes);
    expect(common.filterHttpsOnly).not.toBeCalled();
    expect(result).toBe("http://url2");
  });

  test("Calls filterHttpsOnly when httpsOnly setting is true", async () => {
    const allNodes = [
      { block_height: 5, url: "http://url1", status: true, time: 1 },
      { block_height: 5, url: "https://url2", status: true, time: 2 }
    ];
    const transformedNodes = allNodes.map(n => ({
      height: n.block_height,
      url: n.url
    }));
    const filteredNodes = [allNodes[0]];
    const goodNodes = [filteredNodes[0]];
    const getCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: { nodes: allNodes }
      })
    );
    axios.get = getCall;
    common.filterHttpsOnly.mockImplementationOnce(() => filteredNodes);
    common.findGoodNodesFromHeight.mockImplementationOnce(() => goodNodes);
    common.getBestUrl.mockImplementationOnce(() =>
      Promise.resolve("https://url2")
    );

    settings.httpsOnly = true;

    const result = await neonDB.getRPCEndpoint("UnitTestNet");

    expect(getCall).toBeCalledWith(UnitTestNetUrl + "/v2/network/nodes");
    expect(common.filterHttpsOnly).toBeCalledWith(transformedNodes);
    expect(common.findGoodNodesFromHeight).toBeCalledWith(filteredNodes);
    expect(common.getBestUrl).toBeCalledWith(goodNodes);
    expect(result).toBe("https://url2");
  });
});

describe("getBalance", () => {
  test("returns successful balance", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          GAS: {
            balance: 1.234,
            unspent: [{ index: 1, txid: "2", value: 1.234 }]
          },
          NEO: {
            balance: 5,
            unspent: [{ index: 1, txid: "1", value: 5 }]
          },
          address: "address",
          net: "UnitTestNet"
        }
      })
    );
    axios.get = httpCall;
    expect(await neonDB.getBalance("UnitTestNet", "address")).toEqual(
      new wallet.Balance({
        net: "UnitTestNet",
        address: "address",
        assetSymbols: ["NEO", "GAS"],
        assets: {
          NEO: {
            unspent: [{ value: 5, txid: "1", index: 1 }],
            balance: 5
          } as wallet.AssetBalance,
          GAS: {
            unspent: [{ value: 1.234, txid: "2", index: 1 }],
            balance: 1.234
          } as wallet.AssetBalance
        }
      } as wallet.BalanceLike)
    );
  });

  test("returns empty balance for new address", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          GAS: {
            balance: 0,
            unspent: []
          },
          NEO: {
            balance: 0,
            unspent: []
          },
          address: "address",
          net: "UnitTestNet"
        }
      })
    );
    axios.get = httpCall;

    expect(await neonDB.getBalance("UnitTestNet", "address")).toEqual(
      new wallet.Balance({
        net: "UnitTestNet",
        address: "address"
      } as wallet.BalanceLike)
    );
  });
});

describe("getClaims", () => {
  test("returns successful claims", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          address: "address",
          claims: [
            {
              claim: 100000000,
              end: 11,
              index: 2,
              start: 5,
              sysfee: 0.1,
              txid: "1",
              value: 10
            }
          ],
          net: "UnitTestNet",
          total_claim: 10,
          total_unspent_claim: 14
        }
      })
    );
    axios.get = httpCall;
    expect(await neonDB.getClaims("UnitTestNet", "address")).toEqual(
      new wallet.Claims({
        net: "UnitTestNet",
        address: "address",
        claims: [
          { claim: 1, txid: "1", index: 2, value: 10, start: 5, end: 11 }
        ]
      } as wallet.ClaimsLike)
    );
    expect(httpCall).toBeCalledWith(
      UnitTestNetUrl + "/v2/address/claims/address"
    );
  });

  test("returns empty claims", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          address: "address",
          claims: [],
          net: "UnitTestNet",
          total_claim: 0,
          total_unspent_claim: 0
        }
      })
    );
    axios.get = httpCall;
    expect(await neonDB.getClaims("UnitTestNet", "address")).toEqual(
      new wallet.Claims({
        net: "UnitTestNet",
        address: "address"
      } as wallet.ClaimsLike)
    );
  });
});

describe("getMaxClaimAmount", () => {
  test("returns successful maxClaimsAmount", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          address: "address",
          claims: [],
          net: "UnitTestNet",
          total_claim: 10000000,
          total_unspent_claim: 90000000
        }
      })
    );
    axios.get = httpCall;
    expect(await neonDB.getMaxClaimAmount("UnitTestNet", "address")).toEqual(
      new u.Fixed8(1)
    );
    expect(httpCall).toBeCalledWith(
      UnitTestNetUrl + "/v2/address/claims/address"
    );
  });
});

describe("getHeight", () => {
  test("returns successful getHeight", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          block_height: 123,
          net: "UnitTestNet"
        }
      })
    );
    axios.get = httpCall;
    expect(await neonDB.getHeight("UnitTestNet")).toEqual(123);
    expect(httpCall).toBeCalledWith(UnitTestNetUrl + "/v2/block/height");
  });
});

describe("getTransactionHistory", () => {
  test("returns successful TransactionHistory", async () => {
    const httpCall = jest.fn().mockImplementationOnce(() =>
    Promise.resolve({
      data: {
address: "address",
        net: "UnitTestNet",
        history: [
          {GAS: 0.123, NEO: 5, block_index: 11, gas_sent: true, neo_sent: true, txid: "1"},
          {GAS: 0.456, NEO: 0, block_index: 12, gas_sent: true, neo_sent: false, txid: "2"},
          {GAS: 0.789, NEO: -1, block_index: 13, gas_sent: true, neo_sent: true, txid: "3"},
          {GAS: 0, NEO: 6, block_index: 14, gas_sent: false, neo_sent: true, txid: "4"}
        ],
        name: "transaction_history"
      }
    })
  );
  axios.get = httpCall;
  expect(await neonDB.getTransactionHistory("UnitTestNet", "address")).toEqual([
    {txid: "1", blockHeight: 11, change: {GAS: new u.Fixed8(0.123), NEO: new u.Fixed8(5)}},
    {txid: "2", blockHeight: 12, change: {GAS: new u.Fixed8(0.456), NEO: new u.Fixed8(0)}},
    {txid: "3", blockHeight: 13, change: {GAS: new u.Fixed8(0.789), NEO: new u.Fixed8(-1)}},
    {txid: "4", blockHeight: 14, change: {GAS: new u.Fixed8(0), NEO: new u.Fixed8(6)}},
  ]);
  expect(httpCall).toBeCalledWith(UnitTestNetUrl + "/v2/address/history/address");
  });
});
