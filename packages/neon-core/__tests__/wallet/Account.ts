import Account, { AccountJSON } from "../../src/wallet/Account";
import { decrypt, encrypt } from "../../src/wallet/nep2";

jest.mock("../../src/wallet/nep2");

describe("constructor", () => {
  test.each([
    ["WIF", "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"],
    [
      "privateKey",
      "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
    ],
    [
      "publicKey",
      "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9"
    ],
    [
      "publicKeyUnencoded",
      "041d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c94617303f7408d9abfedfb6fbb00dd07e3e7735d918bbea7a7e2c1895ea1bc9b9"
    ],
    ["scriptHash", "5df31f6f59e6a4fbdd75103786bf73db1000b235"],
    ["address", "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s"]
  ])("%s", (msg: string, data: string) => {
    const result = new Account(data);
    expect(result instanceof Account).toBeTruthy();
    expect(result.address).toBe("ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s");
  });

  test("empty", () => {
    const result = new Account();

    expect(result instanceof Account).toBeTruthy();
    expect(result.privateKey).not.toBeNull();
    expect(result.address).not.toBeNull();
  });

  test("AccountJSON", () => {
    const testObject = {
      address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
      label: "addressA",
      isDefault: true,
      lock: false,
      key: "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF",
      contract: {
        script: "",
        parameters: [
          {
            name: "signature",
            type: "Signature"
          }
        ],
        deployed: false
      },
      extra: null
    } as AccountJSON;

    const result = new Account(testObject);
    expect(result instanceof Account).toBeTruthy();
    expect(result.address).toBe(testObject.address);
  });
});

describe("export", () => {
  test("AccountJSON", () => {
    const testObject = {
      address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
      label: "addressA",
      isDefault: true,
      lock: false,
      key: "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF",
      contract: {
        script: "",
        parameters: [
          {
            name: "signature",
            type: "Signature"
          }
        ],
        deployed: false
      },
      extra: {
        a: 1
      }
    } as AccountJSON;

    const acct = new Account(testObject);
    const result = acct.export();
    expect(result).toEqual(testObject);
  });
});

