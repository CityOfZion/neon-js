import { wallet } from "../../src";
import { Transaction, TxAttrUsage } from "../../src/tx";
import { RPCClient } from "../../src/rpc";

const privateKey = "";
const url = "";

describe.skip("NEO3 transfer neo", async function() {
  const rpcClient = new RPCClient(url);
  const fromAccount = new wallet.Account(privateKey);
  const to = "";
  const amount = 10;
  const intent = {
    scriptHash: "NEO",
    operation: "transfer",
    args: [fromAccount.address, to, amount]
  };
  const validUntilBlock =
    Transaction.MAX_VALIDUNTILBLOCK_INCREMENT +
    (await rpcClient.getBlockCount());
  const invocation_tx = new Transaction({
    intents: [intent],
    sender: fromAccount.scriptHash,
    validUntilBlock
  });

  invocation_tx.sign(fromAccount);
  const result = await rpcClient.sendRawTransaction(invocation_tx);
  expect(result).toBe(true);
});
