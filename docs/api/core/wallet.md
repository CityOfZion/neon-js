---
id: wallet
title: Wallet
---

The `wallet` module is exposed as:

```js
import Neon, { wallet } from "@cityofzion/neon-js";
const account = Neon.create.account(privateKey);
const alternative = new wallet.Account(privateKey);

Neon.is.address(string);
wallet.isAddress(string);
```

The `wallet` module contains methods for manipulating keys, creating signatures and verifying keys.

---

## Classes

### Account

```ts
class Account {
  constructor(str: string);

  WIF: string;
  privateKey: string;
  publicKey: string;
  scriptHash: string;
  address: string;

  getPublicKey(encoded: boolean): string;
  encrypt(keyphrase: string, scryptParams?: ScryptParams): Promise<this>;
  decrypt(keyphrase: string, scryptParams?: ScryptParams): Promise<this>;
  export(): WalletAccount;
}
```

The `Account` class is used to store and transform keys to its various formats. It can be instantiated with any key format and is smart enough to recognise the format and store it appropriately.

```js
const a = Neon.create.Account("ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s");
console.log(a.address); // ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s

const b = new wallet.Account(
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
);
console.log(b.privateKey); // 9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69
```

The class enables us to easily retrieve keys in any derivable format without needing to remember any methods. However, we can only retrieve formats that can be derived from our input. For example, we cannot retrieve any formats other than address and scripthash from `a` because we instantiated it with an address. However, we can get any format from `b` because it was instantiated with a private key, which is the lowest level key available.

```js
console.log(a.publicKey); // throws an error
console.log(b.publicKey); // prints the public key
console.log(b.address); // prints the address
```

The order of the keys are:

0. encrypted (NEP2)
1. privateKey / WIF
1. publicKey
1. scriptHash
1. address

When you instantiate an `Account` with a key, you can retrieve any format that is below it in the list. For example, if we instantiate with a public key, we can get the publc key, scriptHash and address but not the private key.

The Account class can be instantiated from encrypted key, private key, public key, address or ScriptHash.

The `encryptedKey` is special as it is the lowest level key but requires the user to unlock it first before we can derive anything from it. This can be done through the `decrypt` method.

```js
const c = new wallet.Account(
  "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF"
);
console.log(c.encrypted); // encrypted key
console.log(c.address); // throws error
c.decrypt("city of zion").then(() => console.log(c.address)); // ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
```

You can encrypt the key by using the `encrypt` method. This is necessary if you want to export this key to a JSON file.

```ts
c.encrypt("new password").then(() => c.export());
```

This action will encrypt the private key with the provided password and replace any old NEP2 key.

### Balance

```ts
class Balance {
  constructor(bal?: Balance);

  address: string;
  net: "MainNet" | "TestNet";
  assetSymbols: string[];
  assets: { [index: string]: AssetBalance };
  tokenSymbols: string[];
  tokens: { [index: string]: number };

  static import(jsonString: string): Balance;

  addAsset(sym: string, assetBalance?: AssetBalance): this;
  addToken(sym: string, tokenBalance?: number | Fixed8): this;
  applyTx(tx: Transaction, confirmed?: boolean): this;
  export(): string;
  verifyAssets(url: string): Promise<Balance>;
}
```

The Balance class stores the balance of the account. It is usually retrieved using a 3rd party API as NEO nodes do not have a RPC call to easily retrieve this information with a single call.

```js
// This creates a balance object but it is empty and not really useful
Neon.create.balance({
  net: "TestNet",
  address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
});

import { wallet } from "@cityofzion/neon-js";
// This form is useless as it is an empty balance.
const balance = new wallet.Balance({
  net: "TestNet",
  address: "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
});

// This contains all symbols of assets available in this balance
const symbols = filledBalance.assetSymbols;
// We retrieve the unspent coins from the assets object using the symbol
const neoCoins = filledBalance.assets["NEO"].unspent;
// We can verify the information retrieved using verifyAssets
filledBalance.verifyAssets("https://seed1.neo.org:20332");
```

The class is used to track the unspent coins available to construct transactions with. `verifyAssets` is a handy method to make sure the unspent coins provided by the 3rd party API is really unspent by verifying them against a NEO node. However, this is an expensive operation so use sparingly.

The constructor is a handy method to convert a Balance-like javascript object into a `neon-js` Balance.

### Claims

```ts
class Claims {
  constructor(claims?: Claims);

  address: string;
  net: string;
  claims: ClaimItem[];
}
```

The Claims class is a collection of claims data belonging to an account. It is usually retrieved from a 3rd part API. We do not recommend you craft your own Claims manually. This class is here for completeness in terms of high level objects.

Like Balance, the constructor is the way to convert a Claims-like object into a `neon-js` Claims object. This is the primary method we use to convert the claims object we get from 3rd party API.

NEO generates GAS when held. When NEO is spent, the gas that it generates is unlocked and made claimable through ClaimTransaction. The formula for calcuating the claim per transaction is:

    claim = ((start - end) * 8 + sysfee) * value

### Wallet

The `Wallet` class implements the NEP-6 convention which is a standard way set by NEO council on how to export keys in a JSON file. By doing this, we can move keys across different software providers without worry.

The `Wallet` class is essentially a collection of encrypted keys as well as the parameters used to encrypt them.

```js
import Neon, { wallet } from "cityofzion/neon-js";

const a = new wallet.Account(
  "6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF"
);
const b = new wallet.Account(
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
);

// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const w1 = Neon.create.wallet({ name: "myWallet" });

// We generate a new Account and add it to the wallet
w1.addAccount();
// We add Account a to the wallet.
w1.addAccount(a);
// We add Account b to the wallet.
// Note that Account b is unencrypted and we can add this Account.
// The wallet will only error when trying to export an unencrypted key but does not prevent you from adding it.
w1.addAccount(b);
```

If your Account is not encrypted, it is still possible to add it to the Wallet. However, you will be unable to export the wallet until you encrypt it. The Wallet class provides some helper methods to quickly encrypt or decrypt all accounts.

```js
// encrypting Account a will fail as it has not been unlocked.
w1.encryptAll("lousypassword").then(results => console.log(results)); // returns [false, true]

// we will decrypt a (account at array position 0)
w1.decrypt(0, "city of zion").then(result => console.log(result)); // returns true
// so we can encrypt everything with the same password
w1.encrypt(0, "lousypassword").then(result => console.log(result)); // returns true
```

Similar methods for decryption (`wallet.decrypt`, `wallet.decryptAll`) is available. Encryption and decryption methods will return booleans which corresponds to the success or failure of the action.

Do note that decrypting does not mean that you cannot export the wallet. Decryption does not erase the old encryption but merely exposes your keys.

Once encrypted, you can proceed to export your wallet through `export`.

```js
// exports as JSON string
const walletString = w1.export();

// Decryption failed for account[0]
w2.decryptAll("lousypassword").then(results => console.log(results)); // returns [true, true]
```

## Methods

### Core

The core methods available are methods to convert key formats and generate new private keys.

Do note that the methods available is not the full set but only the minimum required. Generally, there is a method to retrieve the lower key from the higher key. For example, `getPublicKeyFromPrivateKey` exists but not `getAddressFromPrivatKey` or `getPrivateKeyFromPublicKey`. For conversions across all formats, you are encouraged to use the `Account` class.

```js
const privateKey = Neon.create.privateKey();
const publicKey = Neon.get.publicKeyFromPrivateKey(publicKey);
const scriptHash = Neon.get.scriptHashFromPublicKey(publicKey);
const address = Neon.get.addressFromScriptHash(scriptHash);

const privateKey = wallet.generatePrivateKey();
const publicKey = wallet.getPublicKeyFromPrivateKey(privateKey);
const scriptHash = wallet.getScriptHashFromPublicKey(publicKey);
const address = wallet.getAddressFromScriptHash(scriptHash);
```

There are no checks in place for this set of methods to ensure the inputs are proper. Errors may be thrown when conversion fails for certain methods.

### Components

These are methods used to convert JS objects into their respective `neon-js` implementation.

These methods are exposed for completeness but you are encouraged to use the constructors of the main objects `Balance` and `Claims` instead of manually recreating your own objects.

### NEP2

The NEP2 standard describes the procedure to encrypt or decrypt a private key. The encryption method accepts either a WIF or HEX private key. However, the decryption method will always return a WIF for consistency.

Do note that the encryption/decryption takes a long time and might not work very nicely in browsers.

```js
const privateKey = Neon.create.privateKey()
const WIF = Neon.get.WIFFromPrivateKey(privateKey)
const nep2Key = await Neon.encrypt(privateKey, 'myPassword')
const decryptedKey = await Neon.decrypt(nep2Key, 'myPassword')
WIF === decryptedKey // true

const privateKey = wallet.generatePrivateKey()
const WIF = new wallet.Account(privateKey).WIF
const nep2Key = await wallet.encrypt(WIF, 'myPassword')
const decryptedKey = await wallet.decrypt(nep2Key, 'myPassword')
WIF === decryptedKey // true
```

### Verify

Verification methods for the various key formats are available::

```js
Neon.is.address(addrStr);
Neon.is.privateKey(keyStr);
Neon.is.encryptedKey(encryptedStr);
Neon.is.publicKey(publicKeyStr);
Neon.is.wif(wifStr);
Neon.is.scriptHash(scriptHashStr);

wallet.isAddress(addrStr);
wallet.isPrivateKey(keyStr);
wallet.isNEP2(keyStr);
wallet.isPublicKey(publicKeyStr);
wallet.isWIF(wifStr);
wallet.isScriptHash(scriptHashStr);
```

These methods will return a boolean regarding the key format. No errors will be thrown.
