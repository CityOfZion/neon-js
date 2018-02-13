import Query from '../../../src/rpc/query'
import ContractParam from '../../../src/sc/ContractParam'
import { DEFAULT_RPC, ASSET_ID, CONTRACTS } from '../../../src/consts'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('Query', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.query)
  })

  after(() => {
    mock.restore()
  })

  it('Constructor', () => {
    const q1 = new Query({ method: 'getThis' })
    q1.req.should.eql({ jsonrpc: '2.0', method: 'getThis', params: [], id: 1234 })
    const q2 = new Query({ method: 'getThat', params: [1], id: 3456 })
    q2.req.should.eql({ jsonrpc: '2.0', method: 'getThat', params: [1], id: 3456 })
  })

  describe('Methods', function () {
    it('error when executed twice', () => {
      const q = new Query({ method: 'getbestblockhash' })
      return q.execute(DEFAULT_RPC.TEST)
        .then((res) => {
          return q.execute(DEFAULT_RPC.TEST)
        })
        .should.eventually.be.rejected
    })

    it('parseWith', () => {
      const q = new Query({ method: 'parsertest' }).parseWith((i) => i.result.toUpperCase())
      return q.execute(DEFAULT_RPC.TEST)
        .then((res) => {
          q.parse.should.be.a('function')
          res.should.equal('LOWERCASE')
        })
    })
  })

  describe('RPC Queries', function () {
    it('getAccountState', () => {
      Query.getAccountState(testKeys.a.address).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getaccountstate',
        params: [testKeys.a.address]
      })
    })

    it('getAssetState', () => {
      Query.getAssetState(ASSET_ID.NEO).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getassetstate',
        params: [ASSET_ID.NEO]
      })
    })

    describe('getBlock', function () {
      it('by index', () => {
        Query.getBlock(1).req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'getblock',
          params: [1, 1]
        })
      })

      it('by hash', () => {
        return Query.getBlock('0012f8566567a9d7ddf25acb5cf98286c9703297de675d01ba73fbfe6bcb841c').req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'getblock',
          params: ['0012f8566567a9d7ddf25acb5cf98286c9703297de675d01ba73fbfe6bcb841c', 1]
        })
      })

      it('by index without verbose', () => {
        Query.getBlock(1, 0).req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'getblock',
          params: [1, 0]
        })
      })
    })

    it('getBlockHash', () => {
      Query.getBlockHash(1).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getblockhash',
        params: [1]
      })
    })

    it('getBestBlockHash', () => {
      Query.getBestBlockHash().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getbestblockhash',
        params: []
      })
    })

    it('getBlockCount', () => {
      Query.getBlockCount().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getblockcount',
        params: []
      })
    })

    it('getBlockSysFee', () => {
      Query.getBlockSysFee(1).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getblocksysfee',
        params: [1]
      })
    })

    it('getConnectionCount', () => {
      Query.getConnectionCount().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getconnectioncount',
        params: []
      })
    })

    it('getContractState', () => {
      Query.getContractState(CONTRACTS.TEST_RPX).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getcontractstate',
        params: [CONTRACTS.TEST_RPX]
      })
    })

    it('getPeers', () => {
      Query.getPeers().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getpeers',
        params: []
      })
    })

    it('getRawMemPool', () => {
      Query.getRawMemPool().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getrawmempool',
        params: []
      })
    })

    describe('getRawTransaction', function () {
      it('verbose', () => {
        Query.getRawTransaction('7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3').req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'getrawtransaction',
          params: ['7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3', 1]
        })
      })

      it('non-verbose', () => {
        Query.getRawTransaction('7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3', 0).req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'getrawtransaction',
          params: ['7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3', 0]
        })
      })
    })

    it('getStorage', () => {
      // RPX Test contract stores data by reversed scripthash
      Query.getStorage(CONTRACTS.TEST_RPX, '9847e26135152874355e324afd5cc99f002acb33').req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getstorage',
        params: [CONTRACTS.TEST_RPX, '9847e26135152874355e324afd5cc99f002acb33']
      })
    })

    it('getTxOut', () => {
      Query.getTxOut('7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3', 0).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'gettxout',
        params: ['7772761db659270d8859a9d5084ec69d49669bba574881eb4c67d7035792d1d3', 0]
      })
    })

    it('getVersion', () => {
      Query.getVersion().req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'getversion',
        params: []
      })
    })

    describe('invoke', () => {
      it('simple', () => {
        return Query.invoke(CONTRACTS.TEST_RPX, ContractParam.string('name'), ContractParam.boolean(false)).req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'invoke',
          params: [
            '5b7074e873973a6ed3708862f219a6fbf4d1c411',
            [
              {
                type: 'String',
                value: 'name'
              },
              {
                type: 'Boolean',
                value: false
              }
            ]
          ]
        })
      })

      it('complex', () => {
        Query.invoke(CONTRACTS.TEST_RPX, ContractParam.string('balanceOf'), ContractParam.array(ContractParam.byteArray('AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx', 'address'))).req.should.eql({
          id: 1234,
          jsonrpc: '2.0',
          method: 'invoke',
          params: [
            '5b7074e873973a6ed3708862f219a6fbf4d1c411',
            [
              {
                type: 'String',
                value: 'balanceOf'
              },
              {
                type: 'Array',
                value: [
                  {
                    type: 'ByteArray',
                    value: '9847e26135152874355e324afd5cc99f002acb33'
                  }
                ]
              }
            ]
          ]
        })
      })
    })

    it('invokeFunction', () => {
      return Query.invokeFunction(CONTRACTS.TEST_RPX, 'name').req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'invokefunction',
        params: [CONTRACTS.TEST_RPX, 'name', []]
      })
    })

    it('invokeScript', () => {
      return Query.invokeScript('00c1046e616d656711c4d1f4fba619f2628870d36e3a9773e874705b').req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'invokescript',
        params: ['00c1046e616d656711c4d1f4fba619f2628870d36e3a9773e874705b']
      })
    })

    it('sendRawTransaction')
    it('submitBlock')
    it('validateAddress', () => {
      Query.validateAddress(testKeys.a.address).req.should.eql({
        id: 1234,
        jsonrpc: '2.0',
        method: 'validateaddress',
        params: [testKeys.a.address]
      })
    })
  })
})
