import Wallet from "../../src/wallet/Wallet";
import Account from "../../src/wallet/Account";

const WALLET_JSON = {
  name: null,
  version: "3.0",
  scrypt: { n: 16384, r: 8, p: 8 },
  accounts: [
    {
      address: "NMPAXGtMfZ8s8rcfP9JhrYrNeZHG4xSVmd",
      label: null,
      isDefault: false,
      lock: false,
      key: "6PYWdzMKHiZDc1ncwxhZJadWidj2gzca5AMiGHNKEVjsWkqJyH3fwhiSJs",
      contract: {
        script: "DCECAoqZgm7cDJfRjiK2kyNz2QjTI6p/kmVqd\u002Bwm6IYWme8LQQqQatQ=",
        parameters: [{ name: "signature", type: "Signature" }],
        deployed: false,
      },
      extra: {
        privateKey:
          "7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344",
        publicKey:
          "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
        wif: "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g",
      },
    },
    {
      address: "NRC6oteucWYXq7aASD6YWe5rNeXAw1ehye",
      label: null,
      isDefault: false,
      lock: false,
      key: "6PYLxXgqCV9CAc4RV1M8LfjnzXwusBhiBGcyWrjKaiAiixxuZ9W1S4biVd",
      contract: {
        script: "DCEDHY4WMM5kCWaWe8bZUiPSH0QwQTMAMUDDtSAE3JgTSckLQQqQatQ=",
        parameters: [{ name: "signature", type: "Signature" }],
        deployed: false,
      },
      extra: {
        privateKey:
          "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
        publicKey:
          "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
        wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG",
      },
    },
    {
      address: "NTFAwXLGoiWwSMP5vJyZp8K4cBFwrzUs8m",
      label: null,
      isDefault: false,
      lock: false,
      key: "6PYRoabFnnytJHdHDr6pdAaXvPsTfN2bbfzm2ff6ZTirRAXVWBBxPcKxcV",
      contract: {
        script: "DCECIyzo0uIGPc4EURMYUdR0Ib/E/B2k2xFvylMCwHVkYvoLQQqQatQ=",
        parameters: [{ name: "signature", type: "Signature" }],
        deployed: false,
      },
      extra: {
        privateKey:
          "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b",
        publicKey:
          "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa",
        wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG",
      },
    },
  ],
  extra: null,
};

const PASSWORD = "password";

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
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].extra.privateKey));

    const result = await wallet.encrypt(0, PASSWORD);

    expect(result).toBeTruthy();
    expect(wallet.accounts[0].encrypted).toBe(WALLET_JSON.accounts[1].key);
  });
  test("failure", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].extra.privateKey));

    await expect(wallet.encrypt(-1, "badPassword")).rejects.toThrow();
  });
});

describe("encryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].extra.privateKey));
    wallet.addAccount(new Account(WALLET_JSON.accounts[1].extra.privateKey));

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
    expect(wallet.accounts[0].privateKey).toBe(
      WALLET_JSON.accounts[0].extra.privateKey
    );
  });
  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decrypt(1, "passw0rd_failure")).rejects.toThrow();
  });
});

describe("decryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet(WALLET_JSON);

    const result = await wallet.decryptAll(PASSWORD);

    expect(result).toStrictEqual([true, true, true]);
    expect(wallet.accounts[0].privateKey).toBe(
      WALLET_JSON.accounts[0].extra.privateKey
    );
  }, 20000);

  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decryptAll("passw0rd_failure")).rejects.toThrow();
  }, 20000);
});
