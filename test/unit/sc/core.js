
import { createScript } from '../../../src/sc/core'
import data from './data.json'

describe.only('SC Core', function () {
  describe('createScript', function () {
    it('single intent', () => {
      Object.keys(data).map(key => {
        const testcase = data[key]
        const intent = {
          scriptHash: testcase.scriptHash,
          operation: testcase.operation,
          args: testcase.args
        }
        const result = createScript(intent)
        result.should.equal(testcase.script)
      })
    })

    it('multiple intents', () => {
      let expected = ''
      const intents = Object.keys(data).map(key => {
        const testcase = data[key]
        expected += testcase.script
        return {
          scriptHash: testcase.scriptHash,
          operation: testcase.operation,
          args: testcase.args
        }
      })
      const result = createScript(...intents)
      result.should.equal(expected)
    })

    it('multiple intents passed as array', () => {
      let expected = ''
      const intents = Object.keys(data).map(key => {
        const testcase = data[key]
        expected += testcase.script
        return {
          scriptHash: testcase.scriptHash,
          operation: testcase.operation,
          args: testcase.args
        }
      })
      const result = createScript(intents)
      result.should.equal(expected)
    })
  })
})
