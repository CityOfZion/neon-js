# neon-uri

## Overview

NEP-9 is the standard for a URI schema for NEO. This package provides the ability to parse the string into a consumable intent object.

While the standard is written for Neo2 and there has not been any upgrades, the N3 version provides a more relaxed version with some additional support for general use cases.

For N3, the format is amended from NEP-9:

```
neo:[?<usecase>-]<targetIdentifier>[?<key>=<value>]
```

where `usecase` is an optional prefix that denotes the intent of the uri.

The following scenarios are supported:

#### NEP-17 token request

Token transfer will be the default intent if the prefix is missing.

```
neo:[?pay-]<toAddress>?asset=<contractHash>&amount=<amount>
```

where:
|parameter    |value                             |
|-------------|----------------------------------|
|toAddress    | The receiving address of the transfer.|
|contractHash | `neo` , `gas` or a contract hash.|
|amount       | integer amount of the asset to transfer. (Optional)|

For example,

to request 1 GAS for `NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk` :

```
neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=gas&amount=100000000
```

#### Neo vote request

```
neo:vote-<candidatePublicKey>
```

where:
|parameter             |value                                                |
|----------------------|-----------------------------------------------------|
|candidatePublicKey    | The encoded public key of the candidate to vote for.|

For example,

to request votes for `02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef` :

```
neo:vote-02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef
```

## Installation

```sh
yarn i @cityofzion/neon-uri @cityofzion/neon-core
```

```js
const uri = require("@cityofzion/neon-uri");
```

## API

`parse` takes in a complete NEO uri string and returns an intent object:

```js
const intent = parse(
    "neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=gas&amount=100000000"
);
```

The intent will look like:

```js
{
    intent: "pay",
    description: "Transfer 100000000 GAS to NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
    contractCall: {
        scriptHash: "d2a4cff31913016155e38e474a2c06d08be276cf",
        operation: "transfer",
        args: [{
                type: "Hash160",
                value: "" // Left empty for user to fill.
            },
            {
                type: "Hash160",
                value: "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk"
            },
            {
                type: "Integer",
                value: "100000000"
            },
        ]
    }
}
```

* Assets `neo` and `gas` are automatically transformed into their respective scripthashes.
* Runtime validation such as address and contract verifications are not performed during parsing.

`createPayUri` and `createVoteUri` are simple methods to help quickly create compliant uris:

```js
const neonUri = require("@cityofzion/neon-uri");

//neo:vote-02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef
const voteUri = neonUri.createVoteUri("02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef")

//neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=gas&amount=100000000
const payUri = neonUri.createPayUri("NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk", "gas", 100000000)
```
