import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);

const { wallet, u } = neonJs;

const addr = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
const invalidAddr = "address";
const emptyAddr = "AR6NuGFzZfzqbXR3YasfXNmR3VHVNKi2yo";

const DORA_TESTNET_URL = "https://dora.coz.io/api/v1/neo2/testnet";

const provider = new neonJs.api.dora.instance(DORA_TESTNET_URL);

test("getRPCEndpoint", async () => {
  const result = await provider.getRPCEndpoint();

  expect(result).toBeDefined();
});

describe("Valid Address", () => {
  test("getBalance", async () => {
    const result = await provider.getBalance(addr);
    expect(result).toBeInstanceOf(wallet.Balance);
    expect(Object.keys(result.assets).length).toBeGreaterThan(0);
  });

  test("getClaims", async () => {
    const result = await provider.getClaims(addr);
    expect(result).toBeInstanceOf(wallet.Claims);
    expect(result.claims.length).toBeGreaterThan(0);
  });

  test("getMaxClaimAmount", async () => {
    const result = await provider.getMaxClaimAmount(addr);
    expect(result).toBeInstanceOf(u.Fixed8);
    expect(result.gt(0, 10)).toBeTruthy();
  });

  test("getHeight", async () => {
    const result = await provider.getHeight();
    expect(typeof result === "number").toBeTruthy();
    expect(result).toBeGreaterThan(5000000);
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

  test("getTransactionHistory", async () => {
    expect(provider.getTransactionHistory(invalidAddr)).rejects.toThrowError();
  });
});
