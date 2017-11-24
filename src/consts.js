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
  TEST_RPX: '5b7074e873973a6ed3708862f219a6fbf4d1c411'
}

export const DEFAULT_RPC = {
  MAIN: 'http://seed1.neo.org:10332',
  TEST: 'http://seed1.neo.org:20332'
}

export const DEFAULT_REQ = { jsonrpc: '2.0', method: 'getblockcount', params: [], id: 1234 }

export const DEFAULT_SCRYPT = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
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
