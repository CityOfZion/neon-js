import { getTokenBalance, getTokenBalances, getTokens } from "../src/main";
import { u, rpc } from "@cityofzion/neon-core";
describe("regression", () => {
  test("getTokenBalance", async () => {
    const client = new rpc.RPCClient("");
    client.invokeScript = jest.fn().mockImplementation(() => ({
      script: "",
      state: "HALT",
      gas_consumed: "0",
      stack: [
        {
          type: "Integer",
          value: "4",
        },
        {
          type: "Integer",
          value: "1234",
        },
      ],
    }));
    const scriptHash = "1234123412341234123412341234123412341234";
    const address = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
    const result = await getTokenBalance(client, scriptHash, address);

    expect(result).toStrictEqual(new u.Fixed8(0.1234));
  });

  test("getTokenBalances", async () => {
    const client = new rpc.RPCClient("");
    client.invokeScript = jest.fn().mockImplementation(() => ({
      script: "",
      state: "HALT",
      gas_consumed: "0",
      stack: [
        { type: "String", value: "414243" },
        {
          type: "Integer",
          value: "4",
        },
        {
          type: "Integer",
          value: "1234",
        },
        { type: "String", value: "444546" },
        {
          type: "Integer",
          value: "8",
        },
        {
          type: "Integer",
          value: "12345678",
        },
      ],
    }));
    const scriptHash = "1234123412341234123412341234123412341234";
    const address = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
    const result = await getTokenBalances(
      client,
      [scriptHash, scriptHash],
      address
    );

    expect(result).toMatchObject({
      ABC: new u.Fixed8(0.1234),
      DEF: new u.Fixed8(0.12345678),
    });
  });

  test("getTokens", async () => {
    const client = new rpc.RPCClient("");
    client.invokeScript = jest.fn().mockImplementation(() => ({
      script: "",
      state: "HALT",
      gas_consumed: "0",
      stack: [
        { type: "String", value: "616263" },
        { type: "String", value: "414243" },
        {
          type: "Integer",
          value: "4",
        },
        {
          type: "Integer",
          value: "10000",
        },
        {
          type: "Integer",
          value: "1234",
        },
        { type: "String", value: "646566" },
        { type: "String", value: "444546" },
        {
          type: "Integer",
          value: "8",
        },
        {
          type: "Integer",
          value: "200000000",
        },
        {
          type: "Integer",
          value: "12345678",
        },
      ],
    }));
    const scriptHash = "1234123412341234123412341234123412341234";
    const address = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
    const result = await getTokens(client, [scriptHash, scriptHash], address);

    expect(result).toEqual(
      expect.arrayContaining([
        {
          name: "abc",
          symbol: "ABC",
          decimals: 4,
          totalSupply: 1,
          balance: new u.Fixed8(0.1234),
        },
        {
          name: "def",
          symbol: "DEF",
          decimals: 8,
          totalSupply: 2,
          balance: new u.Fixed8(0.12345678),
        },
      ])
    );
  });
});
