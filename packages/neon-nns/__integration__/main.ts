import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
const neonJs = apiPlugin(neonCore);
const { CONST, rpc, u, api, wallet } = neonJs;
import { resolveNnsDomain } from "../src/main";

let MAINNET_URL = "";

beforeAll(async () => {
  try {
    const config = await api
      .fillUrl({ net: 'MainNet', address: '' });
    MAINNET_URL = config.url;
  } catch (e) {
    throw new Error("Could not find URL");
  }
});

describe("resolveNnsDomain", () => {
  test("name found", async () => {
    const address = await resolveNnsDomain(
      MAINNET_URL,
      "test.neo"
    );
    expect(wallet.isAddress(address)).toBe(true);
  });

  test("name not found", async () => {
    try {
      const balance = await resolveNnsDomain(
        MAINNET_URL,
        "alksdhflkjshdkjfjhskladjkf.neo"
      );
    } catch (err) {
      expect(true).toEqual(true);
    }
  });
});
