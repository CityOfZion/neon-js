import { rpc, settings, u, wallet } from "@cityofzion/neon-core";
import { neoscan } from "../../src";

const net = "MainNet";
const addr = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
settings.addNetwork(
  new rpc.Network({
    Name: "MainNet",
    ExtraConfiguration: {
      neoscan: "https://api.neoscan.io/api/main_net"
    }
  })
);
const providers = [neoscan];
providers.forEach(api => {
  describe(`Valid Address: ${api.name}`, () => {
    test("getBalance", async () => {
      const result = await api.getBalance(net, addr);
      expect(result).toBeInstanceOf(wallet.Balance);
    });

    test("getClaims", async () => {
      const result = await api.getClaims(net, addr);
      expect(result).toBeInstanceOf(wallet.Claims);
    });

    test("getMaxClaimAmount", async () => {
      const result = await api.getMaxClaimAmount(net, addr);
      expect(result).toBeInstanceOf(u.Fixed8);
    });

    test("getRPCEndpoint", async () => {
      const result = await api.getRPCEndpoint(net);
      expect(typeof result === "string").toBeTruthy();
    });

    test("getTransactionHistory", async () => {
      const result = await api.getTransactionHistory(net, addr);
      expect(result).toBeInstanceOf(Array);
    });

    test("getHeight", async () => {
      const result = await api.getHeight(net);
      expect(typeof result === "number").toBeTruthy();
    });
  });
});

const emptyAddr = "address";
providers.forEach(api => {
  describe(`Empty Address: ${api.name}`, () => {
    test("getBalance", async () => {
      const result = await api.getBalance(net, emptyAddr);
      expect(result).toBeInstanceOf(wallet.Balance);
      expect(result.assetSymbols).toEqual([]);
      expect(result.tokenSymbols).toEqual([]);
    });

    test("getClaims", async () => {
      const result = await api.getClaims(net, emptyAddr);
      expect(result).toBeInstanceOf(wallet.Claims);
      expect(result.claims).toEqual([]);
    });

    test("getMaxClaimAmount", async () => {
      const result = await api.getMaxClaimAmount(net, emptyAddr);
      expect(result).toBeInstanceOf(u.Fixed8);
      expect(result).toEqual(new u.Fixed8(0));
    });

    test("getTransactionHistory", async () => {
      const result = await api.getTransactionHistory(net, emptyAddr);
      expect(result).toEqual([]);
    });
  });
});
