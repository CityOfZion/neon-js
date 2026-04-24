# Elliptic Replacement Investigation

Issue: https://github.com/CityOfZion/neon-js/issues/954

## Goal

Replace the direct `elliptic` dependency used by `@cityofzion/neon-core` with a
maintained Noble-based implementation while preserving Neon-JS 5.x behavior.

## Current Dependency Chain

```text
@cityofzion/neon-js@5.8.1
  -> @cityofzion/neon-core@5.8.1
  -> elliptic@6.6.1
```

Advisory:

```text
GHSA-848j-6mx2-7j84
Elliptic Uses a Cryptographic Primitive with a Risky Implementation
Affected range: elliptic <= 6.6.1
```

## Direct Usage

The direct `elliptic` wrapper is concentrated in:

```text
packages/neon-core/src/u/basic/curve.ts
```

That wrapper is used by wallet key/signing flows, including:

```text
packages/neon-core/src/wallet/signing.ts
packages/neon-core/src/wallet/core.ts
```

## Baseline Test Command

Run before changing behavior:

```powershell
npx jest packages/neon-core/__tests__/u/basic/curve.ts packages/neon-core/__tests__/wallet/signing.ts --runInBand
```

Baseline result on the working branch:

```text
Test Suites: 2 passed, 2 total
Tests:       30 passed, 30 total
```

## Maintainer Direction

Discord guidance relayed from the Neon-JS maintainer discussion:

```text
Open an issue. Noble project looks correct as the replacement (used in eth).
```

Working direction:

- use `@noble/curves` rather than a local long-term fork;
- keep the first implementation focused on `neon-core` curve/signing behavior;
- avoid custom ECDSA implementation code for the legacy test-only nonce path.

## Explicit `k` Parameter

Neon-JS currently exposes:

```ts
curve.sign(message, privateKey, k);
```

Existing tests assert deterministic signatures when `k` is provided, including
exact wallet signing vectors with `k = "0400"`.

Ethereum tooling supports the Noble direction but does not fully answer this
compatibility point:

- `ethereum-cryptography@3.2.0` depends on `@noble/curves@1.9.0`;
- `ethers@6.16.0` depends on `@noble/curves`;
- `ethereum-cryptography`'s secp256k1 compatibility wrapper rejects custom nonce
  options and relies on Noble's normal signing path.

Maintainer follow-up on
https://github.com/CityOfZion/neon-js/pull/955#issuecomment-4309561523 approved
dropping custom `k` support because it is only used by tests and the
implementation overhead is too high.

Implementation decision:

- keep the optional `k` argument accepted at the public TypeScript boundaries
  for source compatibility;
- ignore `k` when signing with Noble;
- replace exact legacy `k` signature assertions with sign-and-verify coverage.

## Noble Version Choice

Initial implementation should prefer `@noble/curves@1.9.x`.

Reason:

- Neon-JS currently emits CommonJS-compatible package output;
- the current Jest setup does not transform ESM dependencies from
  `node_modules`;
- `@noble/curves@2.x` is ESM-only;
- `@noble/curves@1.9.x` exposes both `import` and `require` paths.
