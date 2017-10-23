import Query from '../../src/rpc/query'
import { DEFAULT_REQ, DEFAULT_RPC } from '../../src/consts'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Query', function () {
  let mock

  it('Constructor', () => {
    const q1 = new Query({ method: 'getThis' })
    q1.req.should.eql({ jsonrpc: '2.0', method: 'getThis', params: [], id: 1234 })
    const q2 = new Query({ method: 'getThat', params: [1], id: 3456 })
    q2.req.should.eql({ jsonrpc: '2.0', method: 'getThat', params: [1], id: 3456 })
  })

  describe('Methods', function () {
    beforeEach(() => {
      mock = new MockAdapter(axios)
    })

    it('executes correctly', () => {
      const req = Object.assign({}, DEFAULT_REQ, { method: 'getbestblockhash' })
      mock
        .onPost(DEFAULT_RPC.TEST, req).reply(200, {
          'jsonrpc': '2.0',
          'id': 1234,
          'result': '1'
        })
        .onPost(DEFAULT_RPC.MAIN, req).reply(200, {
          'jsonrpc': '2.0',
          'id': 1234,
          'result': '2'
        })
        .onPost('http://localhost:10332', req).reply(200, {
          'jsonrpc': '2.0',
          'id': 1234,
          'result': '3'
        })
      const q1 = new Query({ method: 'getbestblockhash' })
      const p1 = q1.execute(DEFAULT_RPC.TEST)
      const q2 = new Query({ method: 'getbestblockhash' })
      const p2 = q2.execute(DEFAULT_RPC.MAIN)
      const q3 = new Query({ method: 'getbestblockhash' })
      const p3 = q3.execute('http://localhost:10332')

      return Promise.all([p1, p2, p3])
        .then((values) => {
          values.map((i) => i.result).should.eql(['1', '2', '3'])
        })
    })

    it('error when executed twice', () => {
      mock.onPost().reply(200, {
        'jsonrpc': '2.0',
        'id': 1234,
        'result': '1'
      })
      const q = new Query({ method: 'getbestblockhash' })
      return q.execute(DEFAULT_RPC.TEST)
        .then((res) => {
          return q.execute(DEFAULT_RPC.TEST)
        })
        .should.eventually.be.rejected
    })

    it('parseWith', () => {
      mock.onPost().reply(200, {
        'jsonrpc': '2.0',
        'id': 1234,
        'result': 'lowercase'
      })
      const q = new Query().parseWith((i) => i.result.toUpperCase())
      return q.execute(DEFAULT_RPC.TEST)
        .then((res) => {
          q.parse.should.be.a('function')
          res.should.equal('LOWERCASE')
        })
    })
  })
})
