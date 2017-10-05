import * as Neon from '../src/index.js'
import { reverseHex } from '../src/utils.js'
import axios from 'axios'
describe.only('RPX', function () {
  this.timeout(10000)
  const privateKey = '3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b'
  const pkey = '02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa'
  const RPX = '5b7074e873973a6ed3708862f219a6fbf4d1c411'
  const invo = {
    'outputs': [
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 1,
        scriptHash: RPX
      }
    ],
    publicKey: pkey,
    invoke: {
      scriptHash: RPX,
      operation: 'mintTokens'
    }
  }
  it('reversedScriptHash', () => {
    console.log(reverseHex(Neon.getScriptHashFromPublicKey(pkey)))
  })

  it('createRealInvo', () => {
    const endPoint = Neon.getAPIEndpoint('TestNet')
    const address = Neon.getAccountFromPublicKey(pkey).address
    return axios.get(endPoint + '/v2/address/balance/' + address).then((res) => {
      const tx = Neon.create.invocation(pkey, res.data, invo.outputs, invo.invoke, 1, { version: 1 })
      console.log(tx)
      const s = Neon.serializeTransaction(tx)
      const sig = Neon.signatureData(s, privateKey)
      const signedTx = Neon.addContract(s, sig, pkey)
      console.log(signedTx)
      console.log(Neon.deserializeTransaction(signedTx))
    })
  })

  it.skip('createRealContract', () => {
    const endPoint = Neon.getAPIEndpoint('TestNet')
    const address = Neon.getAccountFromPublicKey(pkey).address
    return axios.get(endPoint + '/v2/address/balance/' + address).then((res) => {
      const tx = Neon.create.contract(pkey, res.data, invo.outputs)
      console.log(tx)
      const s = Neon.serializeTransaction(tx)
      const sig = Neon.signatureData(s, privateKey)
      const signedTx = Neon.addContract(s, sig, pkey)
      console.log(signedTx)
      console.log(Neon.deserializeTransaction(signedTx))
    })
  })
})
