import Wallet from "../../src/wallet/Wallet";
import Account from "../../src/wallet/Account";

const PRIVATE_KEY1 =
  "a7b9775c6b9136bf89f63def7eab0c5f2d3d0c9e85492717f54386420cce5aa1";
const PRIVATE_KEY2 =
  "4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548";

const WALLET_JSON = {
  accounts: [
    {
      address: "AVA5bxQf8PwYbPsfaSQwULRNwnppX6Sv3d",
      contract: {
        deployed: false,
        parameters: [{ name: "signature", type: "Signature" }],
        script:
          "2102963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f568747476aa"
      },
      extra: {},
      isDefault: false,
      key: "6PYRxJ6TeM2MwRy3GtSFS7NawCig9QnU9Xp4a1PVzV9nzH1ScyToWsdTZt",
      label: "AVA5bxQf8PwYbPsfaSQwULRNwnppX6Sv3d",
      lock: false
    },
    {
      address: "AHbHRbqu6vheHZrLPXrMtwYxmuXxuHBzL2",
      contract: {
        deployed: false,
        parameters: [{ name: "signature", type: "Signature" }],
        script:
          "2103c663ba46afa8349f020eb9e8f9e1dc1c8e877b9d239e139af699049126e0f32168747476aa"
      },
      extra: {},
      isDefault: false,
      key: "6PYVDzdHsTKZMKVUfoCrMGWT58XJEtnS5YdS131UCu2xzXtbQK8KaGos8u",
      label: "AHbHRbqu6vheHZrLPXrMtwYxmuXxuHBzL2",
      lock: false
    }
  ],
  extra: {},
  name: "myWallet",
  scrypt: { n: 16384, p: 8, r: 8, size: 64 },
  version: "1.0"
};

describe("constructor & export", () => {
  test("constructor", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1"
    });
    expect(wallet.name).toBe("test");
    expect(wallet.version).toBe("1");
  });

  test("export", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1"
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
      version: "1"
    });
    wallet.addAccount(new Account(WALLET_JSON.accounts[0].address));
    expect(wallet.accounts[0].address).toBe(WALLET_JSON.accounts[0].address);
  });

  test("default account", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1"
    });
    wallet.addAccount(new Account(PRIVATE_KEY1));
    wallet.addAccount(new Account(PRIVATE_KEY2));
    expect(wallet.defaultAccount.privateKey).toBe(PRIVATE_KEY1);
  });

  test("set default account", () => {
    const wallet = new Wallet({
      name: "test",
      version: "1"
    });
    wallet.addAccount(new Account(PRIVATE_KEY1));
    wallet.addAccount(new Account(PRIVATE_KEY2));
    wallet.setDefault(1);
    expect(wallet.defaultAccount).toBe(wallet.accounts[1]);
  });
});

describe("encrypt", () => {
  test("success", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(PRIVATE_KEY1));
    wallet.addAccount(new Account(PRIVATE_KEY2));

    const result = await wallet.encrypt(0, "passw0rd");

    expect(result).toBeTruthy();
    expect(wallet.accounts[0].encrypted).toBe(
      "6PYRxJ6TeM2MwRy3GtSFS7NawCig9QnU9Xp4a1PVzV9nzH1ScyToWsdTZt"
    );
  });
  test("failure", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(PRIVATE_KEY1));
    wallet.addAccount(new Account(PRIVATE_KEY2));

    await expect(wallet.encrypt(-1, "passw0rd")).rejects.toThrow();
  });
});

describe("encryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet();
    wallet.addAccount(new Account(PRIVATE_KEY1));
    wallet.addAccount(new Account(PRIVATE_KEY2));

    const result = await wallet.encryptAll("passw0rd");

    expect(result).toStrictEqual([true, true]);
    expect(wallet.accounts[0].encrypted).toBe(
      "6PYRxJ6TeM2MwRy3GtSFS7NawCig9QnU9Xp4a1PVzV9nzH1ScyToWsdTZt"
    );
    expect(wallet.accounts[1].encrypted).toBe(
      "6PYVDzdHsTKZMKVUfoCrMGWT58XJEtnS5YdS131UCu2xzXtbQK8KaGos8u"
    );
  }, 20000);
});

describe("decrypt", () => {
  test("success", async () => {
    const wallet = new Wallet(WALLET_JSON);

    const result = await wallet.decrypt(0, "passw0rd");

    expect(result).toBeTruthy();
    expect(wallet.accounts[0].privateKey).toBe(PRIVATE_KEY1);
  });
  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decrypt(1, "passw0rd_failure")).rejects.toThrow();
  });
});

describe("decryptAll", () => {
  test("success", async () => {
    const wallet = new Wallet(WALLET_JSON);

    const result = await wallet.decryptAll("passw0rd");

    expect(result).toStrictEqual([true, true]);
    expect(wallet.accounts[0].privateKey).toBe(PRIVATE_KEY1);
  }, 20000);

  test("failure", async () => {
    const wallet = new Wallet(WALLET_JSON);

    await expect(wallet.decryptAll("passw0rd_failure")).rejects.toThrow();
  }, 20000);
});
