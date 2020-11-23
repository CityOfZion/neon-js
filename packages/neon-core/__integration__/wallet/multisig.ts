import { rpc } from "../../src";
import { Account, Wallet } from "../../src/wallet";
import { createScript, ContractParam } from "../../src/sc";
import { Transaction, Witness, WitnessScope } from "../../src/tx";
import * as TestHelpers from "../../../../testHelpers";
import testWalletJson from "../../__tests__/testWallet.json";

const testWallet = new Wallet(testWalletJson);
let client: rpc.RPCClient;

beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.RPCClient(url);

  const firstBlock = await client.getBlock(0, true);
  expect(firstBlock.tx.length).toBe(1);
}, 30000);

describe("multisig", () => {
  test("signs and sends transaction", async () => {
    await testWallet.decrypt(0, "wallet");
    await testWallet.decrypt(1, "wallet");
    const multisigAcct = Account.createMultiSig(2, [
      testWallet.accounts[0].publicKey,
      testWallet.accounts[1].publicKey,
      testWallet.accounts[2].publicKey,
    ]);

    const script = createScript({
      scriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
      operation: "transfer",
      args: [
        ContractParam.hash160(multisigAcct.address),
        ContractParam.hash160(testWallet.accounts[0].address),
        ContractParam.integer(1),
      ],
    });

    const currentHeight = await client.getBlockCount();
    const tx = new Transaction({
      signers: [
        {
          account: multisigAcct.scriptHash,
          scopes: WitnessScope.CalledByEntry,
        },
      ],
      validUntilBlock: currentHeight + 1000000,
      systemFee: "100000001",
      networkFee: "100000001",
      script,
    })
      .sign(testWallet.accounts[0], 1234567890, 1024)
      .sign(testWallet.accounts[1], 1234567890, 1024);

    const multisigWitness = Witness.buildMultiSig(
      tx.serialize(false),
      tx.witnesses,
      multisigAcct
    );

    // Replace the single witnesses with the combined witness.
    tx.witnesses = [multisigWitness];

    const result = await client.sendRawTransaction(tx);
    expect(typeof result).toBe("string");
  }, 20000);
});
