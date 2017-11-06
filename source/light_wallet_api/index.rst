****************
Light Wallet API
****************

This library is fundamentally built to support Neon wallet. Behind Neon wallet, there is a COZ-hosted node that provides the necessary information to construct the transactions. This information is not provided by the NEO nodes through a single call, thus the need for the COZ node.

The methods are found in the ``api`` file::

  import * as Neon from 'neon-js'
  let net = 'TestNet'
  let wif = 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g'

  // Claims all available gas for the given WIF key
  Neon.doClaimAllGas(net, wif)

  let toAddress = 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s'
  let assetAmts = {NEO: 1, GAS: 1}

  // Sends NEO/GAS from wif to toAddress
  Neon.doSendAsset(net, toAddress, wif, assetAmts)


.. toctree::
   :maxdepth: 1
   :caption: Contents:
