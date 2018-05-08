---
id: api-settings
title: Settings
---

```js
import Neon, {settings} from '@cityofzion/neon-js'

// Semantic access
const newNet = new Neon.rpc.Network({name:'NewNet'})
Neon.add.network(newNet)

// Direct access
Neon.settings.httpsOnly = true
```

## httpsOnly

`boolean`

Affects the results of `getRPCEndpoint` from neonDB and neoscan. If set to `true`, `getRPCEndpoint` will only return https nodes. If there are no available nodes, it will cause the method to throw an error instead.

## networks

`{[network:string]: Network}`

This contains all the networks avaiable for use in `neon-js`. The default networks included are `MainNet`, `TestNet` and `CozNet`.

There are 2 helper functions that aids in adding or removing networks

```js
const customMainNet = new Network('MainNet')
// This overrides the existing MainNet with your custom configuration
settings.addNetwork(customMainNet, true)

settings.removeNetwork('TestNet')
```

## timeout

`{[category: string]: number}`

This contains the timeouts set for the different network categories. There are currently 2 categories available: `ping` and `rpc`.

## defaultCalculationStrategy

`(assetBalance: AssetBalance, requiredAmt: Fixed8) => Coin[]`

The default strategy to use when calculating the inputs used. You can find the different strategies available at `tx.calculationStrategy`. The default setting is `balancedApproach` which naively tries to find a good mix of inputs.
