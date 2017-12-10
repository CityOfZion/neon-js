import * as core from '../../../src/api/core'

describe('Integration: API Core', function () {
  this.timeout(20000)
  let mock

  afterEach(() => {
    if (mock) mock.restore()
  })
  describe('sendAsset', function () {
    it('NeonDB', () => {
      const intent1 = core.makeIntent({ NEO: 1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
      const config1 = {
        net: 'TestNet',
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
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

      const intent2 = core.makeIntent({ NEO: 1 }, 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
      const config2 = {
        net: 'TestNet',
        address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
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
        address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344'
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
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69'
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
        address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
        privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344',
        intents: core.makeIntent({ GAS: 0.1 }, 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'),
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
      mock = setupMock()
      mock.onGet(/testnet-api.wallet/).timeout()
      mock.onAny().passThrough()

      const config2 = {
        net: 'TestNet',
        address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
        privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
        intents: core.makeIntent({ GAS: 0.1 }, 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s'),
        script: '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
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
