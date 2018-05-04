---
id: api-wallet
title: 钱包模块
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

## 类
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
const filledBalance = api.neonDB.getBalance('MainNet','ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
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

### 钱包

The `Wallet` class implements the NEP-6 convention which is a standard way set by NEO council on how to export keys in a JSON file. By doing this, we can move keys across different software providers without worry.

The `Wallet` class is essentially a collection of encrypted keys as well as the parameters used to encrypt them.

```js
import Neon, {wallet} from 'cityofzion/neon-js'

const a = new wallet.Account('6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF')
const b = new wallet.Account('9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69')

// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const w1 = Neon.create.wallet({name: 'myWallet'})

// We generate a new Account and add it to the wallet
w1.addAccount()
// We add Account a to the wallet.
w1.addAccount(a)
// We add Account b to the wallet.
// Note that Account b is unencrypted and we can add this Account.
// The wallet will only error when trying to export an unencrypted key but does not prevent you from adding it.
w1.addAccount(b)
```

If your Account is not encrypted, it is still possible to add it to the Wallet. However, you will be unable to export the wallet until you encrypt it. The Wallet class provides some helper methods to quickly encrypt or decrypt all accounts.

```js
// encrypting Account a will fail as it has not been unlocked.
w1.encryptAll('lousypassword') // returns [false, true]

// we will decrypt a (account at array position 0)
w1.decrypt(0, 'city of zion')  // returns true
// so we can encrypt everything with the same password
w1.encrypt(0, 'lousypassword') // returns true
```

Similar methods for decryption (`wallet.decrypt`, `wallet.decryptAll`) is available. Encryption and decryption methods will return booleans which corresponds to the success or failure of the action.

Do note that decrypting does not mean that you cannot export the wallet. Decryption does not erase the old encryption but merely exposes your keys.

Once encrypted, you can proceed to export your wallet through `writeFile` or `export`.

The static method `readFile` is available to construct a wallet through reading a JSON file.

```js
// writes to a file on cwd
w1.writeFile('mywallet.json')

// exports as JSON string
const walletString = w1.export()

// read wallet from file
const w2 = wallet.Wallet.readFile('mywallet.json')

// Decryption failed for account[0]
w2.decryptAll('lousypassword') // returns [true, true]
```

## 方法
### 核心

可用的核心方法是转换密钥格式并生成新的私钥的方法。

请务必注意，可用的方法不是全套，但只有最低要求。一般来说，有一种方法可以从较高的密钥中重新得到较低的密钥。例如，`getPublicKeyFromPrivateKey` 存在但不是 `getAddressFromPrivatKey` 或`getPrivateKeyFromPublicKey`。对于所有格式的转换，鼓励您使用 `Account` 类。

```js
import Neon from '@cityofzion/neon-js'
const privateKey = Neon.create.privateKey()
const publicKey = Neon.get.publicKeyFromPrivateKey(publicKey)
const scriptHash = Neon.get.scriptHashFromPublicKey(publicKey)
const address = Neon.get.addressFromScriptHash(scriptHash)

import { wallet } from '@cityofzion/neon-js'
const privateKey = wallet.generatePrivateKey()
const publicKey = wallet.getPublicKeyFromPrivateKey(privateKey)
const scriptHash = wallet.getScriptHashFromPublicKey(publicKey)
const address = wallet.getAddressFromScriptHash(scriptHash)
```

### Components

These are methods used to convert JS objects into their respective `neon-js` implementation.

These methods are exposed for completeness but you are encouraged to use the constructors of the main objects `Balance` and `Claims` instead of manually recreating your own objects.

### NEP2

NEP2标准描述了加密或解密私钥的过程。加密方法接受WIF或HEX私钥。但是，解密方法将始终返回WIF以保持一致性。

请务必注意，加密/解密需要很长时间，在浏览器中可能无法很好地运行。

```js
import Neon from '@cityofzion/neon-js'
const privateKey = Neon.create.privateKey()
const WIF = Neon.get.WIFFromPrivateKey(privateKey)
const nep2Key = Neon.encrypt(privateKey, 'myPassword')
const decryptedKey = Neon.decrypt(nep2Key, 'myPassword')
WIF === decryptedKey // true

import { wallet }
const privateKey = wallet.generatePrivateKey()
const WIF = new wallet.Account(privateKey).WIF
const nep2Key = wallet.encrypt(WIF, 'myPassword')
const decryptedKey = wallet.decrypt(nep2Key, 'myPassword')
WIF === decryptedKey // true
```

### 验证

各种密钥格式的验证方法都是可用的：

```js
import Neon from '@cityofzion/neon-js'
Neon.is.address(addrStr)
Neon.is.privateKey(keyStr)
Neon.is.NEP2(encryptedStr)

import {wallet} from '@cityofzion/neon-js'
wallet.isAddress(addrStr)
wallet.isPrivateKey(keyStr)
wallet.isNEP2(keyStr)
```

这些方法将返回一个关于密钥格式的布尔值。没有错误将被抛出。

