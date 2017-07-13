# neo-js-sdk

Javascript SDK ported from https://github.com/neochainio/neowallet/blob/master/js/wallet.js as the original source.

### To run tests
```
npm run test
```

### To build to /dist:
```
npm run build
```

### How to send a transaction
Check the test/index.js for examples on some basic wallet actions

## Notes:
It seems like the testnet API can at times crap out. If the block height at http://testnet.antchain.org/ (which is where the testnet API resides) is not keeping up to date with the block height at http://testnet.antcha.in/blocks then this may usually be a sign that there may be a problem with certain calls. For example calls to get wallet balance may be out of sync and sending transactions may fail.
