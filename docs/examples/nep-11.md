---
id: nep11
title: NEP-11
---

## Tokens Of

The `tokensOf` method returns an iterator object. In order to access the values you need to invoke a script that reads the values. `buildIteratorScript` can automatically generate the script for `tokensOf` using an `Account` and script hash.

### Using buildIteratorScript

```javascript
const { wallet, nep11 } = require("@cityofzion/neon-js");

const account = new wallet.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW");
const contractHash = "c938e29961a8d05fcf2a9847e95aebae9003c8be";
const page = 0;
const maxResults = 1000;

nep11.buildIteratorScript(account, contractHash, page, maxResults)
  .then((script) => {
    console.log(`Got script: ${script}`);
  })
  .catch((error) => {
    console.log(`Error getting build iterator script: ${error}`);
  });
```
