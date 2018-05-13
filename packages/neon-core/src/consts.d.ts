import { Account } from "./wallet"

export const ADDR_VERSION = '17'

export namespace ASSETS {
  export const NEO: string
  export const GAS: string
}

export namespace ASSET_ID {
  export const NEO: string
  export const GAS: string
}

export namespace CONTRACTS {
  export const RPX: string
  export const TEST_RPX: string
  export const TEST_LWTF: string
  export const TEST_NXT: string
  export const TEST_RHTT4: string
}

export namespace DEFAULT_RPC {
  export const MAIN: string
  export const TEST: string
}

export const DEFAULT_REQ: {
  jsonrpc: string
  method: string
  params: any[]
  id: number
}

export const DEFAULT_SCRYPT: {
  cost: number
  blockSize: number
  parallel: number
  size: number
}

export const DEFAULT_WALLET: {
  name: string
  version: string,
  scrypt: object
  accounts: Account[]
  extra: any
}

export const DEFAULT_ACCOUNT_CONTRACT: {
  script: string
  parameters: any[]
  deployed: boolean
}

export namespace NEO_NETWORK {
  export const MAIN: string
  export const TEST: string
}

export const NEP_HEADER: string

export const NEP_FLAG: string

export const RPC_VERSION: string

export namespace TX_VERSION {
  export const CLAIM: number
  export const CONTRACT: number
  export const INVOCATION: number
}

export as namespace CONST

