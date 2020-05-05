import { CONST, u } from "@cityofzion/neon-core";
import {
  getToken,
  getTokenBalance,
  getTokenBalances,
  getTokens,
} from "../src/main";
import { getUrl } from "../../../helpers/urls";

let TESTNET_URL = "";
const RPX = CONST.CONTRACTS.TEST_RPX;

beforeAll(async () => {
  TESTNET_URL = await getUrl("TestNet");
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
        CONST.CONTRACTS.TEST_NXT,
      ],
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    expect(Object.keys(balances)).toEqual(
      expect.arrayContaining(["RPX", "RHTT4", "LWTF", "NXT"])
    );
  });

  test("getTokenBalances and getTokenBalance should return same value", async () => {
    const balances = await getTokenBalances(
      TESTNET_URL,
      [CONST.CONTRACTS.TEST_NXT],
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    const balance = await getTokenBalance(
      TESTNET_URL,
      CONST.CONTRACTS.TEST_NXT,
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );
    expect(balances.NXT.toNumber()).toBe(balance.toNumber());
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

describe("getTokens", () => {
  test("without balance", async () => {
    const tokensInfo = await getTokens(TESTNET_URL, [
      CONST.CONTRACTS.TEST_RPX,
      CONST.CONTRACTS.TEST_LWTF,
      CONST.CONTRACTS.TEST_NXT,
    ]);

    Object.keys(tokensInfo).map((key) => {
      const info = tokensInfo[key];

      expect(typeof info.name).toBe("string");
      expect(info.symbol).toMatch(/[A-Z]+/);
      expect(typeof info.decimals).toBe("number");
      expect(typeof info.totalSupply).toBe("number");
      expect(info.totalSupply).toBeGreaterThan(99999);
      expect(info.balance).toBeUndefined();
    });
  });

  test("with balance", async () => {
    const tokensInfo = await getTokens(
      TESTNET_URL,
      [
        CONST.CONTRACTS.TEST_RPX,
        CONST.CONTRACTS.TEST_LWTF,
        CONST.CONTRACTS.TEST_NXT,
      ],
      "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
    );

    expect(tokensInfo.length).toBe(3);

    Object.keys(tokensInfo).map((key) => {
      const info = tokensInfo[key];

      expect(typeof info.name).toBe("string");
      expect(info.symbol).toMatch(/[A-Z]+/);
      expect(typeof info.decimals).toBe("number");
      expect(typeof info.totalSupply).toBe("number");
      expect(info.totalSupply).toBeGreaterThan(99999);
      expect(info.balance).toBeDefined();
      const balanceNum = info.balance.toNumber();
      expect(balanceNum).toBeGreaterThan(0);
    });
  });
});
