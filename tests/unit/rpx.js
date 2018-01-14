import Neon from '../../src/index'
import Query from '../../src/rpc/query'
import axios from 'axios'

/**
 * 1 NEO 0 GAS   **SUCCESSFUL**
 * privateKey: fdc4deb9fa7364336d0ee3c4c7e0ecacc782993e098c6fd0cd7f334365c9cb62
 * loading: 76fc48890e182fe2b10ca1fb244e8509c78c8646ee287a6d95410bdbc7e62eca
 * minting:34636afb1fa30d3991b2ae148d01475ca0284921ca030b02b7809cb3aed65c6c
 * balance: 1000
 */

// use .only to run one test at a time

describe.skip('RPX', function () {
  this.timeout(10000)
  // Change this to your upgraded node address.
  const upgradedTestNode = 'http://test1.cityofzion.io:8880'
  // Change this to your new address that you will be minting from.
  const privateKey = 'fdc4deb9fa7364336d0ee3c4c7e0ecacc782993e098c6fd0cd7f334365c9cb62'
  // Set amt of NEO to use to mint
  const NeoAmt = 1
  // Set systemfee to attach
  const gasCost = 0
  const acct = Neon.create.account(privateKey)
  const pkey = acct.publicKey
  const RPX = Neon.CONST.CONTRACTS.TEST_RPX
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
  it('Load account', () => {
    console.log(acct.address)
    return Neon.do.sendAsset('TestNet', acct.address, 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG', { NEO: NeoAmt })
      .then((res) => {
        console.log(res)
        res.should.have.property('result', true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('mintRPX', () => {
    const endPoint = Neon.get.APIEndPoint('TestNet')
    const address = Neon.create.account(pkey).address
    return axios.get(endPoint + '/v2/address/balance/' + address)
      .then((res) => {
        let tx = Neon.create.invocation(pkey, res.data, invo.outputs, invo.invoke, gasCost, { version: 1 })
        const signedTx = Neon.sign.transaction(tx, privateKey)
        // const hash = Neon.get.transactionHash(signedTx)
        // console.log(`Hash: ${hash}`)
        return Neon.get.RPCEndPoint('TestNet').then((rpc) => {
          console.log(rpc)
          return Query.sendRawTransaction(signedTx).execute(rpc)
        })
      })
      .then((res) => {
        res.should.have.property('result', true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('checkBalance', () => {
    console.log(acct.address)
    return Neon.get.tokenBalance(upgradedTestNode, RPX, acct.address)
      .then((balance) => {
        console.log(`Balance: ${balance}`)
        balance.should.be.above(0)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
