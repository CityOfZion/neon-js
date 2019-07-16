import { sc, wallet, u } from "../../src";
import { Transaction, TxAttrUsage } from "../../src/tx_v3";
import { RPCClient } from "../../src/rpc";

const NEO_SCRIPTHASH = '';
const privateKey = '';
const url = '';

describe("NEO3 transfer neo", async function() {
    const fromAccount = new wallet.Account(privateKey);
    const to = '';
    const amount = 10;
    const script = sc.createScript({
        scriptHash: NEO_SCRIPTHASH,
        operation: 'transfer',
        args: [fromAccount.address, to, amount]
    });
    const invocation_tx = new Transaction({
        script,
        gas: 0
    });
    invocation_tx.addAttribute(
        TxAttrUsage.Script,
        u.reverseHex(wallet.getScriptHashFromAddress(fromAccount.address))
    );
    invocation_tx.addRemark(
        Date.now().toString() + u.ab2hexstring(u.generateRandomArray(4))
    );
    invocation_tx.sign(fromAccount);
    const rpcClient = new RPCClient(url);
    const result = await rpcClient.sendRawTransaction(invocation_tx);
    expect(result).toBe(true);
});