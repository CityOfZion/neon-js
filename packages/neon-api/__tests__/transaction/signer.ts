import { TransactionSigner, TransactionBuilder } from "../../src/transaction";
import { wallet, tx, u } from "@cityofzion/neon-core";

const createTransaction = () => {
  return new TransactionBuilder({ nonce: 1 }).build();
};

const PRIVATE_KEYS = [
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69",
  "ea348e0198f0979ffa5bca238c0a03dc0f72d2681e3378fee4ab27effaf220d6",
  "0efb5d4705d4d17b82d18adf8507d0931aa00a97e062fcbf7afef4176b143fe3"
];

const ACCOUNTS = PRIVATE_KEYS.map(key => new wallet.Account(key));

const ACCOUNTS_WITNESSES: Array<tx.WitnessLike> = [
  {
    invocationScript:
      "4049f90f231be07b102041f85e93c5738921e884657b665f98210284fb0e5d017697e140ba6539abec41f9683605d3fff76d7063144c84026c7823c6e99624a4f9",
    verificationScript: ACCOUNTS[0].contract.script
  },
  {
    invocationScript:
      "4003b00c3d45fc65d06bd05ec9cedfc4a9b1fbb567c30949bffc9c4c7472a76c0b86d678f46c17a46e26de2b92af7728949036bd6215a3a42428c44e1d1098e60a",
    verificationScript: ACCOUNTS[1].contract.script
  }
];

const MULTISIG_ACCOUNT = wallet.Account.createMultiSig(
  2,
  ACCOUNTS.map(account => account.publicKey)
);

describe("signWithAccount", () => {
  test("single private key", () => {
    const transaction = createTransaction();
    TransactionSigner.signWithAccount(transaction, PRIVATE_KEYS[0]);
    expect(transaction.scripts[0].export()).toEqual(ACCOUNTS_WITNESSES[0]);
  });

  test("single account", () => {
    const transaction = createTransaction();
    TransactionSigner.signWithAccount(transaction, ACCOUNTS[1]);
    expect(transaction.scripts[0].export()).toEqual(ACCOUNTS_WITNESSES[1]);
  });

  test("multi private keys or accounts", () => {
    const transaction = createTransaction();
    TransactionSigner.signWithAccount(
      transaction,
      PRIVATE_KEYS[0],
      ACCOUNTS[1]
    );
    expect(transaction.scripts[0].export()).toEqual(ACCOUNTS_WITNESSES[0]);
    expect(transaction.scripts[1].export()).toEqual(ACCOUNTS_WITNESSES[1]);
  });
});

describe("signWithWitness", () => {
  test("single witness", () => {
    const transaction = createTransaction();
    TransactionSigner.signWithWitness(
      transaction,
      new tx.Witness(ACCOUNTS_WITNESSES[0])
    );
    expect(transaction.scripts[0].export()).toEqual(ACCOUNTS_WITNESSES[0]);
  });

  test("multiple witnesses", () => {
    const transaction = createTransaction();
    TransactionSigner.signWithWitness(
      transaction,
      new tx.Witness(ACCOUNTS_WITNESSES[0]),
      new tx.Witness(ACCOUNTS_WITNESSES[1])
    );
    expect(transaction.scripts[0].export()).toEqual(ACCOUNTS_WITNESSES[0]);
    expect(transaction.scripts[1].export()).toEqual(ACCOUNTS_WITNESSES[1]);
  });
});

describe("addMultiSig", () => {
  test("addMultiSig", () => {
    const transaction = createTransaction();
    transaction.sender = u.reverseHex(MULTISIG_ACCOUNT.scriptHash);
    TransactionSigner.addMultiSig(
      transaction,
      MULTISIG_ACCOUNT,
      ...ACCOUNTS_WITNESSES.map(obj => new tx.Witness(obj))
    );
    expect(transaction.scripts[0].export()).toEqual({
      invocationScript:
        "4049f90f231be07b102041f85e93c5738921e884657b665f98210284fb0e5d017697e140ba6539abec41f9683605d3fff76d7063144c84026c7823c6e99624a4f94003b00c3d45fc65d06bd05ec9cedfc4a9b1fbb567c30949bffc9c4c7472a76c0b86d678f46c17a46e26de2b92af7728949036bd6215a3a42428c44e1d1098e60a",
      verificationScript:
        "5221031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92103767002bb9f74317035ce8d557a3aed30ce831eb16b5f636a139dad0b07916bed210329898e6e5e0a2f175e205b4019c500d6bb69203b56470ec2fc8ab0a4c065e16d5368c7c34cba"
    });
  });
});
