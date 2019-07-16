---
id: index
title: Overview
---
Here are some examples of `neon-js` for developers to refer to. The examples are expected to cover all cases and methods on different levels.

## API Level
`Neon-js` is designed to be a flexible NEO SDK that exposes both High Level API and Low Level API.
### High Level API
e.g. `Neon.sendAsset, Neon.claimGas, Neon.doInvoke`.

High Level API is usually the first option as it's clear and simple. It costs less lines of codes, as it will handle internally some sessions(e.g. construct transaction, calculate inputs and outputs).
High Level API is wrapped with Low Level API.

### Low Level API
e.g. `RPCClient, transaction, sc`

Low Level API is the core part of `neon-js`. There are cases (e.g. Withdraw native assets from contract address) where developer wants to handle some sessions himself, then he could use Low Level API.

## Example Codes In 3 Levels
Most examples are written in methods that can be classified to 3 levels:
- **High Level**

    Use High Level API.
- **Low Level**

    Use Low Level API to construct transaction, and then send it to blockchain.
- **Raw Level**

    Use Low Level API to construct transaction, attached with self-selected inputs and outputs, and then send it to blockchain.

Choose whichever level according to your case!