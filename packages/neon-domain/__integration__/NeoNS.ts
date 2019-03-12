import * as neonCore from "@cityofzion/neon-core";
import domainPlugin from "../src/index";

const neonJs = domainPlugin(neonCore);
const { rpc, wallet } = neonJs;

export function getMainnetUrls(): string[] {
    return [
        "http://seed1.ngd.network:10332",
        "http://seed2.ngd.network:10332",
        "http://seed3.ngd.network:10332",
        "http://seed4.ngd.network:10332",
        "http://seed5.ngd.network:10332",
        "http://seed6.ngd.network:10332",
        "http://seed7.ngd.network:10332",
        "http://seed8.ngd.network:10332",
        "http://seed9.ngd.network:10332",
        "http://seed10.ngd.network:10332",
        "https://seed0.cityofzion.io:443",
        "https://seed1.cityofzion.io:443",
        "https://seed2.cityofzion.io:443",
        "https://seed3.cityofzion.io:443",
        "https://seed4.cityofzion.io:443",
        "https://seed5.cityofzion.io:443",
        "https://seed6.cityofzion.io:443",
        "https://seed7.cityofzion.io:443",
        "https://seed8.cityofzion.io:443",
        "https://seed9.cityofzion.io:443"
    ]
};

let MAINNET_URL = "";
let provider;

const MAINNET_URLS = getMainnetUrls();

beforeAll(async () => {
  provider = new neonJs.domain.nns.instance(
    "348387116c4a75e420663277d9c02049907128c7"
  );

  for (let i = 0; i < MAINNET_URLS.length; i++) {
    try {
      await rpc.Query.getBlockCount().execute(MAINNET_URLS[i]);
      MAINNET_URL = MAINNET_URLS[i];
      break;
    } catch (e) {
      if (i === MAINNET_URLS.length) {
        throw new Error("Exhausted all urls but found no available RPC");
      }
      continue;
    }
  }
});

describe("domainResolve", () => {
  test("name found", async () => {
    const address = await provider.resolveDomain(
      MAINNET_URL,
      "test.neo"
    );
    expect(wallet.isAddress(address)).toBe(true);
  });

  test("name not found", async () => {
      const address = await provider.resolveDomain(
        MAINNET_URL,
        "alkdjfklasjdlfkjasdklf.neo"
      );
      expect(address).toMatch('');
  });
});
