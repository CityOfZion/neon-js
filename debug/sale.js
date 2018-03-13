var Neon = require('../lib/index')

const contractHash = 'ae36e5a84ee861200676627df409b0f6eec44bd7'

const config = {
  net: 'TestNet',
  account: new Neon.wallet.Account('L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG'),
  intents: Neon.api.makeIntent({ GAS: 1 }, Neon.wallet.getAddressFromScriptHash(contractHash)),
  script: {
    scriptHash: contractHash,
    operation: 'mintTokens',
    args: []
  },
  gas: 0
}

Neon.api.doInvoke(config)
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err))
