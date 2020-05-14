import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);

const { rpc, wallet, u } = neonJs;

const net = "MainNet";
const addr = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
neonJs.settings.networks[net] = new rpc.Network({
  Name: "MainNet",
  ExtraConfiguration: {
    neoscan: "https://api.neoscan.io/api/main_net",
  },
});

const provider = new neonJs.api.neoscan.instance("MainNet");
const invalidAddr = "address";
describe(`Valid Address: ${provider.name}`, () => {
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

  test("httpsOnly getRPCEndpoint", async () => {
    expect(neonJs.settings.httpsOnly).toBe(false);
    neonJs.settings.httpsOnly = true;
    expect(neonJs.settings.httpsOnly).toBe(true);
    const result = await provider.getRPCEndpoint();
    expect(typeof result === "string").toBeTruthy();
    expect(result).toEqual(expect.stringContaining("https://"));
  });

  test("getTransactionHistory", async () => {
    const result = await provider.getTransactionHistory(addr);
    expect(result).toBeInstanceOf(Array);
  });

  test("getHeight", async () => {
    const result = await provider.getHeight();
    expect(typeof result === "number").toBeTruthy();
  });
});

describe(`Invalid Address: ${provider.name}`, () => {
  test("getBalance", async () => {
    const result = await provider.getBalance(invalidAddr);
    expect(result).toBeInstanceOf(wallet.Balance);
    expect(result.assetSymbols).toEqual([]);
    expect(result.tokenSymbols).toEqual([]);
  });

  test("getClaims", async () => {
    const result = await provider.getClaims(invalidAddr);
    expect(result).toBeInstanceOf(wallet.Claims);
    expect(result.claims).toEqual([]);
  });

  test("getMaxClaimAmount", async () => {
    const result = await provider.getMaxClaimAmount(invalidAddr);
    expect(result).toBeInstanceOf(u.Fixed8);
    expect(result).toEqual(new u.Fixed8(0));
  });

  test("getTransactionHistory", async () => {
    const result = await provider.getTransactionHistory(invalidAddr);
    expect(result).toEqual([]);
  });
});
