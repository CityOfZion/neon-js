import * as C from "../../src/wallet/core";

interface TestAccount {
  address: string;
  publicKey: string;
  privateKey: string;
  scriptHash: string;
  WIF: string;
}

describe.each([
  [
    "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
    {
      address: "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
      privateKey:
        "7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344",
      publicKey:
        "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
      WIF: "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g",
      scriptHash: "36a6e6a7c4658acf096f5d288cc81129c815681c",
    },
  ],
  [
    "NiwvMyWYeNghLG8tDyKkWwuZV3wS8CPrrV",
    {
      address: "NiwvMyWYeNghLG8tDyKkWwuZV3wS8CPrrV",
      privateKey:
        "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
      publicKey:
        "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
      WIF: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG",
      scriptHash: "5461c33e9bbc7de7076754540ba9e62b255ea9fc",
    },
  ],
  [
    "NTWHAzB82LRGWNuuqjVyyzpGvF3WxbbPoG",
    {
      address: "NTWHAzB82LRGWNuuqjVyyzpGvF3WxbbPoG",
      privateKey:
        "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b",
      publicKey:
        "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa",
      WIF: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG",
      scriptHash: "a38db239bb36ace1a69eb727a5b0157baa094653",
    },
  ],
])("Core: %s", (msg: string, data: TestAccount) => {
  test("WIF => privateKey", () => {
    const result = C.getPrivateKeyFromWIF(data.WIF);
    expect(result).toBe(data.privateKey);
  });

  test("privateKey => WIF", () => {
    const result = C.getWIFFromPrivateKey(data.privateKey);
    expect(result).toBe(data.WIF);
  });

  it("privateKey => publicKey", () => {
    const result = C.getPublicKeyFromPrivateKey(data.privateKey);
    expect(result).toBe(data.publicKey);
  });

  it("publicKey => scriptHash", () => {
    const result = C.getScriptHashFromPublicKey(data.publicKey);
    expect(result).toBe(data.scriptHash);
  });

  it("scriptHash => address", () => {
    const result = C.getAddressFromScriptHash(data.scriptHash);
    expect(result).toBe(data.address);
  });

  it("address => scriptHash", () => {
    const result = C.getScriptHashFromAddress(data.address);
    expect(result).toBe(data.scriptHash);
  });
});

describe("generate", () => {
  test("generate a private key", () => {
    const privateKey = C.generatePrivateKey();
    expect(privateKey.length).toBe(64);
  });
});

describe("Public key", () => {
  test("encode", () => {
    const result = C.getPublicKeyEncoded(
      "041d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c94617303f7408d9abfedfb6fbb00dd07e3e7735d918bbea7a7e2c1895ea1bc9b9"
    );

    expect(result).toBe(
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9"
    );
  });

  test("decode", () => {
    const result = C.getPublicKeyUnencoded(
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9"
    );
    expect(result).toBe(
      "041d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c94617303f7408d9abfedfb6fbb00dd07e3e7735d918bbea7a7e2c1895ea1bc9b9"
    );
  });
});
