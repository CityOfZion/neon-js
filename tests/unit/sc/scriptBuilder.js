import ScriptBuilder from '../../../src/sc/ScriptBuilder'

describe('ScriptBuilder', function () {
  const data = {
    '1': {
      'script': '00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc',
      'scriptHash': 'dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f',
      'operation': 'name',
      'args': []
    },
    '2': {
      'script': '000673796d626f6c6711c4d1f4fba619f2628870d36e3a9773e874705b',
      'scriptHash': '5b7074e873973a6ed3708862f219a6fbf4d1c411',
      'operation': 'symbol',
      'args': undefined
    },
    '3': {
      'script': '0008646563696d616c736711c4d1f4fba619f2628870d36e3a9773e874705b',
      'scriptHash': '5b7074e873973a6ed3708862f219a6fbf4d1c411',
      'operation': 'decimals',
      'args': false
    },
    '4': {
      'script': '205fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b',
      'scriptHash': '5b7074e873973a6ed3708862f219a6fbf4d1c411',
      'operation': 'balanceOf',
      'args': ['5fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b']
    },
    '5': {
      'script': '5767b7040c106561763ce38c0ce658a946e5d1b381db',
      'scriptHash': 'db81b3d1e546a958e60c8ce33c766165100c04b7',
      'operation': null,
      'args': 7
    }
  }

  const integers = [
    {
      int: -1,
      result: '4f'  // opCodes.PUSHM1 (0x4F)
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
