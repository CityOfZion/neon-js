import * as neonDB from './NeonDB'
import * as cmc from './coinmarketcap'
import * as nep5 from './nep5'
import * as neoscan from './neoscan'

export default {
  get: {
    price: cmc.getPrice,
    balance: neonDB.getBalance,
    claims: neonDB.getClaims,
    transactionHistory: neonDB.getTransactionHistory,
    tokenBalance: nep5.getTokenBalance,
    tokenInfo: nep5.getTokenInfo
  },
  do: {
    sendAsset: neonDB.doSendAsset,
    claimAllGas: neonDB.doClaimAllGas,
    mintTokens: neonDB.doMintTokens
  }

}

export * from './core'
export { neonDB, cmc, nep5, neoscan }
