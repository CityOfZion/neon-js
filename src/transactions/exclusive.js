import { num2fixed8, fixed82num, num2VarInt } from '../utils'
import { serializeTransactionInput, deserializeTransactionInput } from './components'

/**
 * @param {StringStream} ss
 * @return {object} {claims: TransactionInput[]}
 */
const deserializeClaimExclusive = (ss) => {
  let out = {
    claims: []
  }
  const claimLength = ss.readVarInt()
  for (let i = 0; i < claimLength; i++) {
    out.claims.push(deserializeTransactionInput(ss))
  }
  return out
}

/**
 * @param {Transaction}
 * @return {string}
 */
const serializeClaimExclusive = (tx) => {
  if (tx.type !== 0x02) throw new Error()
  let out = num2VarInt(tx.claims.length)
  for (const claim of tx.claims) {
    out += serializeTransactionInput(claim)
  }
  return out
}

const deserializeContractExclusive = (ss) => {
  return {}
}

const serializeContractExclusive = (tx) => {
  if (tx.type !== 0x80) throw new Error()
  return ''
}

/**
 * @param {StringStream} ss
 * @return {object} {script: string, gas: number}
 */
const deserializeInvocationExclusive = (ss) => {
  const script = ss.readVarBytes()
  const version = parseInt(ss.str.substr(2, 2), 2)
  const gas = version >= 1 ? fixed82num(ss.read(8)) : 0
  return { script, gas }
}

const serializeInvocationExclusive = (tx) => {
  if (tx.type !== 0xd1) throw new Error()
  let out = num2VarInt(tx.script.length / 2)
  out += tx.script
  if (tx.version >= 1) out += num2fixed8(tx.gas)
  return out
}

export const serialize = {
  2: serializeClaimExclusive,
  128: serializeContractExclusive,
  209: serializeInvocationExclusive
}

export const deserialize = {
  2: deserializeClaimExclusive,
  128: deserializeContractExclusive,
  209: deserializeInvocationExclusive
}
