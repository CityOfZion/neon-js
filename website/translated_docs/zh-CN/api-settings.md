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
