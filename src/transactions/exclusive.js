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
 * @param {Transaction} tx - Transaction.
 * @return {string} hexstring
 */
const serializeClaimExclusive = (tx) => {
  if (tx.type !== 0x02) throw new Error()
  let out = num2VarInt(tx.claims.length)
  for (const claim of tx.claims) {
    out += serializeTransactionInput(claim)
  }
  return out
}

/**
 * @param {Transaction} tx
 * @return {object} {claims: TransactionInput[]}
 */
const getClaimExclusive = (tx) => {
  return Object.assign({ claims: [] }, { claims: tx.claims })
}

/**
 * @param {StringStream} ss
 * @return {object} {}
 */
const deserializeContractExclusive = (ss) => {
  return {}
}

/**
 * @param {Transaction} tx - Transaction.
 * @return {string} ''
 */
const serializeContractExclusive = (tx) => {
  if (tx.type !== 0x80) throw new Error()
  return ''
}

/**
 * @param {Transaction} tx
 * @return {object} {}
 */
const getContractExclusive = (tx) => {
  return {}
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

/**
 * @param {Transaction} tx
 * @return {string}
 */
const serializeInvocationExclusive = (tx) => {
  if (tx.type !== 0xd1) throw new Error()
  let out = num2VarInt(tx.script.length / 2)
  out += tx.script
  if (tx.version >= 1) out += num2fixed8(tx.gas)
  return out
}

const getInvocationExclusive = (tx) => {
  return { script: tx.script || '', gas: tx.gas || 0 }
}

export const serializeExclusive = {
  2: serializeClaimExclusive,
  128: serializeContractExclusive,
  209: serializeInvocationExclusive
}

export const deserializeExclusive = {
  2: deserializeClaimExclusive,
  128: deserializeContractExclusive,
  209: deserializeInvocationExclusive
}

export const getExclusive = {
  2: getClaimExclusive,
  128: getContractExclusive,
  209: getInvocationExclusive
}
