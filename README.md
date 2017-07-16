# Neo JavaScript SDK

This is COZ's JS SDK for the NEO blockchain platform. It is currently in use by the NEO [electron wallet](https://github.com/CityOfZion/neo-electron-wallet/tree/jaxx-skin)

Special thanks to [neowallet.js](https://github.com/neochainio/neowallet/blob/master/js/wallet.js) for providing many of the underlying cryptography and network methods!

## Quick Start

Take a look at the tests to find examples for all API functions.

```javascript
import * as api from '../src/api';

const testKeys = {
  a: {
    address: "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s",
    wif: "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  },
  b: {
    address: "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
    wif: "KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG"
  }
}

// Get balance of account "a"
api.getBalance(api.TESTNET, testKeys.a.address).then((balance) => {
  console.log(balance);
});

// Send 1 ANS to "a" from "b"
api.sendAssetTransaction(api.TESTNET, testKeys.a.address, testKeys.b.wif, "AntShares", 1).then((response) => {
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
