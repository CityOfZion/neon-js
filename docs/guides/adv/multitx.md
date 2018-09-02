---
id: multitx
title: Advanced - Sending multiple transactions in a block
---

In this tutorial, I shall go through how we can send multiple transactions within the same block.

If you have been using the current methods `sendAsset` and `doInvoke`, you would have realised that the second transaction coming out from the same address will fail if done quickly enough. This is due to the second transaction being unaware of the first transaction and thus it tries to spend the same inputs as the first transaction has used. Therefore, this is double spending and the node rejects our second transaction.

## A look at the Balance object

Within the Balance object, the assetBalance object looks like this::

```js
{
  balance: 1,
  spent: [],
  unspent: [
    { txid: 'abc', index: 0, value: 10 },
    { txid: 'abc', index: 1, value: 5 }
  ],
  unconfirmed: []
}
```

Other than `balance`, each of the arrays is a list of `Coin` objects that basically represent a spendable transaction output. When we are constructing a transaction involving assets, `neon-js` selects coins from the `unspent` array, selecting more until there is enough to meet the demand as stated in the `intents`. The selected coins are transformed and added to the transaction as `inputs` while the `intents` are transformed and added to the transaction as `outputs`.

Once the transaction is sent off to a RPC node, we should not reuse the selected coins as inputs for a second transaction as that would be double spending. However, if we were to retrieve a new `Balance` object from the 3rd party provider such as neoscan, the `Balance` object will not take in account the recently sent transaction.

## Applying Transaction

To deal with this problem, the program will have to retain the old `Balance` object and reuse it to make the second transaction. We register the transaction with the `Balance` object by calling the `applyTx` method:

```js
  const tx // We assume that this is a tx that sends 3 NEO away.
  console.log(tx.hash) // ghi
  balance.applyTx(tx)
```

Now, our asset balance should look like:

```js
{
  balance: 1,
  spent: [{ txid: 'abc', index: 0, value: 10 }],
  unspent: [{ txid: 'abc', index: 1, value: 5 }],
  unconfirmed: [
    // This is the change from spending the 5 neo
    { txid: 'ghi', index: 0, value: 2}
  ]
}
```

We can see that in order for us to send that 3 neo, we actually spent 5 neo and got back 2 neo. However, this effectively locks out 5 neo as we are unable to use that 2 neo until the transaction is confirmed. However, now we can create a new transaction without worry of double spending. Our second transaction can spend up to 10 neo.

## Confirming Transaction

Once the transaction is confirmed, we can always reset by grabbing a fresh `Balance` object by asking our 3rd party provider. But for cases where we do not want to do that, the `confirm` function is a simple function to move all `unconfirmed` coins to `unspent`:

```js
balance.confirm()
```

Now, our asset balance will look like:

```ja
{
  balance: 1,
  spent: [{ txid: 'abc', index: 0, value: 10 }],
  unspent: [
    { txid: 'abc',index: 0, value: 10 },
    { txid: 'ghi', index: 0, value: 2}
  ],
  unconfirmed: []
}
```
