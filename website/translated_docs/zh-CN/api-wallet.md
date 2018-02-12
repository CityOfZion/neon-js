---
id: api-wallet
title: Wallet
---

钱包模块被暴露为：

```js
import Neon from '@cityofzion/neon-js'
const account = Neon.create.account(privateKey)
Neon.is.address(string)

import {wallet} from '@cityofzion/neon-js'
const account = new wallet.Account(privateKey)
wallet.isAddress(string)
```

### 账户

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

`Account` 账户类是从一个给定的密钥构造而来的，并提供了从给定的密钥中派生所有其他密钥格式的方法。请务必注意，您无法从较高级别派生较低级别的密钥。

```js
  import Neon, {wallet} from '@cityofzion/neon-js'

  const a = Neon.create.Account('ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
  console.log(a.address) // ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s

  const b = new wallet.Account('9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69')
  console.log(b.privateKey) // 9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69
```

密钥排列如下：

1. 加密密钥（NEP2）
2. 私钥（HEX或WIF）
3. 公钥
4. 脚本散列
5. 地址

`Account` 类只能由私钥，公钥或地址创建。ScriptHash 和 NEP2 不被接受。 您不能从使用公钥创建的帐户派生私钥。（帐户将发生错误）

```js
  console.log(a.publicKey) // throws an error
  console.log(b.publicKey) // prints the public key
  console.log(b.address) // prints the address
```

### 余额

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

余额类存储帐户的余额。它通常使用第三方API检索，因为NEO节点没有RPC调用，无法只用一次调用就可轻松检索这些信息。

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

余额类用于追踪可用于构建交易的未花费的币。`verifyAssets` 是一个方便的方法，以确保由第三方API提供的未花费的币是通过比照一个NEO节点验证他们真正没有被花费掉。但是，这是一个昂贵的操作，所以谨慎使用。

构造函数是一个将一个类似余额 `Balance` 的 javascript 对象转换成 `neon-js` 余额 Balance 方便方法。

### Claims

```ts
class Claims {
  constructor(claims?: Claims)

  address: string
  net: string
  claims: ClaimItem[]
}
```
Claims类是属于一个账户的提取（claim)数据的集合。 它通常从第三方API检索。 我们不建议您手动制作自己的Claims。 这个类在这里是为了高层次的对象的完整性。

和Balance一样，构造函数是将类似Claim的对象转换为neon-js Claim对象的方法。 这是我们用来转换我们从第三方API获得的Claim对象的主要方法。

计算 Claims 的方法是：

    claim = ((start - end) * 8 + sysfee) * value
