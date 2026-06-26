# neon-dapi

## Overview

TypeScript implementation of the [NEP-21 dAPI standard](https://github.com/neo-project/proposals/blob/master/nep-21.mediawiki) for Neo N3. Provides the `DapiProvider` interface that wallets must implement, along with `DapiOperations` — a helper class that handles the blockchain heavy lifting so wallet developers only need to wire up user interaction.

## Installation

```sh
npm i @cityofzion/neon-dapi @cityofzion/neon-core
```

`@cityofzion/neon-core` is a peer dependency and must be installed alongside this package.

## Concepts

### Types

All NEP-21 types are exported from this package and can be imported directly. Key types include:

- **`DapiProvider`** — The interface wallets must implement. Defines the full NEP-21 surface exposed to dApps: account access, asset transfers, contract invocations, signing, and blockchain queries.
- **`Account`**, **`Signer`**, **`Transaction`**, **`Block`** — Core blockchain data structures.
- **`InvocationArguments`**, **`InvocationResult`** — Input and output for contract calls.
- **`ContractParametersContext`** — Unsigned transaction context used in multi-sig flows (`makeTransaction` → `sign` → `relay`).
- **`TransactionOptions`** — Fee and validity overrides for transaction building.
- **`SignOptions`**, **`SignedMessage`** — Message signing configuration and result.
- **`AuthenticationChallengePayload`**, **`AuthenticationResponsePayload`** — NEP-20 authentication payloads.
- **`ProviderReadyEvent`**, **`ProviderRequestEvent`**, **`AccountChangedEvent`**, **`NetworkChangedEvent`** — Custom DOM events for the provider lifecycle and wallet state changes.
- Primitive aliases — **`UInt160`**, **`UInt256`**, **`ECPoint`**, **`Integer`**, **`Base64Encoded`**, **`Network`** — string/number aliases with semantic names matching the NEP-21 spec.

### `DapiOperations` class

A helper that implements the blockchain and cryptographic operations required by `DapiProvider`. It is not a provider itself — it exists to reduce boilerplate by handling RPC calls, transaction building, signing, and fee calculation.

Methods that require direct wallet UI interaction (`pickAddress`, `on`, `removeListener`) are intentionally omitted from `DapiOperations` because they depend on the specific wallet environment and cannot be generalized.

### `DapiError`

Standardized error class thrown by all `DapiOperations` methods. Each error carries a `DapiErrorCode` so dApps can handle failure cases programmatically.

### `ENetwork`

Enum with the canonical Neo N3 network magic numbers.

```ts
import { ENetwork } from "@cityofzion/neon-dapi";

ENetwork.MAINNET // 860833102
ENetwork.TESTNET // 894710606
```

## Conformance Suite

The package ships a browser-based conformance suite (`conformance/`) that validates any injected NEP-21 provider against the full spec. Each method is exercised and results are reported as pass/fail directly in the page.

The suite runs against the live injected provider — no mocking occurs. Useful for wallet developers to verify their `DapiProvider` implementation before release.

### Running

Serve the conformance directory with any static file server and open it in a browser that has a Neo wallet extension active:

```sh
# Using npx serve
npx serve packages/neon-dapi/conformance
```

Then open `http://localhost:3000` (or whichever port your server uses) in the browser.

> **Note:** Some tests require a connected account with funds on the target network.

Click **Run All** to execute the full suite, or run individual tests from the UI.

### `DapiErrorCode`

| Code | Value | Meaning |
|---|---|---|
| `UNKNOWN` | 10000 | An unknown error has occurred. |
| `UNSUPPORTED` | 10001 | The requested feature is not supported. |
| `INVALID` | 10002 | The input data is in an invalid format. |
| `NOTFOUND` | 10003 | The requested data doesn't exist. |
| `FAILED` | 10004 | The contract execution failed. |
| `TIMEOUT` | 10005 | The operation was cancelled due to timeout. |
| `CANCELED` | 10006 | The operation was cancelled by the user. |
| `INSUFFICIENT_FUNDS` | 10007 | The operation failed due to insufficient balance. |
| `RPC_ERROR` | 10008 | An exception was thrown by the RPC server. |
