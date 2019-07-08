---
id: first
title: Smart Contract
---

## A simple NEP-5 smart contract

```python
from boa.interop.Neo.Runtime import Log, Notify
from boa.interop.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.interop.Neo.Transaction import *
from boa.interop.Neo.Blockchain import GetHeight, GetHeader
from boa.interop.Neo.Action import RegisterAction
from boa.interop.Neo.Runtime import GetTrigger, CheckWitness
from boa.interop.Neo.TriggerType import Application, Verification
from boa.interop.Neo.Output import GetScriptHash, GetValue, GetAssetId
from boa.interop.Neo.Storage import GetContext, Get, Put, Delete
from boa.interop.Neo.Header import GetTimestamp, GetNextConsensus
from boa.builtins import concat
# import binascii
 
 
# -------------------------------------------
# TOKEN SETTINGS
# -------------------------------------------
 
OWNER = b'#\xba\'\x03\xc52c\xe8\xd6\xe5"\xdc2 39\xdc\xd8\xee\xe9'
# ME = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y"
# OWNER = binascii.hexlify(ME.encode('utf8'))
NEO_ASSET_ID = b'\x9b|\xff\xda\xa6t\xbe\xae\x0f\x93\x0e\xbe`\x85\xaf\x90\x93\xe5\xfeV\xb3J\\"\x0c\xcd\xcfn\xfc3o\xc5'
 
# Script hash of the contract owner
 
# Name of the Token
TOKEN_NAME = 'Wafei-Token'
 
# Symbol of the Token
TOKEN_SYMBOL = 'HHB'
 
# Number of decimal places
TOKEN_DECIMALS = 8
 
# Total Supply of tokens in the system
# 0.1billion total supply * 10^8 ( decimals)
TOKEN_TOTAL_SUPPLY = 1000000000 * 100000000
 
ctx = GetContext()
 
# -------------------------------------------
# Events
# -------------------------------------------
 
OnTransfer = RegisterAction('transfer', 'addr_from', 'addr_to', 'amount')
OnApprove = RegisterAction('approve', 'addr_from', 'addr_to', 'amount')
 
 
def Main(operation, args):
    """
    This is the main entry point for the Smart Contract
    :param operation: the operation to be performed ( eg `balanceOf`, `transfer`, etc)
    :type operation: str
    :param args: a list of arguments ( which may be empty, but not absent )
    :type args: list
    :return: indicating the successful execution of the smart contract
    :rtype: bool
    """
 
    # The trigger determines whether this smart contract is being
    # run in 'verification' mode or 'application'
 
    trigger = GetTrigger()
 
    # 'Verification' mode is used when trying to spend assets ( eg NEO, Gas)
    # on behalf of this contract's address
    if trigger == Verification():
 
        # if the script that sent this is the owner
        # we allow the spend
        is_owner = CheckWitness(OWNER)
 
        if is_owner:
 
            return True
 
        return False
 
    # 'Application' mode is the main body of the smart contract
    elif trigger == Application():
 
        if operation == 'deploy':
            return deploy()
 
        elif operation == 'name':
            return TOKEN_NAME
 
        elif operation == 'decimals':
            return TOKEN_DECIMALS
 
        elif operation == 'symbol':
            return TOKEN_SYMBOL
 
        elif operation == 'totalSupply':
            return TOKEN_TOTAL_SUPPLY
 
        elif operation == 'balanceOf':
            if len(args) == 1:
                account = args[0]
                return do_balance_of(ctx, account)
 
        elif operation == 'transfer':
            if len(args) == 3:
                t_from = args[0]
                t_to = args[1]
                t_amount = args[2]
                return do_transfer(ctx, t_from, t_to, t_amount)
            else:
                return False
 
        elif operation == 'transferFrom':
            if len(args) == 3:
                t_from = args[0]
                t_to = args[1]
                t_amount = args[2]
                return do_transfer_from(ctx, t_from, t_to, t_amount)
            else:
                return False
 
        elif operation == 'approve':
            if len(args) == 3:
                t_owner = args[0]
                t_spender = args[1]
                t_amount = args[2]
                return do_approve(ctx, t_owner, t_spender, t_amount)
            else:
                return False
 
        elif operation == 'mintTokens':
            domint = mint_tokens()
            print("minted token!")
            return domint
 
        elif operation == 'allowance':
            if len(args) == 2:
                t_owner = args[0]
                t_spender = args[1]
                return do_allowance(ctx, t_owner, t_spender)
            else:
                return False
 
        return 'unknown operation'
 
    return False
 
 
def do_balance_of(ctx, account):
    """
    Method to return the current balance of an address
    :param account: the account address to retrieve the balance for
    :type account: bytearray
    :return: the current balance of an address
    :rtype: int
    """
 
    if len(account) != 20:
        return 0
 
    return Get(ctx, account)
 
 
def do_transfer(ctx, t_from, t_to, amount):
    """
    Method to transfer NEP5 tokens of a specified amount from one account to another
    :param t_from: the address to transfer from
    :type t_from: bytearray
    :param t_to: the address to transfer to
    :type t_to: bytearray
    :param amount: the amount of NEP5 tokens to transfer
    :type amount: int
    :return: whether the transfer was successful
    :rtype: bool
    """
 
    if amount <= 0:
        return False
 
    if len(t_from) != 20:
        return False
 
    if len(t_to) != 20:
        return False
 
    if CheckWitness(t_from):
 
        if t_from == t_to:
            print("transfer to self!")
            return True
 
        from_val = Get(ctx, t_from)
 
        if from_val < amount:
            print("insufficient funds")
            return False
 
        if from_val == amount:
            Delete(ctx, t_from)
 
        else:
            difference = from_val - amount
            print("difference:")
            print(difference)
            Put(ctx, t_from, difference)
 
        to_value = Get(ctx, t_to)
 
        to_total = to_value + amount
 
        print("to_total:")
        print(to_total)
 
        Put(ctx, t_to, to_total)
 
        OnTransfer(t_from, t_to, amount)
 
        return True
    else:
        print("from address is not the tx sender")
 
    return False
 
 
def do_transfer_from(ctx, t_from, t_to, amount):
    """
    Method to transfer NEP5 tokens of a specified amount from one account to another
    :param t_from: the address to transfer from
    :type t_from: bytearray
    :param t_to: the address to transfer to
    :type t_to: bytearray
    :param amount: the amount of NEP5 tokens to transfer
    :type amount: int
    :return: whether the transfer was successful
    :rtype: bool
    """
 
    if amount <= 0:
        return False
 
    if len(t_from) != 20:
        return False
 
    if len(t_to) != 20:
        return False
 
    available_key = concat(t_from, t_to)
 
    available_to_to_addr = Get(ctx, available_key)
 
    if available_to_to_addr < amount:
        print("Insufficient funds approved")
        return False
 
    from_balance = Get(ctx, t_from)
 
    if from_balance < amount:
        print("Insufficient tokens in from balance")
        return False
 
    to_balance = Get(ctx, t_to)
 
    new_from_balance = from_balance - amount
 
    new_to_balance = to_balance + amount
 
    Put(ctx, t_to, new_to_balance)
    Put(ctx, t_from, new_from_balance)
 
    print("transfer complete")
 
    new_allowance = available_to_to_addr - amount
 
    if new_allowance == 0:
        print("removing all balance")
        Delete(ctx, available_key)
    else:
        print("updating allowance to new allowance")
        Put(ctx, available_key, new_allowance)
 
    OnTransfer(t_from, t_to, amount)
 
    return True
 
 
def mint_tokens():
    """
    Method for an address to call in order to deposit NEO into the NEP5 token owner's address in exchange for a calculated amount of NEP5 tokens
    :return: whether the token minting was successful
    :rtype: bool
    """
    print("minting tokens!")
 
    tx = GetScriptContainer()
 
    references = tx.References
 
    if len(references) < 1:
        print("no neo attached")
        return False
 
    reference = references[0]
#    sender = reference.ScriptHash
 
    sender = GetScriptHash(reference)
 
    value = 0
    output_asset_id = GetAssetId(reference)
    if output_asset_id == NEO_ASSET_ID:
 
        receiver = GetExecutingScriptHash()
        for output in tx.Outputs:
            shash = GetScriptHash(output)
            print("getting shash..")
            if shash == receiver:
                print("adding value?")
                output_val = GetValue(output)
                value = value + output_val
 
        print("getting rate")
        rate = 100
        print("got rate")
 
        num_tokens = value * rate
 
        context = GetContext()
 
        sender_balance = Get(context, sender)
 
        new_sender_balance = num_tokens + sender_balance
 
        Put(context, sender, new_sender_balance)
 
        owner_balance = Get(context, OWNER)
 
        new_owner_balance = owner_balance - num_tokens
 
        Put(context, OWNER, new_owner_balance)
 
        OnTransfer(OWNER, sender, num_tokens)
 
        return True
 
    return False
 
 
def do_approve(ctx, t_owner, t_spender, amount):
    """
    Method by which the owner of an address can approve another address
    ( the spender ) to spend an amount
    :param t_owner: Owner of tokens
    :type t_owner: bytearray
    :param t_spender: Requestor of tokens
    :type t_spender: bytearray
    :param amount: Amount requested to be spent by Requestor on behalf of owner
    :type amount: bytearray
    :return: success of the operation
    :rtype: bool
    """
 
    if len(t_owner) != 20:
        return False
 
    if len(t_spender) != 20:
        return False
 
    if not CheckWitness(t_owner):
        return False
 
    if amount < 0:
        return False
 
    # cannot approve an amount that is
    # currently greater than the from balance
    if Get(ctx, t_owner) >= amount:
 
        approval_key = concat(t_owner, t_spender)
 
        if amount == 0:
            Delete(ctx, approval_key)
        else:
            Put(ctx, approval_key, amount)
 
        OnApprove(t_owner, t_spender, amount)
 
        return True
 
    return False
 
 
def do_allowance(ctx, t_owner, t_spender):
    """
    Gets the amount of tokens that a spender is allowed to spend
    from the owners' account.
    :param t_owner: Owner of tokens
    :type t_owner: bytearray
    :param t_spender: Requestor of tokens
    :type t_spender: bytearray
    :return: Amount allowed to be spent by Requestor on behalf of owner
    :rtype: int
    """
 
    if len(t_owner) != 20:
        return False
 
    if len(t_spender) != 20:
        return False
 
    return Get(ctx, concat(t_owner, t_spender))
 
 
def deploy():
    """
    Method for the NEP5 Token owner to use in order to deploy an initial amount of tokens to their own address
    :return: whether the deploy was successful
    :rtype: bool
    """
    print("deploying!")
 
    isowner = CheckWitness(OWNER)
 
    if isowner:
 
        context = GetContext()
 
        Log("WILL DEPLOY!")
 
        Put(context, OWNER, TOKEN_TOTAL_SUPPLY)
 
        OnTransfer(0, OWNER, TOKEN_TOTAL_SUPPLY)
 
        return True
 
    print("only owner can deploy")
    return False
```



## Using Neon API to invoke contract

```javascript
const sb = Neon.create.scriptBuilder();
// fill your contract script hash, function name and parameters
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
 
// Returns a hexstring
const script = sb.str;
console.log(script);
 
const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333",
  account: account1, // The sending Account
  script: script, // The Smart Contract invocation script
  gas: 0, //This is additional gas paying to system fee.
  fees: 0 //Additional gas paying for network fee(prioritizing, oversize transaction).
};
 
// Neon API
Neon.doInvoke(config)
 .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
 })
 .catch(config => {
    console.log(config);
 });
```



## Using NEO-Scan API to invoke contract

```javascript
// fill your contract script hash, function name and parameters
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "name",
  args: []
};
 
const script = Neon.create.script(props);
 
// create transaction using NEO-Scan API
async function createTxByNeoScan() {
  let balance = await apiProvider.getBalance(account1.address);
  let transaction = new tx.InvocationTransaction({
    script: script,
    gas: 0
  });
 
  transaction.addAttribute(
    tx.TxAttrUsage.Script,
    u.reverseHex(wallet.getScriptHashFromAddress(account1.address))
  );
 
  transaction.calculate(balance).sign(account1.privateKey);
  return transaction;
}
 
// Send raw transaction
const client = new rpc.RPCClient("http://localhost:30333");
createTxByNeoScan().then(transaction => {
  client
    .sendRawTransaction(transaction)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
});
```



## Invoking Contract by constructing invocation transaction

```javascript
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "symbol",
  args: []
};
const script = Neon.create.script(props);
 
 
// create raw invocation transaction
let rawTransaction = new tx.InvocationTransaction({
  script: script,
  gas: 0
});
 
// build input objects and output objects.
rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(account1.address))
);
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  account1.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, account1.publicKey)
);
 
// Send raw transaction
const client = new rpc.RPCClient("http://localhost:30333");
client
  .sendRawTransaction(rawTransaction)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```



## Local Invocation(Will not send to the NEO blockchain)

```javascript
const sb = Neon.create.scriptBuilder();
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
// Returns a hexstring
const script = sb.str;
 
// Using RPC Query to do local invocation
rpc.Query.invokeScript(script)
  .execute("http://localhost:30333")
  .then(res => {
    console.log(res.result);
  })
  .catch(config => {
    console.log(config);
  });
```

