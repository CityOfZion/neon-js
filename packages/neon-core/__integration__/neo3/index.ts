import { wallet } from "../../src";
import { Transaction, TxAttrUsage } from "../../src/tx";
import { RPCClient } from "../../src/rpc";

const privateKey = "";
const url = "";

// TODO: this is just test for neo3 functions, will be removed.
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
  const transaction1 = new Transaction({
    intents: [intent],
    sender: fromAccount.scriptHash,
    validUntilBlock
  });

  transaction1.sign(fromAccount);
  const result = await rpcClient.sendRawTransaction(transaction1);
  expect(result).toBe(true);
});
