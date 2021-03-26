import { CONST, rpc, sc, u, wallet } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../testHelpers";
import testWallet from "../../neon-core/__tests__/testWallet.json";
import { NetworkFacade } from "../src/NetworkFacade";
import { signWithAccount } from "../src/transaction";

let client: rpc.NeoServerRpcClient;
beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  client = new rpc.NeoServerRpcClient(url);
}, 20000);

describe("NetworkFacade", () => {
  test("transferToken", async () => {
    const facade = await NetworkFacade.fromConfig({ node: client });
    const fromAccount = new wallet.Account(testWallet.accounts[0]);

    await fromAccount.decrypt("wallet");

    const txid = await facade.transferToken(
      [
        {
          from: fromAccount,
          to: testWallet.accounts[1].address,
          contractHash: CONST.NATIVE_CONTRACT_HASH.GasToken,
          decimalAmt: 0.00000001,
        },
      ],
      {
        signingCallback: signWithAccount(fromAccount),
      }
    );

    expect(txid).toBeDefined();
  }, 30000);

  test("gasClaim", async () => {
    const facade = await NetworkFacade.fromConfig({ node: client });
    const acct = new wallet.Account(testWallet.accounts[1]);

    await acct.decrypt("wallet");

    const currentHeight = await facade.getRpcNode().getBlockCount();
    const unclaimedGasResult = await facade.invoke(
      sc.NeoContract.INSTANCE.unclaimedGas(acct.address, currentHeight)
    );

    const expectedMinGasClaimed = parseInt(
      unclaimedGasResult.stack[0].value as string
    );
    const txid = await facade.claimGas(acct, {
      signingCallback: signWithAccount(acct),
    });

    expect(txid).toBeDefined();

    await TestHelpers.sleep(2000);
    const rpcClient = new rpc.RPCClient(client.url);
    const logs = await rpcClient.getApplicationLog(txid);

    expect(logs.executions.length).toBe(1);
    expect(logs.executions[0].vmstate).toBe("HALT");
    // 2 notifications, 1 GAS & 1 NEO
    expect(logs.executions[0].notifications.length).toBe(2);

    const gasNotification = logs.executions[0].notifications.find((n) =>
      n.contract.includes(CONST.NATIVE_CONTRACT_HASH.GasToken)
    );
    if (gasNotification === undefined) {
      throw new Error("gasNotification is undefined");
    }

    // "from" field of null
    expect(gasNotification.state.value[0]).toEqual({ type: "Any" });
    // "to" field to self.
    expect(gasNotification.state.value[1]).toEqual({
      type: "ByteString",
      value: u.HexString.fromHex(acct.scriptHash).toBase64(true),
    });
    expect(
      parseInt(gasNotification.state.value[2].value as string)
    ).toBeGreaterThanOrEqual(expectedMinGasClaimed);
  }, 30000);

  test("vote", async () => {
    const facade = await NetworkFacade.fromConfig({ node: client });
    const votingAccount = new wallet.Account(testWallet.accounts[1]);
    await votingAccount.decrypt("wallet");

    const candidates = await facade.getCandidates();

    if (candidates.length === 0) {
      throw new Error("No candidates available to vote!");
    }
    const candidateToVoteFor = candidates[0];
    const currentVotes = candidateToVoteFor.votes;
    const txid = await facade.vote(
      votingAccount,
      candidateToVoteFor.publicKey,
      {
        signingCallback: signWithAccount(votingAccount),
      }
    );

    expect(txid).toBeDefined();

    await TestHelpers.sleep(2000);

    const candidatesAfterVoting = await facade.getCandidates();

    const newCandidateStatus = candidatesAfterVoting.find(
      (c) => c.publicKey === candidateToVoteFor.publicKey
    );

    const newVotes = newCandidateStatus.votes;
    expect(newVotes).toBeGreaterThan(currentVotes);
  });
});
