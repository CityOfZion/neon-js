import CryptoJS from 'crypto-js'
import {
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory
} from './utils'
import { verifyAddress, createSignatureScript, getHash } from './wallet'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
let base58 = require('base-x')(BASE58)

/**
 * Construct a ClaimTransaction from the given params.
 * @param {string[]} claims - A list of transactions to claim GAS from.
 * @param {string} publicKeyEncoded - Encoded public key.
 * @param {string} toAddress - Redundant param.
 * @param {number|string} amount - The amount of GAS to claim.
 * @returns {string} A serialised transaction ready to be signed with the corresponding private key of publicKeyEncoded.
 */
// TODO: Remove toAddress as it is redundant (not used in code).
export const claimTransaction = (claims, publicKeyEncoded, toAddress, amount) => {
  let signatureScript = createSignatureScript(publicKeyEncoded)
  let myProgramHash = getHash(signatureScript)

  // Type = ClaimTransaction
  let data = '02'

  // Version is always 0 in protocol for now
  data = data + '00'

  // Transaction-specific attributes: claims

  // 1) store number of claims (txids)
  let len = claims.length
  let lenstr = numStoreInMemory(len.toString(16), 2)
  data = data + lenstr

  // 2) iterate over claim txids
  for (let k = 0; k < len; k++) {
    // get the txid
    let txid = claims[k]['txid']
    // add txid to data
    data = data + ab2hexstring(reverseArray(hexstring2ab(txid)))

    let vout = claims[k]['index'].toString(16)
    data = data + numStoreInMemory(vout, 4)
  }

  // Don't need any attributes
  data = data + '00'

  // Don't need any inputs
  data = data + '00'

  // One output for where the claim will be sent
  data = data + '01'

  // First add assetId for GAS
  data = data + ab2hexstring(reverseArray(hexstring2ab('602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7')))

  // Net add total amount of the claim
  const num1str = numStoreInMemory(amount.toString(16), 16)
  data = data + num1str

  // Finally add program hash
  data = data + myProgramHash.toString()
  // console.log(data)

  return data
}

/**
 * Get input data for a new transaction given a list of coins and the amount for the transaction.
 * @param {Coin[]} coins - A list of coins available in the address.
 * @param {number|string} amount - Amount wanted in the transaction.
 * @return {object} Returns {amount: number, data: ArrayBuffer}. data can be directly appended to transaction as Inputs
 */
export const getInputData = (coins, amount) => {
  // sort in ascending order
  // TODO: improve this sort (Current implementation is bubble sort)
  let orderedCoins = coins['list']
  for (let i = 0; i < orderedCoins.length - 1; i++) {
    for (let j = 0; j < orderedCoins.length - 1 - i; j++) {
      if (parseFloat(orderedCoins[j].value) < parseFloat(orderedCoins[j + 1].value)) {
        let temp = orderedCoins[j]
        orderedCoins[j] = orderedCoins[j + 1]
        orderedCoins[j + 1] = temp
      }
    }
  }

  // Calculate total sum of coins available. If insufficient, exit
  let sum = 0
  for (let i = 0; i < orderedCoins.length; i++) {
    sum = sum + parseFloat(orderedCoins[i].value)
  }
  amount = parseFloat(amount)
  if (sum < amount) return -1

  // Find the number of coins we need to use to satisfy amount
  let k = 0
  while (parseFloat(orderedCoins[k].value) <= amount) {
    amount = amount - parseFloat(orderedCoins[k].value)
    if (amount === 0) break
    k = k + 1
  }

  // Array for serialised coin data
  let data = new Uint8Array(1 + 34 * (k + 1))

  // Array length indicator
  let inputNum = numStoreInMemory((k + 1).toString(16), 2)
  data.set(hexstring2ab(inputNum))

  // For each coin
  for (let x = 0; x < k + 1; x++) {
    // Serialise txid
    let pos = 1 + (x * 34)
    data.set(reverseArray(hexstring2ab(orderedCoins[x]['txid'])), pos)
    // data.set(hexstring2ab(coin_ordered[x]['txid']), pos)

    // Serialise index
    pos = 1 + (x * 34) + 32
    let inputIndex = numStoreInMemory(orderedCoins[x]['index'].toString(16), 4)
    // inputIndex = numStoreInMemory(coin_ordered[x]['n'].toString(16), 2)
    data.set(hexstring2ab(inputIndex), pos)
  }

  // calc totalAmount being serialised
  let totalAmount = 0
  for (let i = 0; i < k + 1; i++) {
    totalAmount = totalAmount + parseFloat(orderedCoins[i].value)
  }

  return {
    amount: totalAmount,
    data: data
  }
}

/**
 * Get Transaction ID from transaction.
 * @param {string} serializedTx - Serialized unsigned transaction
 * @returns {string} Transaction ID
 */
export const getTxHash = (serializedTx) => {
  const txHexString = CryptoJS.enc.Hex.parse(serializedTx)
  const txSha256 = CryptoJS.SHA256(txHexString)
  const txHash = CryptoJS.SHA256(txSha256)
  return txHash.toString()
}

/**
 * Constructs a ContractTransaction based on the given params. A ContractTransaction is a basic transaction to send NEO/GAS.
 * @param {Coin[]} coins - A list of relevant assets available at the address which the public key is provided.
 * @param {string} publicKeyEncoded - The encoded public key of the address from which the assets are coming from.
 * @param {string} toAddress - The address which the assets are going to.
 * @param {number|string} amount - The amount of assets to send.
 * @returns {string} A serialised transaction ready to be signed with the corresponding private key of publicKeyEncoded.
 */
export const transferTransaction = (coins, publicKeyEncoded, toAddress, amount) => {
  if (!verifyAddress(toAddress)) {
    throw new Error('Invalid toAddress')
  }
  let programHash = base58.decode(toAddress)
  programHash = programHash.slice(1, 21)

  let signatureScript = createSignatureScript(publicKeyEncoded)
  let myProgramHash = getHash(signatureScript)

  // Construct Inputs
  let inputData = getInputData(coins, amount)
  if (inputData === -1) return null
  // console.log('wallet inputData', inputData )

  let inputLen = inputData.data.length
  let inputAmount = inputData.amount

  // console.log(inputLen, inputAmount, $Amount)

  // Set SignableData Len
  // We can do this because this method assumes only one recipient.
  let signableDataLen = 124 + inputLen
  if (inputAmount === amount) {
    signableDataLen = 64 + inputLen
  }

  // Initialise transaction array
  let data = new Uint8Array(signableDataLen)

  // Type
  data.set(hexstring2ab('80'), 0)

  // Version
  data.set(hexstring2ab('00'), 1)

  // Attributes
  data.set(hexstring2ab('00'), 2)

  // INPUT array
  data.set(inputData.data, 3)

  // Construct Outputs
  if (inputAmount === amount) {
    // only one output

    // output array length indicator
    data.set(hexstring2ab('01'), inputLen + 3)

    // OUTPUT - 0
    // output asset
    data.set(reverseArray(hexstring2ab(coins['assetid'])), inputLen + 4)
    // data.set(hexstring2ab($coin['assetid']), inputLen + 4)

    // output value
    const num1 = parseInt(amount * 100000000)
    const num1str = numStoreInMemory(num1.toString(16), 16)
    data.set(hexstring2ab(num1str), inputLen + 36)

    // output ProgramHash
    data.set(programHash, inputLen + 44)
  } else {
    // output num
    data.set(hexstring2ab('02'), inputLen + 3)

    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab(coins['assetid'])), inputLen + 4)
    // data.set(hexstring2ab($coin['assetid']), inputLen + 4);

    // output value
    const num1 = parseInt(amount * 100000000)
    const num1str = numStoreInMemory(num1.toString(16), 16)
    data.set(hexstring2ab(num1str), inputLen + 36)

    // output ProgramHash
    data.set(programHash, inputLen + 44)

    // OUTPUT - 1

    // output asset
    data.set(reverseArray(hexstring2ab(coins['assetid'])), inputLen + 64)
    // data.set(hexstring2ab($coin['assetid']), inputLen + 64);

    // output value
    const num2 = parseInt(inputAmount * 100000000 - num1)
    const num2str = numStoreInMemory(num2.toString(16), 16)
    data.set(hexstring2ab(num2str), inputLen + 96)

    // output ProgramHash
    data.set(hexstring2ab(myProgramHash.toString()), inputLen + 104)

    // console.log( "Signature Data:", ab2hexstring(data) );
  }
  return ab2hexstring(data)
}
// TODO: We many not need to keep this function in the API
// for now, leaving as reference
// export const issueTransaction = ($issueAssetID, $issueAmount, $publicKeyEncoded) => {
//   let signatureScript = createSignatureScript($publicKeyEncoded)
//   // console.log( signatureScript.toString('hex') );

//   let myProgramHash = getHash(signatureScript)
//   // console.log( myProgramHash.toString() );

//   /// /////////////////////////////////////////////////////////////////////
//   // data
//   let data = '01'

//   // version
//   data = data + '00'

//   // attribute
//   data = data + '00'

//   // Inputs
//   data = data + '00'

//   // Outputs len
//   data = data + '01'

//   // Outputs[0] AssetID
//   data = data + $issueAssetID

//   // Outputs[0] Amount
//   const num1 = $issueAmount * 100000000
//   const num1str = numStoreInMemory(num1.toString(16), 16)
//   data = data + num1str

//   // Outputs[0] ProgramHash
//   data = data + myProgramHash.toString()

//   // console.log(data);

//   return data
// }

// TODO: we probably don't need to keep this function in the API, people aren't going to be using the wallet to register new assets
// for now, leaving as reference
// export const registerTransaction = ($assetName, $assetAmount, $publicKeyEncoded) => {
//   let ecparams = ecurve.getCurveByName('secp256r1')
//   let curvePt = ecurve.Point.decodeFrom(ecparams, Buffer.from($publicKeyEncoded, 'hex'))
//   let curvePtX = curvePt.affineX.toBuffer(32)
//   let curvePtY = curvePt.affineY.toBuffer(32)
//   // let publicKey = buffer.concat([Buffer.from([0x04]), curvePtX, curvePtY])

//   let signatureScript = createSignatureScript($publicKeyEncoded)

//   let myProgramHash = getHash(signatureScript)

//   // data
//   let data = '40'

//   // version
//   data = data + '00'

//   // asset name
//   let assetName = ab2hexstring(stringToBytes($assetName))
//   let assetNameLen = (assetName.length / 2).toString()
//   if (assetNameLen.length === 1) assetNameLen = '0' + assetNameLen
//   data = data + assetNameLen + assetName

//   // asset precision
//   data = data + '00'

//   // asset type
//   data = data + '01'

//   // asset recordtype
//   data = data + '00'

//   // asset amount
//   const num1 = $assetAmount * 100000000
//   const num1str = numStoreInMemory(num1.toString(16), 16)
//   data = data + num1str

//   // publickey
//   let publicKeyXStr = curvePtX.toString('hex')
//   let publicKeyYStr = curvePtY.toString('hex')

//   data = data + '20' + publicKeyXStr + '20' + publicKeyYStr
//   data = data + myProgramHash.toString()
//   data = data + '000000'

//   return data
// }
