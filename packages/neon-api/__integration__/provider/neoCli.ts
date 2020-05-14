import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);

const { wallet, u } = neonJs;

const addr = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y";
const emptyAddr = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
const invalidAddr = "address";

const NEOCLI_URLS = [
  "http://seed1.ngd.network:10332",
  "http://seed2.ngd.network:10332",
  "http://seed3.ngd.network:10332",
  "http://seed4.ngd.network:10332",
  "http://seed5.ngd.network:10332",
  "http://seed6.ngd.network:10332",
  "http://seed7.ngd.network:10332",
  "https://seed0.cityofzion.io:443",
  "https://seed1.cityofzion.io:443",
  "https://seed2.cityofzion.io:443",
  "https://seed3.cityofzion.io:443",
];

let provider: import("../../src/provider/neoCli/class").NeoCli;
beforeAll(async () => {
  for (let i = 0; i < NEOCLI_URLS.length; i++) {
    try {
      provider = new neonJs.api.neoCli.instance(NEOCLI_URLS[i]);
      await provider.getRPCEndpoint();
      break;
    } catch (e) {
      if (i === NEOCLI_URLS.length - 1) {
        throw new Error("Exhausted all urls but found no available RPC");
      }
      continue;
    }
  }
});

describe(`Valid Address`, () => {
  test("getBalance", async () => {
    const result = await provider.getBalance(addr);
    expect(result).toBeInstanceOf(wallet.Balance);
  });

  test("getClaims", async () => {
    const result = await provider.getClaims(addr);
    expect(result).toBeInstanceOf(wallet.Claims);
  });

  test("getMaxClaimAmount", async () => {
    const result = await provider.getMaxClaimAmount(addr);
    expect(result).toBeInstanceOf(u.Fixed8);
  });

  test("getRPCEndpoint", async () => {
    const result = await provider.getRPCEndpoint();
    expect(typeof result === "string").toBeTruthy();
  });

  test.skip("getTransactionHistory", async () => {
    const result = await provider.getTransactionHistory(addr);
    expect(result).toBeInstanceOf(Array);
  });

  test("getHeight", async () => {
    const result = await provider.getHeight();
    expect(typeof result === "number").toBeTruthy();
  });
});

describe(`Empty Address`, () => {
  test("getBalance", async () => {
    const result = await provider.getBalance(emptyAddr);
    expect(result).toBeInstanceOf(wallet.Balance);
    expect(result.assetSymbols).toEqual([]);
    expect(result.tokenSymbols).toEqual([]);
  });

  test("getClaims", async () => {
    const result = await provider.getClaims(emptyAddr);
    expect(result).toBeInstanceOf(wallet.Claims);
    expect(result.claims).toEqual([]);
  });

  test("getMaxClaimAmount", async () => {
    const result = await provider.getMaxClaimAmount(emptyAddr);
    expect(result).toBeInstanceOf(u.Fixed8);
    expect(result).toEqual(new u.Fixed8(0));
  });

  test.skip("getTransactionHistory", async () => {
    const result = await provider.getTransactionHistory(emptyAddr);
    expect(result).toEqual([]);
  });
});

describe(`Invalid Address`, () => {
  test("getBalance", async () => {
    expect(provider.getBalance(invalidAddr)).rejects.toThrowError();
  });

  test("getClaims", async () => {
    expect(provider.getClaims(invalidAddr)).rejects.toThrowError();
  });

  test("getMaxClaimAmount", async () => {
    expect(provider.getMaxClaimAmount(invalidAddr)).rejects.toThrowError();
  });

  test.skip("getTransactionHistory", async () => {
    expect(provider.getMaxClaimAmount(invalidAddr)).rejects.toThrowError();
  });
});
