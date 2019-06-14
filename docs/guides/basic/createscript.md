---
id: createscript
title: Basic - Create Smart Contract Script
---

This is a tutorial for constructing invocation scripts for invoking smart contract functions. This tutorial is specifically targeted at NEP5 contracts as it is currently the most common contract type.

The example I will be using for this tutorial can be found [here](https://github.com/neo-project/examples-csharp/blob/master/ICO_Template/ICO_Template.cs).

> Do note that this template is very outdated and should not be used as an actual ICO template.

## The parts

We first look at the entry method for the NEP5 contract. The entry method for smart contracts are always named `Main`

```c#
public static Object Main(string operation, params object[] args)
{
```

There are 2 arguments for the entry method: a string `operation` and an array `args`. This means that for every invocation script, the contract expects exactly 2 arguments.

Of course, this style is not enforced and you can have a smart contract that simply accepts an integer as the only argument. However, it is recommended that any complex contract implement this string and array pattern as it is super flexible and tools will most likely be built around serving this pattern.

## Simple calls with create.script

In `neon-js`, there is a simple way exposed to create an invocation script through the semantic call `Neon.create.script`. It is an alias for the method `Neon.sc.createScript`.

```js
const props = {
  scriptHash: '5b7074e873973a6ed3708862f219a6fbf4d1c411', // Scripthash for the contract
  operation: 'balanceOf', // name of operation to perform.
  args: [Neon.u.reverseHex('cef0c0fdcfe7838eff6ff104f9cdec2922297537')] // any optional arguments to pass in. If null, use empty array.
}

const script = Neon.create.script(props)
```

`script` is now a hexstring that you can use in an `invokescript` RPC call or an invocationTransaction.

```js
Neon.rpc.Query.invokeScript(script)
  .execute('http://seed3.neo.org:20332')
  .then(res => {
    console.log(res) // You should get a result with state: "HALT"
  })
```

Your console result should look something like this::

```js
{
    "jsonrpc": "2.0",
    "id": 1234,
    "result": {
        "script": "143775292229eccdf904f16fff8e83e7cffdc0f0ce51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b",
        "state": "HALT",
        "gas_consumed": "0.338",
        "stack": [
            {
                "type": "ByteArray",
                "value": "80778e06" // This value will vary
            }
        ]
    }
}
```

The `value` field is our result and we can turn that into a human readable form by parsing it as a Fixed8:

```js
Neon.u.Fixed8.fromReverseHex('80778e06')
```

> This is a generic case for NEP5 tokens with 8 decimals. Some tokens might require different parsing solutions.
> This will be covered in another tutorial or you can check out the source code under src/api/nep5 .

## Chaining scripts

Invocation transactions might be free now so we are fine with sending a transaction for every transfer but in the future, we want to aggregate them so we fully maximise the 10 free gas that we get per transaction. This is achieved by chaining scripts together.

`create.script` has the functionality built-in for us and let's us use it to retrieve all the information about a specific token.

There are many fields that we want to know about in an NEP5 token: name, decimals, total supply, etc. Instead of performing a `invokescript` RPC call for each field, we will be combining it in a single call. The example we are using here is the testnet contract for Red Pulse.

```js
  const scriptHash = '5b7074e873973a6ed3708862f219a6fbf4d1c411' // TestNet RPX

  const getName = { scriptHash, operation: 'name', args: [] }
  const getDecimals = { scriptHash, operation: 'decimals', args: [] }
  const getSymbol = { scriptHash, operation: 'symbol', args: [] }
  const getTotalSupply = { scriptHash, operation: 'totalSupply', args: [] }

  const script = Neon.create.script(getName, getDecimals, getSymbol, getTotalSupply)
```

Similar to the previous example, our `script` is now ready to be used in a `invokescript` RPC call or an invocationTransaction.

Now our result would look like:

```js
{
    "jsonrpc": "2.0",
    "id": 1234,
    "result": {
        "script": "00c1046e616d656711c4d1f4fba619f2628870d36e3a9773e874705b00c108646563696d616c736711c4d1f4fba619f2628870d36e3a9773e874705b00c10673796d626f6c6711c4d1f4fba619f2628870d36e3a9773e874705b00c10b746f74616c537570706c796711c4d1f4fba619f2628870d36e3a9773e874705b",
        "state": "HALT",
        "gas_consumed": "0.646",
        "stack": [
            {
                "type": "ByteArray",
                "value": "5265642050756c736520546f6b656e20332e312e34"
            },
            {
                "type": "Integer",
                "value": "8"
            },
            {
                "type": "ByteArray",
                "value": "525058"
            },
            {
                "type": "ByteArray",
                "value": "00f871f54c710f"
            }
        ]
    }
}
```

We can see that the result stack returns the results in the order of our scripts. The first result `5265642050756c736520546f6b656e20332e312e34` is the hexstring representation of the name of the token. The second result is the decimal places. The third result is the symbol in hexstring and the last result is the total supply in Fixed8 format.

This last bit in parsing is intentionally left for the reader to try parsing the values themselves.

```js
const name = 'Red Pulse Token 3.1.4'
const decimals = 8
const symbol = 'RPX'
const totalSupply = 43467000.00000000
```
