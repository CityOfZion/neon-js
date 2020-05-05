import * as NEP2 from "../../src/wallet/nep2";
import { isNEP2, isWIF } from "../../src/wallet/verify";
import testKeys from "../testKeys.json";

const simpleScrypt = {
  n: 256,
  r: 1,
  p: 1,
};

const simpleKeys = {
  a: {
    wif: "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g",
    passphrase: "city of zion",
    encryptedWif: "6PYWdzMKJHcbJp6o9jLWRxGEN4ZVRqawHYi8pnuuBSnDZJv7muQZngUaCo",
  },
  b: {
    wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG",
    passphrase: "password", //TODO: Test with chinese characters (我的密码)
    encryptedWif: "6PYLxXgqEDjfC2Fj1pwRQnWHcUtrxwecMLhrfH3X3G9V484b6sPRJffb7M",
  },
  c: {
    wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG",
    passphrase: "MyL33tP@33w0rd",
    encryptedWif: "6PYRoabFo7HiYco2NcaQzAdnyHWZvD3Wdq8FGhDbozNrhtKHnQVZsgKFRF",
  },
};

const neo2Keys = {
  a: {
    wif: "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g",
    passphrase: "city of zion",
    encryptedWif: "6PYLHmDf7R4im6NUF34MwcbViPpjwfdkrPMdFjuCXnEFmmK2A7AAzVAvTa",
  },
  b: {
    wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG",
    passphrase: "我的密码",
    encryptedWif: "6PYWVp3xerNdVMtSELSNZDBMP1qXrM1o6NrCQHqpeWLMd3rgeUE1rQuwrm",
  },
  c: {
    wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG",
    passphrase: "MyL33tP@33w0rd",
    encryptedWif: "6PYNoc1EFvW5rJD2Tg6k24xEVGZ56sY1YN5NG2sSF1qUKHy47uEwTkdcYs",
  },
};

// This uses default scrypt params
const testKey = testKeys.a;

describe("NEP2", () => {
  describe("Default", () => {
    test("encrypt", async () => {
      const result = await NEP2.encrypt(testKey.wif, testKey.passphrase);
      expect(isNEP2(result)).toBeTruthy();
      expect(result).toBe(testKey.encryptedWif);
    }, 10000);

    test("decrypt", async () => {
      const result = await NEP2.decrypt(
        testKey.encryptedWif,
        testKey.passphrase
      );
      expect(isWIF(result)).toBeTruthy();
      expect(result).toBe(testKey.wif);
    }, 10000);
  });

  describe.each([
    ["Basic", simpleKeys.a],
    ["Chinese", simpleKeys.b],
    ["Symbols", simpleKeys.c],
  ])(
    "%s",
    (
      msg: string,
      data: { wif: string; encryptedWif: string; passphrase: string }
    ) => {
      test("encrypt", async () => {
        const result = await NEP2.encrypt(
          data.wif,
          data.passphrase,
          simpleScrypt
        );
        expect(isNEP2(result)).toBeTruthy();
        expect(result).toBe(data.encryptedWif);
      });

      test("decrypt", async () => {
        const result = await NEP2.decrypt(
          data.encryptedWif,
          data.passphrase,
          simpleScrypt
        );
        expect(isWIF(result)).toBeTruthy();
        expect(result).toBe(data.wif);
      });
    }
  );

  describe("Error", () => {
    test("Errors on wrong password", () => {
      const thrower = NEP2.decrypt(
        simpleKeys.a.encryptedWif,
        "wrongpassword",
        simpleScrypt
      );
      expect(thrower).rejects.toThrow("Wrong password");
    });

    test("Errors on wrong scrypt params", () => {
      const thrower = NEP2.decrypt(
        simpleKeys.a.encryptedWif,
        simpleKeys.a.passphrase
      );
      expect(thrower).rejects.toThrow("scrypt parameters");
    });
  });
});

describe.each([
  ["Basic", neo2Keys.a],
  ["Chinese", neo2Keys.b],
  ["Symbols", neo2Keys.c],
])(
  "%s",
  (
    msg: string,
    data: { wif: string; encryptedWif: string; passphrase: string }
  ) => {
    test("decrypt neo2 key", async () => {
      const result = await NEP2.decryptNeo2(
        data.encryptedWif,
        data.passphrase,
        simpleScrypt
      );
      expect(isWIF(result)).toBeTruthy();
      expect(result).toBe(data.wif);
    });
  }
);
