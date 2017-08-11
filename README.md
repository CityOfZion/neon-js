# Neon TypeScript SDK

[![Build Status](https://travis-ci.org/CityOfZion/neon-ts.svg?branch=master)](https://travis-ci.org/CityOfZion/neon-ts)

This the Neon Wallet's TS SDK for the NEO blockchain platform.

Ported from neon-js.

## Quickstart

Take a look at the tests to find examples for all API functions.

```javascript
import * as api from 'neon-js';

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

const testNet = new api.NeonAPI("TestNet");

// Get balance of account "a" on TestNet using Neon Wallet API
testNet.getBalance(testKeys.a.address).then((balance) => {
  console.log(balance);
});

// Get balance of account "a" on MainNet using Neon Wallet API
testNet.getBalance(testKeys.a.address).then((balance) => {
  console.log(balance);
});

// Claim all available GAS for account "a" on TestNet
testNet.claimAllGAS(testKeys.a.wif).then((response) => {
  console.log(response);
});

// Send 1 ANS to "a" from "b" on TestNet
testNet.sendAssetTransaction(testKeys.a.address, testKeys.b.wif, "AntShares", 1).then((response) => {
  console.log("Transaction complete!");
});
```

### To run tests
```
webpack
mocha lib
```

### To build to /dist:
```
webpack
```
