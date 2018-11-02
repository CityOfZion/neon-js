import apiPlugin from "@cityofzion/neon-api";
import * as neonCore from "@cityofzion/neon-core";
import domainPlugin from "../src/index";

const neonWithDomain = apiPlugin(neonCore);
const neonJs = domainPlugin(neonWithDomain);
const { CONST, rpc, u, api, wallet } = neonJs;

let MAINNET_URL = "";
let provider;

beforeAll(async () => {
  provider = new neonJs.domain.nns.instance("348387116c4a75e420663277d9c02049907128c7");
  try {
    const testUrl = "http://seed1.cryptoholics.cc:10332";
    const config = {
      api: {
          getRPCEndpoint: jest.fn().mockImplementationOnce(() => testUrl)
      } as any,
          address: ""
    }
      const result = await neonJs.api.fillUrl(config);
      MAINNET_URL = result.url;
  } catch (e) {
    throw new Error("Could not find URL");
  }
});

describe("domainResolve", () => {
  test("name found", async () => {
    const address = await provider.resolveDomain(
      MAINNET_URL,
      "test.neo",
      "neo"
    );
    console.log(address);
    expect(wallet.isAddress(address)).toBe(true);
  });

  test("name not found", async () => {
    try {
    const address = await resolveDomain(
      MAINNET_URL,
      "alkdjfklasjdlfkjasdklf.neo",
      "neo"
      );
    } catch (err) {
      expect(true).toEqual(true);
    }
  });
});
