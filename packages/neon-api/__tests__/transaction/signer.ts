import { TransactionSigner, TransactionBuilder } from "../../src/transaction";
import { wallet, tx, u } from "@cityofzion/neon-core";

const PRIVATE_KEYS = [
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
  "ea348e0198f0979ffa5bca238c0a03dc0f72d2681e3378fee4ab27effaf220d6",
  "0efb5d4705d4d17b82d18adf8507d0931aa00a97e062fcbf7afef4176b143fe3"
];

const ACCOUNTS = PRIVATE_KEYS.map(key => new wallet.Account(key));

const ACCOUNTS_WITNESSES: Array<tx.WitnessLike> = [
  {
    invocationScript:
      "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b06",
    verificationScript: ACCOUNTS[0].contract.script
  },
  {
    invocationScript:
      "40efe3ccf3a49dd670d8785a12218324f60a6b56ed5a628f15522b883a81b51ea9256c0be62008377b156eb1a76e6dc25aad776524c18eb01b0810ed833b15a1ca",
    verificationScript: ACCOUNTS[1].contract.script
  }
];

const MULTISIG_ACCOUNT = wallet.Account.createMultiSig(
  2,
  ACCOUNTS.map(account => account.publicKey)
);

const createTransactionSigner = (): TransactionSigner => {
  return new TransactionSigner(
    new TransactionBuilder({
      nonce: 1,
      sender: u.reverseHex(ACCOUNTS[0].scriptHash),
      cosigners: [
        {
          account: u.reverseHex(ACCOUNTS[1].scriptHash),
          scopes: tx.WitnessScope.Global
        },
        {
          account: u.reverseHex(ACCOUNTS[2].scriptHash),
          scopes: tx.WitnessScope.Global
        }
      ]
    }).build()
  );
};

describe("signWithAccount", () => {
  test("single private key", () => {
    const signer = createTransactionSigner();
    signer.signWithAccount(PRIVATE_KEYS[0]);
    expect(signer.transaction.scripts[0].export()).toEqual(
      ACCOUNTS_WITNESSES[0]
    );
  });

  test("single account", () => {
    const signer = createTransactionSigner();
    signer.signWithAccount(ACCOUNTS[1]);
    expect(signer.transaction.scripts[0].export()).toEqual(
      ACCOUNTS_WITNESSES[1]
    );
  });

  test("multi private keys or accounts", () => {
    const signer = createTransactionSigner();
    signer.signWithAccount(PRIVATE_KEYS[0], ACCOUNTS[1]);
    expect(signer.transaction.scripts[0].export()).toEqual(
      ACCOUNTS_WITNESSES[0]
    );
    expect(signer.transaction.scripts[1].export()).toEqual(
      ACCOUNTS_WITNESSES[1]
    );
  });

  test("invalid signing account", () => {
    const signer = createTransactionSigner();
    const signWithInvlidAccount = (): void => {
      signer.signWithAccount(new wallet.Account());
    };
    expect(signWithInvlidAccount).toThrowError();
  });
});

describe("signWithWitness", () => {
  test("single witness", () => {
    const signer = createTransactionSigner();
    signer.signWithWitness(new tx.Witness(ACCOUNTS_WITNESSES[0]));
    expect(signer.transaction.scripts[0].export()).toEqual(
      ACCOUNTS_WITNESSES[0]
    );
  });

  test("multiple witnesses", () => {
    const signer = createTransactionSigner();
    signer.signWithWitness(
      new tx.Witness(ACCOUNTS_WITNESSES[0]),
      new tx.Witness(ACCOUNTS_WITNESSES[1])
    );
    expect(signer.transaction.scripts[0].export()).toEqual(
      ACCOUNTS_WITNESSES[0]
    );
    expect(signer.transaction.scripts[1].export()).toEqual(
      ACCOUNTS_WITNESSES[1]
    );
  });

  test("invalid witness", () => {
    const signer = createTransactionSigner();
    const signWithInvalidWitness = (): void => {
      signer.signWithWitness(
        new tx.Witness({
          invocationScript: "abcd",
          verificationScript:
            "21032879f12ac79b9305bf768bb50f1c1c889330361fee037fe886f820bcaa521553ac"
        })
      );
    };
    expect(signWithInvalidWitness).toThrowError();
  });
});

describe("addMultiSig", () => {
  test("addMultiSig", () => {
    const signer = new TransactionSigner(
      new TransactionBuilder({
        nonce: 1,
        sender: u.reverseHex(MULTISIG_ACCOUNT.scriptHash)
      }).build()
    );
    signer.signWithMultiSigAccount(
      MULTISIG_ACCOUNT,
      ...ACCOUNTS_WITNESSES.map(obj => new tx.Witness(obj))
    );
    expect(signer.transaction.scripts[0].export()).toEqual({
      invocationScript:
        "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b0640efe3ccf3a49dd670d8785a12218324f60a6b56ed5a628f15522b883a81b51ea9256c0be62008377b156eb1a76e6dc25aad776524c18eb01b0810ed833b15a1ca",
      verificationScript:
        "5221031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92103767002bb9f74317035ce8d557a3aed30ce831eb16b5f636a139dad0b07916bed210329898e6e5e0a2f175e205b4019c500d6bb69203b56470ec2fc8ab0a4c065e16d5368c7c34cba"
    });
  });

  test("invalid addMultiSig", () => {
    const signer = createTransactionSigner();
    const signWithMultiAcc = (): void => {
      signer.signWithMultiSigAccount(
        MULTISIG_ACCOUNT,
        ...ACCOUNTS_WITNESSES.map(obj => new tx.Witness(obj))
      );
    };

    expect(signWithMultiAcc).toThrowError();
  });
});
