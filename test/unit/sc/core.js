
import { createScript, generateDeployScript } from '../../../src/sc/core'
import data from './data.json'

describe('SC Core', function () {
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

  describe('generateDeployScript', function () {
    it('generate deploy script', () => {
      const script = generateDeployScript({
        script: '54c56b6c766b00527ac46c766b51527ac46c766b00c36c766b51c3936c766b52527ac46203006c766b52c3616c7566',
        name: 'Add',
        version: '1',
        author: 'Ethan Fast',
        email: 'test@test.com',
        description: 'Add',
        returnType: 5,
        parameterList: '05'

      })
      script.str.should.equal('034164640d7465737440746573742e636f6d0a457468616e2046617374013103416464005501052f54c56b6c766b00527ac46c766b51527ac46c766b00c36c766b51c3936c766b52527ac46203006c766b52c3616c756668134e656f2e436f6e74726163742e437265617465')
    })
  })
})
