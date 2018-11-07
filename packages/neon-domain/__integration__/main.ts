import * as neonCore from "@cityofzion/neon-core";
import domainPlugin from "../src/index";

const neonJs = domainPlugin(neonCore);
const { CONST, rpc, u, api, wallet } = neonJs;

let MAINNET_URL = "";
let provider;

const MAINNET_URLS = [
  "http://seed3.neo.org:10332",
  "http://seed4.neo.org:10332",
  "http://seed5.neo.org:10332"
];

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
      "test.neo",
      "neo"
    );
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
