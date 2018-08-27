import { CONST, rpc, u } from "@cityofzion/neon-core";
import { getToken, getTokenBalance, getTokenBalances } from "../src/main";

const TESTNET_URLS = [
  "https://test1.cityofzion.io:443",
  "https://test2.cityofzion.io:443",
  "https://test3.cityofzion.io:443",
  "http://seed3.neo.org:20332",
  "http://seed4.neo.org:20332",
  "http://seed5.neo.org:20332"
];
let TESTNET_URL = "";
const RPX = CONST.CONTRACTS.TEST_RPX;

beforeAll(async () => {
  for (let i = 0; i < TESTNET_URLS.length; i++) {
    try {
      await rpc.Query.getBlockCount().execute(TESTNET_URLS[i]);
      TESTNET_URL = TESTNET_URLS[i];
      break;
    } catch (e) {
      if (i === TESTNET_URLS.length) {
        throw new Error("Exhausted all urls but found no available RPC");
      }
      continue;
    }
  }
});

describe("getTokenBalance", () => {
  test("8 decimals contract", async () => {
    const balance = await getTokenBalance(
      TESTNET_URL,
      RPX,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    expect(balance instanceof u.Fixed8).toBe(true);
    expect(balance.toNumber()).toBeGreaterThan(0);
  });

  test("0 decimals contract", async () => {
    const balance = await getTokenBalance(
      TESTNET_URL,
      CONST.CONTRACTS.TEST_RHTT4,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );

    expect(balance.toNumber()).toBeGreaterThan(0);
    expect(balance.toNumber() % 1).toBe(0);
  });
});

describe("getTokenBalances", () => {
  test("multiple repeated contracts", async () => {
    const balances = await getTokenBalances(
      TESTNET_URL,
      [
        CONST.CONTRACTS.TEST_RPX,
        CONST.CONTRACTS.TEST_RHTT4,
        CONST.CONTRACTS.TEST_LWTF,
        CONST.CONTRACTS.TEST_NXT,
        CONST.CONTRACTS.TEST_RPX,
        CONST.CONTRACTS.TEST_RHTT4,
        CONST.CONTRACTS.TEST_LWTF,
        CONST.CONTRACTS.TEST_NXT
      ],
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    expect(Object.keys(balances)).toEqual(
      expect.arrayContaining(["RPX", "RHTT4", "LWTF", "NXT"])
    );
  });
});

describe("getToken", () => {
  test("without balance", async () => {
    const info = await getToken(TESTNET_URL, RPX);
    expect(typeof info.name).toBe("string");
    expect(info.symbol).toMatch(/[A-Z]+/);
    expect(typeof info.decimals).toBe("number");
    expect(typeof info.totalSupply).toBe("number");
    expect(info.balance).toBeUndefined();
  });

  test("with balance", async () => {
    const info = await getToken(
      TESTNET_URL,
      RPX,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    expect(typeof info.name).toBe("string");
    expect(info.symbol).toMatch(/[A-Z]+/);
    expect(typeof info.decimals).toBe("number");
    expect(typeof info.totalSupply).toBe("number");
    expect(info.balance).toBeDefined();
    const balanceNum = info.balance.toNumber();
    expect(balanceNum).toBeGreaterThan(0);
  });
});
