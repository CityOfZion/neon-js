export const ADDR_VERSION = '17'

export const ASSETS = {
  NEO: 'NEO',
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b': 'NEO',
  GAS: 'GAS',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'GAS'
}

export const ASSET_ID = {
  NEO: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
  GAS: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

export const CONTRACTS = {
  RPX: 'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9',
  TEST_RPX: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
  TEST_LWTF: 'd7678dd97c000be3f33e9362e673101bac4ca654',
  TEST_NXT: '0b6c1f919e95fe61c17a7612aebfaf4fda3a2214',
  TEST_RHTT4: 'f9572c5b119a6b5775a6af07f1cef5d310038f55'
}

export const TEST_NXT_ADDRESS = 'AHcLAfnvzzHyuPPULeXrXZ6RK3Hkdvi1qi'

export const DEFAULT_RPC = {
  MAIN: 'https://seed1.neo.org:10331',
  TEST: 'https://seed1.neo.org:20331'
}

export const DEFAULT_REQ = { jsonrpc: '2.0', method: 'getblockcount', params: [], id: 1234 }

export const DEFAULT_SCRYPT = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
}

export const DEFAULT_WALLET = {
  name: 'myWallet',
  version: '1.0',
  scrypt: {},
  accounts: [],
  extra: null
}

export const DEFAULT_ACCOUNT_CONTRACT = {
  'script': '',
  'parameters': [
    {
      'name': 'signature',
      'type': 'Signature'
    }
  ],
  'deployed': false
}

export const NEO_NETWORK = {
  MAIN: 'MainNet',
  TEST: 'TestNet'
}

// specified by nep2, same as bip38
export const NEP_HEADER = '0142'

export const NEP_FLAG = 'e0'

export const RPC_VERSION = '2.3.2'

export const TX_VERSION = {
  'CLAIM': 0,
  'CONTRACT': 0,
  'INVOCATION': 1
}
