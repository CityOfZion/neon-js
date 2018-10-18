---
id: settings
title: Settings
---

The `settings` module is exposed as:

```js
import Neon, { settings } from "@cityofzion/neon-js";

// Semantic access
const newNet = new Neon.rpc.Network({ name: "NewNet" });
Neon.add.network(newNet);

// Direct access
console.log(Neon.settings.networks);
```

This module contains all the adjustable settings available in the package. This module can be augmented by plugins to include their own respective settings. Thus, this list is not exhaustive and only represent the settings available in the core package.

---

## networks

`{[network:string]: Network}`

This contains all the networks avaiable for use in `neon-js`. The default networks included are `MainNet`, `TestNet` and `CozNet`.

## timeout

`{[category: string]: number}`

This contains the timeouts set for the different network categories. There are currently 2 categories available: `ping` and `rpc`.

## defaultCalculationStrategy

`(assetBalance: AssetBalance, requiredAmt: Fixed8) => Coin[]`

The default strategy to use when calculating the inputs used. You can find the different strategies available at `tx.calculationStrategy`. The default setting is `balancedApproach` which naively tries to find a good mix of inputs.
