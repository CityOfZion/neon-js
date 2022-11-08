import { TransactionBuilder } from "../../src/transaction";
import { CONST, sc, tx, u, wallet } from "@cityofzion/neon-core";

const account1 = new wallet.Account(
  "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
);
const account2 = new wallet.Account(
  "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
);

describe("setter", () => {
  describe("addSigner", () => {
    test("adds correctly", () => {
      const transaction = new TransactionBuilder()
        .addSigners(
          {
            account: account1.scriptHash,
            scopes: tx.WitnessScope.Global,
          },
          {
            account: account2.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          }
        )
        .addEmptyWitnesses(account1, account2)
        .build();
      expect(transaction.signers.map((s) => s.export())).toEqual([
        {
          account: account1.scriptHash,
          scopes: 128,
        },
        {
          account: account2.scriptHash,
          scopes: 1,
        },
      ]);
      expect(transaction.sender.toBigEndian()).toBe(account1.scriptHash);
    });

    test("dedup through merging", () => {
      const transaction = new TransactionBuilder()
        .addSigners(
          {
            account: account1.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          },
          {
            account: account1.scriptHash,
            scopes: tx.WitnessScope.CustomContracts,
            allowedContracts: ["0".repeat(40)],
          }
        )
        .addEmptyWitness(account1)
        .build();

      expect(transaction.signers.map((s) => s.export())).toEqual([
        {
          account: account1.scriptHash,
          allowedContracts: ["0".repeat(40)],
          scopes: 17,
        },
      ]);
    });
  });

  describe("addEmptyWitness", () => {
    test("adds empty witness", () => {
      const account = new wallet.Account(
        "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
      );

      const result = new TransactionBuilder()
        .addSigners({ account: account.scriptHash, scopes: "None" })
        .addEmptyWitness(account)
        .build();

      expect(result.witnesses.map((w) => w.export())).toEqual([
        {
          invocationScript: "",
          verificationScript:
            "0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef4156e7b327",
        },
      ]);
    });

    test("does not insert dups", () => {
      const account = new wallet.Account(
        "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
      );

      const result = new TransactionBuilder()
        .addSigners({ account: account.scriptHash, scopes: "None" })
        .addEmptyWitness(account)
        .addEmptyWitness(account)
        .build();

      expect(result.witnesses.map((w) => w.export())).toEqual([
        {
          invocationScript: "",
          verificationScript:
            "0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef4156e7b327",
        },
      ]);
    });
  });

  test("addContractCall", () => {
    const transaction = new TransactionBuilder()
      .addContractCall(
        {
          callFlags: sc.CallFlags.All,
          scriptHash: "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9",
          operation: "test",
          args: [
            sc.ContractParam.fromJson({
              type: "Integer",
              value: "1",
            }),
            sc.ContractParam.fromJson({
              type: "Integer",
              value: "2",
            }),
          ],
        },
        {
          callFlags: sc.CallFlags.All,
          scriptHash: "bd8bf7f95e33415fc242c48d143694a729172d9f",
          operation: "balanceOf",
          args: [
            sc.ContractParam.fromJson({
              type: "Hash160",
              value: "bd8bf7f95e33415fc242c48d143694a729172d9f",
            }),
          ],
        }
      )
      .build();
    expect(transaction.script.toBigEndian()).toBe(
      "121112c01f0c04746573740c14f91d6b7085db7c5aaf09f19eeec1ca3c0db2c6ec41627d5b52" +
        "0c149f2d1729a79436148dc442c25f41335ef9f78bbd11c01f0c0962616c616e63654f660c149f2d1729a79436148dc442c25f41335ef9f78bbd41627d5b52"
    );
  });

  test("setFee", () => {
    const transaction = new TransactionBuilder()
      .setSystemFee(u.BigInteger.fromNumber(10))
      .setNetworkFee(u.BigInteger.fromNumber(2))
      .build();
    expect(transaction.systemFee.equals(10)).toBeTruthy();
    expect(transaction.networkFee.equals(2)).toBeTruthy();
  });
});

describe("template methods", () => {
  test("addGasClaim", () => {
    const account = new wallet.Account(
      "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
    );

    const result = new TransactionBuilder().addGasClaim(account).build();

    expect(result).toMatchObject({
      nonce: expect.any(Number),
      script: u.HexString.fromHex(
        "00640c141c6815c82911c88c285d6f09cf8a65c4a7e6a6360c141c6815c82911c88c285d6f09cf8a65c4a7e6a63613c00c087472616e736665720c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b52"
      ),
      signers: [
        new tx.Signer({
          account: account.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        }),
      ],
      witnesses: [
        new tx.Witness({
          invocationScript: "",
          verificationScript:
            "0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef4156e7b327",
        }),
      ],
    });
  });

  test("addNep17Transfer", () => {
    const account = new wallet.Account(
      "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
    );
    const destination = "NMBfzaEq2c5zodiNbLPoohVENARMbJim1r";

    const result = new TransactionBuilder()
      .addNep17Transfer(
        account,
        destination,
        CONST.NATIVE_CONTRACT_HASH.GasToken,
        100
      )
      .build();

    expect(result).toMatchObject({
      nonce: expect.any(Number),
      script: u.HexString.fromHex(
        "00640c14fca95e252be6a90b54546707e77dbc9b3ec361540c141c6815c82911c88c285d6f09cf8a65c4a7e6a63613c00c087472616e736665720c14bcaf41d684c7d4ad6ee0d99da9707b9d1f0c8e6641627d5b52"
      ),
      signers: [
        new tx.Signer({
          account: account.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        }),
      ],
      witnesses: [
        new tx.Witness({
          invocationScript: "",
          verificationScript:
            "0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef4156e7b327",
        }),
      ],
    });
  });
});
