import * as api from './api'
import semanticSc, * as sc from './sc'
import semanticTx, * as tx from './transactions'
import semanticWallet, * as wallet from './wallet'
import * as nep5 from './nep5'
import * as u from './utils'

const mods = [semanticSc, semanticTx, semanticWallet]

const Neon = mods.reduce((neon, mod) => {
  Object.keys(mod).map((key) => {
    if (neon[key]) Object.assign(neon[key], mod[key])
    else neon[key] = mod[key]
  })
  return neon
}, { api })

export default Neon
export {
  api,
  sc,
  tx,
  wallet,
  nep5,
  u
}
