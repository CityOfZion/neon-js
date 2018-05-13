import ScriptBuilder from '../../../src/sc/ScriptBuilder'
import data from './data.json'

describe('ScriptBuilder', function () {
  it('emitAppCall', () => {
    Object.keys(data).map((key) => {
      let testcase = data[key]
      let sb = new ScriptBuilder()
      const script = sb.emitAppCall(testcase.scriptHash, testcase.operation, testcase.args).str
      script.should.equal(testcase.script)
    })
  })

  it('_emitNum', () => {
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

    for (let i = 0; i < integers.length; i++) {
      let sb = new ScriptBuilder()
      const result = sb._emitNum(integers[i].int)
      result.str.should.equal(integers[i].result)
    }
  })

  it('_emitString', () => {
    const strings = [
      {
        input: 'a'.repeat(75 * 2),
        output: '4b' + 'a'.repeat(75 * 2)
      },
      {
        input: 'a'.repeat(0xff * 2),
        output: '4c' + 'ff' + 'a'.repeat(0xff * 2)
      },
      {
        input: 'a'.repeat(0xffff * 2),
        output: '4d' + 'ffff' + 'a'.repeat(0xffff * 2)
      },
      {
        input: 'a'.repeat(0x1234 * 2),
        output: '4d' + '3412' + 'a'.repeat(0x1234 * 2)
      },
      {
        input: 'a'.repeat(0x00010000 * 2),
        output: '4e' + '00000100' + 'a'.repeat(0x00010000 * 2)
      }
    ]
    for (let i = 0; i < strings.length; i++) {
      let sb = new ScriptBuilder()
      const result = sb._emitString(strings[i].input)
      result.str.should.equal(strings[i].output, 'uh huh')
    }
  })

  describe('toScriptParams', function () {
    it('simple', () => {
      Object.keys(data).map((key) => {
        let testcase = data[key]
        let sb = new ScriptBuilder(testcase.script)
        let scriptParams = sb.toScriptParams()
        scriptParams.should.eql(testcase.toScriptParams)
      })
    })

    it('complex', () => {
      const s = '00046e616d656754a64cac1b1073e662933ef3e30b007cd98d67d7000673796d626f6c6754a64cac1b1073e662933ef3e30b007cd98d67d70008646563696d616c736754a64cac1b1073e662933ef3e30b007cd98d67d7000b746f74616c537570706c796754a64cac1b1073e662933ef3e30b007cd98d67d7149847e26135152874355e324afd5cc99f002acb3351c10962616c616e63654f666754a64cac1b1073e662933ef3e30b007cd98d67d7'
      const expected = [
        { scriptHash: 'd7678dd97c000be3f33e9362e673101bac4ca654', args: ['6e616d65', 0], useTailCall: false },
        { scriptHash: 'd7678dd97c000be3f33e9362e673101bac4ca654', args: ['73796d626f6c', 0], useTailCall: false },
        { scriptHash: 'd7678dd97c000be3f33e9362e673101bac4ca654', args: ['646563696d616c73', 0], useTailCall: false },
        { scriptHash: 'd7678dd97c000be3f33e9362e673101bac4ca654', args: ['746f74616c537570706c79', 0], useTailCall: false },
        { scriptHash: 'd7678dd97c000be3f33e9362e673101bac4ca654', args: ['62616c616e63654f66', ['9847e26135152874355e324afd5cc99f002acb33']], useTailCall: false }
      ]
      let sb = new ScriptBuilder(s)
      let result = sb.toScriptParams()
      result.length.should.equal(5)
      result.should.eql(expected)
    })

    it('nonce parsing', () => {
      const s = '0500aba2bb00147a0b8862fdcae2cc8118b8f4e036d4ccf98bb61b14235a717ed7ed18a43de47499c3d05b8d4a4bcf3a53c1087472616e7366657267fb1c540417067c270dee32f21023aa8b9b71abcef10580dda2a30b14d1e8f4ede57f233d744551c53f0b3d31d9f1d35714235a717ed7ed18a43de47499c3d05b8d4a4bcf3a53c1087472616e7366657267fb1c540417067c270dee32f21023aa8b9b71abcef16694e6b7719d8e7ead'
      const expected = [
        { scriptHash: 'ceab719b8baa2310f232ee0d277c061704541cfb', args: ['7472616e73666572', ['00aba2bb00', '7a0b8862fdcae2cc8118b8f4e036d4ccf98bb61b', '235a717ed7ed18a43de47499c3d05b8d4a4bcf3a']], useTailCall: false },
        { scriptHash: 'ceab719b8baa2310f232ee0d277c061704541cfb', args: ['7472616e73666572', ['80dda2a30b', 'd1e8f4ede57f233d744551c53f0b3d31d9f1d357', '235a717ed7ed18a43de47499c3d05b8d4a4bcf3a']], useTailCall: false }
      ]
      let sb = new ScriptBuilder(s)
      let result = sb.toScriptParams()
      result.length.should.equal(2)
      result.should.eql(expected)
    })
  })
})
