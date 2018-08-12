import * as core from '../../../src/api/core'
import * as APIswitch from '../../../src/api/switch'
import { CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import { ContractParam } from '../../../src/sc'
import { Account } from '../../../src/wallet'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API Core', function () {
  this.timeout(30000)
  const log = setupLogs()
  log.info('Integration: API Core')
  let mock

  const useNeonDB = () => {
    APIswitch.setApiSwitch(0)
    mock = setupMock()
    mock.onGet(/neoscan/).timeout()
    mock.onAny().passThrough()
  }

  const useNeoscan = () => {
    APIswitch.setApiSwitch(1)
    mock = setupMock()
    mock.onGet(/testnet-api.wallet/).timeout()
    mock.onAny().passThrough()
  }
  afterEach(() => {
    APIswitch.setApiSwitch(0)
    if (mock) mock.restore()
  })
  describe('sendAsset', function () {
    it.skip('NeonDB', () => {
      useNeonDB()

      const intent1 = core.makeIntent({ NEO: 1 }, testKeys.a.address)
      const config1 = {
        net: NEO_NETWORK.TEST,
        account: new Account(testKeys.b.privateKey),
        intents: intent1
      }

      return core.sendAsset(config1)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`sendAsset(neonDB): ${c.response.txid}`)
        })
    })

    it('Neoscan', () => {
      useNeoscan()

      const intent2 = core.makeIntent({ NEO: 1 }, testKeys.b.address)
      const config2 = {
        net: NEO_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        intents: intent2,
        fees: 0.00000001
      }
      return core.sendAsset(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`sendAsset(neoscan): ${c.response.txid}`)
        })
    })
  })

  describe('claimGas', function () {
    it.skip('neonDB', () => {
      useNeonDB()

      const config = {
        net: NEO_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey
      }
      return core.claimGas(config)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`claimGas(neonDB): ${c.response.txid}`)
        })
    })

    it('neoscan', () => {
      useNeoscan()

      const config2 = {
        net: NEO_NETWORK.TEST,
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey
      }
      return core.claimGas(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`claimGas(neoscan): ${c.response.txid}`)
        })
    })
  })

  describe('doInvoke', function () {
    it.skip('neonDB', () => {
      useNeonDB()

      const config = {
        net: NEO_NETWORK.TEST,
        address: testKeys.a.address,
        privateKey: testKeys.a.privateKey,
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
        gas: 0
      }
      return core.doInvoke(config)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`doInvoke(neonDB): ${c.response.txid}`)
        })
    })

    it('neoscan', () => {
      // This does a transferToken
      useNeoscan()
      const fromAddrScriptHash = ContractParam.byteArray(testKeys.b.address, 'address')
      const toAddrScriptHash = ContractParam.byteArray(testKeys.c.address, 'address')
      const transferAmount = ContractParam.byteArray(0.00000001, 'fixed8')
      const script = {
        scriptHash: CONTRACTS.TEST_LWTF,
        operation: 'transfer',
        args: ContractParam.array(fromAddrScriptHash, toAddrScriptHash, transferAmount)
      }
      const config2 = {
        net: NEO_NETWORK.TEST,
        address: testKeys.b.address,
        privateKey: testKeys.b.privateKey,
        script,
        gas: 0
      }
      return core.doInvoke(config2)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`doInvoke(neoscan): ${c.response.txid}`)
        })
    })
  })

  describe('setupVote', function () {
    it('neoscan', () => {
      useNeoscan()
      const stateConfig = {
        net: 'TestNet',
        account: new Account(testKeys.a.privateKey),
        candidateKeys: [
          '030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e36',
          '0327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8'
        ]
      }
      return core.setupVote(stateConfig)
        .then((c) => {
          c.response.result.should.equal(true)
          log.info(`setupVote(neoscan): ${c.response.txid}`)
        })
    })
  })
})
