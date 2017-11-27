declare module '@cityofzion/neon-js' {
  export module CONST {
    export const ADDR_VERISON = '17'

    export namespace ASSETS {
      export const NEO: string
      export const c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b: string
      export const GAS: string
    }

    export namespace ASSET_ID {
      export const NEO: string
      export const GAS: string
    }

    export namespace CONTRACTS {
      export const RPX: string
      export const TEST_RPX: string
    }

    export namespace DEFAULT_RPC {
      export const MAIN: string
      export const TEST: string
    }

    export const DEFAULT_REQ: object

    export namespace NEO_NETWORK {
      export const MAIN: string
      export const TEST: string
    }

    export const RPC_VERSION: string

    export namespace TX_VERSION {
      export const CLAIM: number
      export const CONTRACT: number
      export const INVOCATION: number
    }
  }
}
