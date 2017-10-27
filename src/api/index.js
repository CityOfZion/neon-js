import NeonDB from './NeonDB'
import cmc from './coinmarketcap'
import nep5 from './nep5'

const mods = [NeonDB, cmc, nep5]

const api = mods.reduce((grp, mod) => {
  Object.keys(mod).map((key) => {
    if (grp[key]) Object.assign(grp[key], mod[key])
    else grp[key] = mod[key]
  })
  return grp
}, {})

export * from './NeonDB'
export * from './coinmarketcap'
export * from './nep5'

export default api
