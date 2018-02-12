---
id: api-wallet
title: Wallet
---


The `wallet` module is exposed as:

```js
import Neon from '@cityofzion/neon-js'
const account = Neon.create.account(privateKey)
Neon.is.address(string)

import {wallet} from '@cityofzion/neon-js'
const account = new wallet.Account(privateKey)
wallet.isAddress(string)
```

The `wallet` module contains the core methods for manipulating keys, creating signatures and verifying keys.

### Account

```ts
class Account {
  constructor(str: string)

  WIF: string
  privateKey: string
  publicKey: string
  scriptHash: string
  address: string

  getPublicKey(encoded: boolean): string
  encrypt(keyphrase: string, scryptParams?: ScryptParams): Account
  decrypt(keyphrase: string, scryptParams?: ScryptParams): Account
  export(): WalletAccount
}
```

The `Account` class is used to store and transform keys to its various formats. It can be instantiated with any key format and is smart enough to recognise the format and store it appropriately.

```js
  import Neon, {wallet} from '@cityofzion/neon-js'

  const a = Neon.create.Account('ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
  console.log(a.address) // ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s

  const b = new wallet.Account('9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69')
  console.log(b.privateKey) // 9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69
```

The class enables us to easily retrieve keys in any derivable format without needing to remember any methods. However, we can only retrieve formats that can be derived from our input. For example, we cannot retrieve any formats other than address and scripthash from `a` because we instantiated it with an address. However, we can get any format from `b` because it was instantiated with a private key, which is the lowest level key available.

```js
  console.log(a.publicKey) // throws an error
  console.log(b.publicKey) // prints the public key
  console.log(b.address) // prints the address
```

The order of the keys are:

0. encrypted (NEP2)
1. privateKey / WIF
2. publicKey
3. scriptHash
4. address

When you instantiate a `Account` with a key, you can retrieve any format that is below it in the list. For example, if we instantiate with a public key, we can get the publc key, scriptHash and address but not the private key.

The Account class can only be instantiated from encrypted key, private key, public key, or address. ScriptHash is not accepted as there is currently no way to verify if a scripthash is legitimate.

The `encryptedKey` is special as it is the lowest level key but requires the user to unlock it first before we can derive anything from it. This can be done through the `decrypt` method.

```js
  const c = new wallet.Account('6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF')
  console.log(c.encrypted) // encrypted key
  console.log(c.address) // throws error
  c.decrypt('city of zion')
  console.log(c.address) // ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
```

You can encrypt the key by using the `encrypt` method. This is necessary if you want to export this key to a JSON file.

```js
  c.encrypt('new password')
```

This action will encrypt the private key with the provided password and replace any old NEP2 key.

### Balance

```ts
class Balance {
  constructor(bal?: Balance)

  address: string
  net: 'MainNet' | 'TestNet'
  assetSymbols: string[]
  assets: { [index: string]: AssetBalance }
  tokenSymbols: string[]
  tokens: { [index: string]: number }

  static import(jsonString: string): Balance

  addAsset(sym: string, assetBalance?: AssetBalance): this
  addToken(sym: string, tokenBalance?: number | Fixed8): this
  applyTx(tx: Transaction, confirmed?: boolean): this
  export(): string
  verifyAssets(url: string): Promise<Balance>
}
```

The Balance class stores the balance of the account. It is usually retrieved using a 3rd party API as NEO nodes do not have a RPC call to easily retrieve this information with a single call.

```js
import Neon from '@cityofzion/neon-js'
Neon.create.balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})

import {wallet, api} from '@cityofzion/neon-js'
// This form is useless as it is an empty balance.
const balance = new wallet.Balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})
// We get a useful balance that can be used to fill a transaction through api
const filledBalance = api.getBalanceFrom('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW', api.neonDB)
// This contains all symbols of assets available in this balance
const symbols = filledBalance.assetSymbols
// We retrieve the unspent coins from the assets object using the symbol
const neoCoins = filledBalance.assets['NEO'].unspent
// We can verify the information retrieved using verifyAssets
filledBalance.verifyAssets('https://seed1.neo.org:20332')
```

The class is used to track the unspent coins available to construct transactions with. `verifyAssets` is a handy method to make sure the unspent coins provided by the 3rd party API is really unspent by verifying them against a NEO node. However, this is an expensive operation so use sparingly.

The constructor is a handy method to convert a Balance-like javascript object into a `neon-js` Balance.

### Claims

```ts
class Claims {
  constructor(claims?: Claims)

  address: string
  net: string
  claims: ClaimItem[]
}
```

The Claims class is a collection of claims data belonging to an account. It is usually retrieved from a 3rd part API. We do not recommend you craft your own Claims manually. This class is here for completeness in terms of high level objects.

Like Balance, the constructor is the way to convert a Claims-like object into a `neon-js` Claims object. This is the primary method we use to convert the claims object we get from 3rd party API.

NEO generates GAS when held. When NEO is spent, the gas that it generates is unlocked and made claimable through ClaimTransaction. The formula for calcuating the claim per transaction is:

    claim = ((start - end) * 8 + sysfee) * value
