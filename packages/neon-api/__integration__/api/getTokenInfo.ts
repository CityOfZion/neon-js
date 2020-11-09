import { rpc, CONST } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../../testHelpers";

import { getTokenInfo, TokenInfo } from "../../src/api/getTokenInfo";

let client: rpc.NeoServerRpcClient;

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
}, 20000);

describe("getTokenInfo", () => {
  test("NEO", async () => {
    const neoScriptHash = CONST.ASSET_ID["NEO"];
    const result = await getTokenInfo(neoScriptHash, client);
    expect(result).toStrictEqual({
      name: "NEO",
      symbol: "neo",
      decimals: 0,
      totalSupply: "100000000",
    } as TokenInfo);
  });

  test("GAS", async () => {
    const gasScriptHash = CONST.ASSET_ID["GAS"];
    const result = await getTokenInfo(gasScriptHash, client);
    expect(result).toStrictEqual({
      name: "GAS",
      symbol: "gas",
      decimals: 8,
      totalSupply: expect.any(String),
    } as TokenInfo);

    expect(parseInt(result.totalSupply)).toBeGreaterThan(0);
  });
});
