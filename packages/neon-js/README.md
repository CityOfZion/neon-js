# neon-js

Constructed package using:

- `neon-core`
- `neon-api`
- `neon-nep5`

In addition, this package exposes a high level semantic API binding for beginner usage. The semantic API can be found in the default export of the package.

```js
const Neon = require("cityofzion/neon-js");

console.log(Neon); // {wallet, tx, api, nep5, etc...}

const NeonJs = neon.default;

console.log(NeonJs); // {create, get, sign, verify,...}
```

The semantic API follows a convention of Verb-Noun. Any extra words beyond the first 2 is collapsed into the Noun and camelcased.

```js
NeonJs.create.stringStream("1234");
NeonJs.encrypt.privateKey("key");
```

The exceptions to this rule are the managed methods provided by `api`:

```js
NeonJs.sendAsset
NeonJs.claimGas
NeonJs.doInvoke
NeonJs.setupVote
```
