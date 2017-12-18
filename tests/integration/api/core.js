import * as core from '../../../src/api/core'
import { CONTRACTS } from '../../../src/consts'
import { ContractParam } from '../../../src/sc'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API Core', function () {
  this.timeout(20000)
  let mock

  afterEach(() => {
    if (mock) mock.restore()
  })
  describe('sendAsset', function () {
    it('NeonDB', () => {
      const intent1 = core.makeIntent({ NEO: 1 }, testKeys.a.address)
      const config1 = {
        net: 'TestNet',
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey,
        intents: intent1
      }

      return core.sendAsset(config1)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })

    it('Neoscan', () => {
      mock = setupMock()
      mock.onGet(/testnet-api.wallet/).timeout()
      mock.onAny().passThrough()

      const intent2 = core.makeIntent({ NEO: 1 }, testKeys.b.address)
      const config2 = {
        net: 'TestNet',
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        intents: intent2
      }
      return core.sendAsset(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })
  })

  describe('claimGas', function () {
    it('neonDB', () => {
      const config = {
        net: 'TestNet',
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey
      }
      return core.claimGas(config)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })

    it('neoscan', () => {
      mock = setupMock()
      mock.onGet(/testnet-api.wallet/).timeout()
      mock.onAny().passThrough()

      const config2 = {
        net: 'TestNet',
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey
      }
      return core.claimGas(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })
  })

  describe('doInvoke', function () {
    it('neonDB', () => {
      const config = {
        net: 'TestNet',
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        intents: core.makeIntent({ GAS: 0.1 }, testKeys.a.address),
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
        gas: 0
      }
      return core.doInvoke(config)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })

    it('neoscan', () => {
      // This does a transferToken
      mock = setupMock()
      mock.onGet(/testnet-api.wallet/).timeout()
      mock.onAny().passThrough()
      const fromAddrScriptHash = ContractParam.byteArray(testKeys.b.address, 'address')
      const toAddrScriptHash = ContractParam.byteArray(testKeys.c.address, 'address')
      const transferAmount = ContractParam.byteArray(0.00000001, 'fixed8')
      const script = {
        scriptHash: CONTRACTS.TEST_LWTF,
        operation: 'transfer',
        args: ContractParam.array(fromAddrScriptHash, toAddrScriptHash, transferAmount)
      }
      const config2 = {
        net: 'TestNet',
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey,
        intents: core.makeIntent({ GAS: 0.1 }, testKeys.b.address),
        script,
        gas: 0
      }
      return core.doInvoke(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          console.log(c.response.txid)
        })
    })
  })
})
