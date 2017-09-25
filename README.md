# Neon JavaScript SDK

This the Neon Wallet's JS SDK for the NEO blockchain platform. It is currently in use by [Neon](https://github.com/CityOfZion/neon-wallet/).

Special thanks to [neowallet.js](https://github.com/neochainio/neowallet/blob/master/js/wallet.js) for providing many of the underlying cryptography and network methods!

## Quick Start

Take a look at the tests to find examples for all API functions.

```javascript
import * as api from 'neon-js';



const testKeys = {
  'a': {
    address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
    wif: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g',
    passphrase: 'city of zion',
    encryptedWif: '6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF'
  },
  b: {
    address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
    wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  },
  c: {
    address: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
    wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG"
  }
};

// Get balance of account "a" on TestNet using Neon Wallet API
api.getBalance(api.TESTNET, testKeys.a.address).then((balance) => {
  console.log(balance);
});

// Get balance of account "a" on MainNet using Neon Wallet API
api.getBalance(api.MAINNET, testKeys.a.address).then((balance) => {
  console.log(balance);
});

// Claim all available GAS for account "a" on MainNet
api.doClaimAllGas(api.MAINNET, testKeys.c.wif).then((response) => {
  console.log(response);
})

// Send 1 ANS to "a" from "b" on TestNet
api.doSendAsset(api.TESTNET, testKeys.a.address, testKeys.b.wif, "Neo", 1).then((response) => {
  console.log(response);
  console.log("Transaction complete!");
});
```

### To run tests
```
npm run test
```

### To build to /dist:
```
npm run build
```

### To import
```
npm install --save git+https://github.com/CityOfZion/neon-js.git
```
