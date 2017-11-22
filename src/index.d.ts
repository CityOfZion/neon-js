import u from './utils'
import CONST from './consts'
import tx from './transactions'
import api from './api'
import sc from './sc'
import rpc from './rpc'
import wallet from './wallet'

export as namespace Neon;

declare module 'api' {
  export = api
}

declare module 'CONST' {
  export = CONST
}

declare module 'rpc' {
  export = rpc
}

declare module 'sc' {
  export = sc
}

declare module 'tx' {
  export = tx
}

declare module 'u' {
  export = u
}

declare module 'wallet' {
  export = wallet
}
