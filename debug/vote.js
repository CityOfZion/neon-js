var Neon = require('../lib/index')

const config = {
  net: 'CozNet',
  // ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
  account: new Neon.wallet.Account('L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g'),
  candidateKeys: ['03bb51eddd2bbf7bbdced7db244901e7e76c59cee0606d48b79b2f02f335a57f8c']
}

Neon.api.setupVote(config)
  .then(res => {
    console.log(res)
    console.log(res.tx.descriptors[0])
    console.log(res.tx.serialize(true))
  })
  .catch(err => {
    console.log(err)
    console.log(err.tx.descriptors[0])
    console.log(err.tx.serialize(true))
  })
