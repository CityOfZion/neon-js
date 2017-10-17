************
Installation
************

neon-js does not currently live on the NPM system.


Install
--------

To install, add this into your ``package.json``::

  "dependencies": {
    ...
    "neon-js": "git+https://github.com/CityOfZion/neon-js.git",
  }
  // This will grab the latest copy from master.

For a specific commit or release, add the commit hash behind::

  "dependencies": {
    ...
    "neon-js": "git+https://github.com/CityOfZion/neon-js.git#8a52d07a4eda09afd1b57485deb6973409d0c342",
  }
  // This grabs v1.1.0

Import
------

neon-js supports 2 kinds of imports.

A default import will import the semantic version of neon. Use this if you are new or just want the whole package to use.

::

  import Neon from 'neon-js'

  Neon.create.claimTx(...args)
  const query = Neon.create.query()


Modules are exposed through named imports. This allows more fine grained control and access to individual modules.

::

  import {rpc, tx} from 'neon-js'

  Neon.tx.createClaimTx(...args)
  const query = new rpc.Query()
