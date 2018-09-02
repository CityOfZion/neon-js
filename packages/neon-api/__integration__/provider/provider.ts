import * as neonCore from "@cityofzion/neon-core";
import apiPlugin from "../../src/index";

const neonJs = apiPlugin(neonCore);

const { rpc, wallet, u } = neonJs;

const net = "MainNet";
const addr = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
neonJs.settings.networks[net] = new rpc.Network({
  Name: "MainNet",
  ExtraConfiguration: {
    neoscan: "https://api.neoscan.io/api/main_net"
  }
});

const providers = [new neonJs.api.neoscan.instance("MainNet")];
providers.forEach(api => {
  describe(`Valid Address: ${api.name}`, () => {
    test("getBalance", async () => {
      const result = await api.getBalance(addr);
      expect(result).toBeInstanceOf(wallet.Balance);
    });

    test("getClaims", async () => {
      const result = await api.getClaims(addr);
      expect(result).toBeInstanceOf(wallet.Claims);
    });

    test("getMaxClaimAmount", async () => {
      const result = await api.getMaxClaimAmount(addr);
      expect(result).toBeInstanceOf(u.Fixed8);
    });

    test("getRPCEndpoint", async () => {
      const result = await api.getRPCEndpoint();
      expect(typeof result === "string").toBeTruthy();
    });

    test("getTransactionHistory", async () => {
      const result = await api.getTransactionHistory(addr);
      expect(result).toBeInstanceOf(Array);
    });

    test("getHeight", async () => {
      const result = await api.getHeight();
      expect(typeof result === "number").toBeTruthy();
    });
  });
});

const emptyAddr = "address";
providers.forEach(api => {
  describe(`Empty Address: ${api.name}`, () => {
    test("getBalance", async () => {
      const result = await api.getBalance(emptyAddr);
      expect(result).toBeInstanceOf(wallet.Balance);
      expect(result.assetSymbols).toEqual([]);
      expect(result.tokenSymbols).toEqual([]);
    });

    test("getClaims", async () => {
      const result = await api.getClaims(emptyAddr);
      expect(result).toBeInstanceOf(wallet.Claims);
      expect(result.claims).toEqual([]);
    });

    test("getMaxClaimAmount", async () => {
      const result = await api.getMaxClaimAmount(emptyAddr);
      expect(result).toBeInstanceOf(u.Fixed8);
      expect(result).toEqual(new u.Fixed8(0));
    });

    test("getTransactionHistory", async () => {
      const result = await api.getTransactionHistory(emptyAddr);
      expect(result).toEqual([]);
    });
  });
});
