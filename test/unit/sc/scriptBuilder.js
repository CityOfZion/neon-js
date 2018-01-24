import ScriptBuilder from '../../../src/sc/ScriptBuilder'
import data from './data.json'

describe('ScriptBuilder', function () {
  const integers = [
    {
      int: -1,
      result: '4f' // opCodes.PUSHM1 (0x4F)
    },
    {
      int: 0,
      result: '00'
    },
    {
      int: 13,
      result: (0x50 + 13).toString(16)
    },
    {
      int: 500,
      result: '08f401000000000000'
    },
    {
      int: 65536,
      result: '080000010000000000'
    }
  ]

  it('emitAppCall', () => {
    Object.keys(data).map((key) => {
      let testcase = data[key]
      let sb = new ScriptBuilder()
      const script = sb.emitAppCall(testcase.scriptHash, testcase.operation, testcase.args).str
      script.should.equal(testcase.script)
    })
  })

  it('_emitNum', () => {
    for (let i = 0; i < integers.length; i++) {
      let sb = new ScriptBuilder()
      const result = sb._emitNum(integers[i].int)
      result.str.should.equal(integers[i].result)
    }
  })
})
