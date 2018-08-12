var Neon = require('../lib/index')

const config = {
  net: 'TestNet',
  // ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
  account: new Neon.wallet.Account(
    'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g'
  ),
  candidateKeys: [
    '030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e36',
    '0327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8'
  ]
}

Neon.api
  .setupVote(config)
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
