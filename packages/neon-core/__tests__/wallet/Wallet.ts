import { Wallet } from "../../src/wallet/Wallet";
import Account from "../../src/wallet/Account";
import WALLET_JSON from "../testWallet.json";

const PASSWORD = "wallet";

describe("constructor & export", () => {
  test("constructor", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1",
    });
    expect(wallet.name).toBe("test");
    expect(wallet.version).toBe("1");
  });

  test("export", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1",
    });
    const exported = wallet.export();
    expect(exported.name).toBe("test");
    expect(exported.version).toBe("1");
  });
});

describe("add account, default account", () => {
  test("add account", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1",
    });
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].address));
    expect(wallet.accounts[0].address).toBe(WALLET_JSON.accounts[0].address);
  });

  test("default account", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1",
    });
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].address));
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].address));
    expect(wallet.defaultAccount.address).toBe(WALLET_JSON.accounts[0].address);
  });

  test("set default account", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1",
    });
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].address));
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].address));
    wallet.setDefault(1);
    expect(wallet.defaultAccount).toBe(wallet.accounts[1]);
  });
});

describe("encrypt", () => {
  test("success", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].extra.WIF));

    const result = await wallet.encrypt(0, PASSWORD);

    expect(result).toBeTruthy();
    expect(wallet.accounts[0].encrypted).toBe(WALLET_JSON.accounts[1].key);
  }, 10000);
  test("failure", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].extra.WIF));

    await expect(wallet.encrypt(-1, "badPassword")).rejects.toThrow();
  }, 10000);
});

describe("encryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].extra.WIF));
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].extra.WIF));

    const result = await wallet.encryptAll(PASSWORD);

    expect(result).toStrictEqual([true, true]);
    expect(wallet.accounts[0].encrypted).toBe(WALLET_JSON.accounts[0].key);
    expect(wallet.accounts[1].encrypted).toBe(WALLET_JSON.accounts[1].key);
  }, 20000);
});

describe("decrypt", () => {
  test("success", async () => {
    const wallet = new Wallet(WALLET_JSON);

    const result = await wallet.decrypt(0, PASSWORD);

    expect(result).toBeTruthy();
    expect(wallet.accounts[0].WIF).toBe(WALLET_JSON.accounts[0].extra.WIF);
  }, 10000);
  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decrypt(1, "passw0rd_failure")).rejects.toThrow();
  }, 10000);
});

describe("decryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet(WALLET_JSON);

    const result = await wallet.decryptAll(PASSWORD);

    expect(result).toStrictEqual([true, true, true, true, true, true]);
    expect(wallet.accounts[0].WIF).toBe(WALLET_JSON.accounts[0].extra.WIF);
  }, 20000);

  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decryptAll("passw0rd_failure")).rejects.toThrow();
  }, 20000);
});
