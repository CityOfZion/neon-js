import ecurve from 'ecurve'
import BigInteger from 'bigi'
import { ec as EC } from 'elliptic'
import CryptoJS from 'crypto-js'
import WIF from 'wif'
import {
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes
} from './utils'
import secureRandom from 'secure-random'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
let base58 = require('base-x')(BASE58)

// All of this stuff was wrapped in a class before, but really unnecessary as none of these were stateful
// This flat structure should be more interpretable, and we can export them all as a module instead

// TODO: exporting ALL of these, but some of them are probably helpers and don't need to be exported
// TODO: go through and add at least a basic description of everything these methods are doing

/**
 * Encodes Private Key into WIF
 * @param {ArrayBuffer} privateKey - Private Key
 * @returns {string} WIF key
 */
export const getWIFFromPrivateKey = (privateKey) => {
  const hexKey = ab2hexstring(privateKey)
  return WIF.encode(128, Buffer.from(hexKey, 'hex'), true)
}

/**
 * Get Transaction ID from transaction.
 * @param {string} serializedTx - Serialized unsigned transaction
 * @returns {string} Transaction ID
 */
export const getTxHash = (serializedTx) => {
  let txHexString = CryptoJS.enc.Hex.parse(serializedTx)
  let txSha256 = CryptoJS.SHA256(txHexString)
  let txHash = CryptoJS.SHA256(txSha256)
  return txHash.toString()
}

// TODO: this needs a lot of documentation, also better name!
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

// TODO: We many not need to keep this function in the API
// for now, leaving as reference
export const issueTransaction = ($issueAssetID, $issueAmount, $publicKeyEncoded) => {
  let signatureScript = createSignatureScript($publicKeyEncoded)
  // console.log( signatureScript.toString('hex') );

  let myProgramHash = getHash(signatureScript)
  // console.log( myProgramHash.toString() );

  /// /////////////////////////////////////////////////////////////////////
  // data
  let data = '01'

  // version
  data = data + '00'

  // attribute
  data = data + '00'

  // Inputs
  data = data + '00'

  // Outputs len
  data = data + '01'

  // Outputs[0] AssetID
  data = data + $issueAssetID

  // Outputs[0] Amount
  const num1 = $issueAmount * 100000000
  const num1str = numStoreInMemory(num1.toString(16), 16)
  data = data + num1str

  // Outputs[0] ProgramHash
  data = data + myProgramHash.toString()

  // console.log(data);

  return data
}

// TODO: we probably don't need to keep this function in the API, people aren't going to be using the wallet to register new assets
// for now, leaving as reference
export const registerTransaction = ($assetName, $assetAmount, $publicKeyEncoded) => {
  let ecparams = ecurve.getCurveByName('secp256r1')
  let curvePt = ecurve.Point.decodeFrom(ecparams, Buffer.from($publicKeyEncoded, 'hex'))
  let curvePtX = curvePt.affineX.toBuffer(32)
  let curvePtY = curvePt.affineY.toBuffer(32)
  // let publicKey = buffer.concat([Buffer.from([0x04]), curvePtX, curvePtY])

  let signatureScript = createSignatureScript($publicKeyEncoded)

  let myProgramHash = getHash(signatureScript)

  // data
  let data = '40'

  // version
  data = data + '00'

  // asset name
  let assetName = ab2hexstring(stringToBytes($assetName))
  let assetNameLen = (assetName.length / 2).toString()
  if (assetNameLen.length === 1) assetNameLen = '0' + assetNameLen
  data = data + assetNameLen + assetName

  // asset precision
  data = data + '00'

  // asset type
  data = data + '01'

  // asset recordtype
  data = data + '00'

  // asset amount
  const num1 = $assetAmount * 100000000
  const num1str = numStoreInMemory(num1.toString(16), 16)
  data = data + num1str

  // publickey
  let publicKeyXStr = curvePtX.toString('hex')
  let publicKeyYStr = curvePtY.toString('hex')

  data = data + '20' + publicKeyXStr + '20' + publicKeyYStr
  data = data + myProgramHash.toString()
  data = data + '000000'

  return data
}

// TODO: this is important
// Also, likely want some high level wrapper that combines TransferTransaction, addContract, and signatureData
export const addContract = ($txData, $sign, $publicKeyEncoded) => {
  let signatureScript = createSignatureScript($publicKeyEncoded)
  // console.log(signatureScript);
  // sign num
  let data = $txData + '01'
  // sign struct len
  data = data + '41'
  // sign data len
  data = data + '40'
  // sign data
  data = data + $sign
  // Contract data len
  data = data + '23'
  // script data
  data = data + signatureScript
  // console.log(data);
  return data
}

/**
 * Verifies if the string is a valid NEO address.
 * @param {string} address - A string that can be a NEO address.
 * @returns {bool} True if the string is a valid NEO address.
 */
export const verifyAddress = (address) => {
  let programHash = base58.decode(address)
  let programHexString = CryptoJS.enc.Hex.parse(ab2hexstring(programHash.slice(0, 21)))
  let programSha256 = CryptoJS.SHA256(programHexString)
  let programSha256Twice = CryptoJS.SHA256(programSha256)
  let programSha256Buffer = hexstring2ab(programSha256Twice.toString())

  // We use the checksum to verify the address
  if (ab2hexstring(programSha256Buffer.slice(0, 4)) !== ab2hexstring(programHash.slice(21, 25))) {
    return false
  }

  // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
  if (toAddress(programHash.slice(1, 21)) !== address) {
    // address is not valid Neo address, could be btc, ltc etc.
    return false
  }

  return true
}

/**
 * Verifies if the string is a valid public key.
 * @param {string} publicKeyEncoded - A string that is a possible public key in encoded form.
 * @returns {bool} True if the string is a valid encoded public key.
 */
export const verifyPublicKeyEncoded = (publicKeyEncoded) => {
  let publicKeyArray = hexstring2ab(publicKeyEncoded)
  if (publicKeyArray[0] !== 0x02 && publicKeyArray[0] !== 0x03) {
    return false
  }

  let ecparams = ecurve.getCurveByName('secp256r1')
  let curvePt = ecurve.Point.decodeFrom(ecparams, Buffer.from(publicKeyEncoded, 'hex'))
  // let curvePtX = curvePt.affineX.toBuffer(32)
  let curvePtY = curvePt.affineY.toBuffer(32)

  // console.log( "publicKeyArray", publicKeyArray )
  // console.log( "curvePtX", curvePtX )
  // console.log( "curvePtY", curvePtY )

  if (publicKeyArray[0] === 0x02 && curvePtY[31] % 2 === 0) {
    return true
  }

  if (publicKeyArray[0] === 0x03 && curvePtY[31] % 2 === 1) {
    return true
  }

  return false
}

// TODO: important, requires significant documentation
// all of these arguments should be documented and made clear, what $coin looks like etc.
// also, remove $ variable names, most likey

/**
 * Constructs a ContractTransaction based on the given params. A ContractTransaction is a basic transaction to send NEO/GAS.
 * @param {Coin[]} coins - A list of relevant assets available at the address which the public key is provided.
 * @param {string} publicKeyEncoded - The encoded public key of the address from which the assets are coming from.
 * @param {string} toAddress - The address which the assets are going to.
 * @param {number|string} amount - The amount of assets to send.
 * @returns {string} A serialised transaction ready to be signed with the corresponding private key of publicKeyEncoded.
 */
export const transferTransaction = (coins, publicKeyEncoded, toAddress, amount) => {
  let ProgramHash = base58.decode(toAddress)
  if (!verifyAddress(toAddress)) {
    throw new Error('Invalid toAddress')
  }

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
  // We can do this because this method assumes only one receipent.
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
    data.set(ProgramHash, inputLen + 44)
  } else {
    // output num
    data.set(hexstring2ab('02'), inputLen + 3)

    /// /////////////////////////////////////////////////////////////////
    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab(coins['assetid'])), inputLen + 4)
    // data.set(hexstring2ab($coin['assetid']), inputLen + 4);

    // output value
    const num1 = parseInt(amount * 100000000)
    const num1str = numStoreInMemory(num1.toString(16), 16)
    data.set(hexstring2ab(num1str), inputLen + 36)

    // output ProgramHash
    data.set(ProgramHash, inputLen + 44)

    /// /////////////////////////////////////////////////////////////////
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

    /// /////////////////////////////////////////////////////////////////

    // console.log( "Signature Data:", ab2hexstring(data) );
  }

  return ab2hexstring(data)
}

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
 * Constructs a valid address from a scriptHash
 * @param {string} scriptHash - scriptHash obtained from hashing the address
 * @returns A valid NEO address
 */
export const toAddress = (scriptHash) => {
  if (scriptHash.length !== 20) throw new Error('Invalid ScriptHash length')
  let data = new Uint8Array(1 + scriptHash.length)
  data.set([23]) // Wallet addressVersion
  data.set(scriptHash, 1)
  // console.log(ab2hexstring(data))

  let scriptHashHex = CryptoJS.enc.Hex.parse(ab2hexstring(data))
  let scriptHashSha = CryptoJS.SHA256(scriptHashHex)
  let scriptHashSha2 = CryptoJS.SHA256(scriptHashSha)
  let scriptHashShaBuffer = hexstring2ab(scriptHashSha2.toString())
  // console.log(ab2hexstring(ProgramSha256Buffer))

  let datas = new Uint8Array(1 + scriptHash.length + 4)
  datas.set(data)
  datas.set(scriptHashShaBuffer.slice(0, 4), 21)
  // console.log(ab2hexstring(datas))

  return base58.encode(datas)
}

export const generateRandomArray = ($arrayLen) => {
  return secureRandom($arrayLen)
}

export const generatePrivateKey = () => {
  return secureRandom(32)
}

/**
 * Get private key from WIF key.
 * @param {string} wif - WIF key
 * @return {string} Private key
 */
export const getPrivateKeyFromWIF = ($wif) => {
  let data = base58.decode($wif)

  if (data.length !== 38 || data[0] !== 0x80 || data[33] !== 0x01) {
    // basic encoding errors
    return -1
  }

  let dataHexString = CryptoJS.enc.Hex.parse(ab2hexstring(data.slice(0, data.length - 4)))
  let dataSha = CryptoJS.SHA256(dataHexString)
  let dataSha2 = CryptoJS.SHA256(dataSha)
  let dataShaBuffer = hexstring2ab(dataSha2.toString())

  if (ab2hexstring(dataShaBuffer.slice(0, 4)) !== ab2hexstring(data.slice(data.length - 4, data.length))) {
    // wif verify failed.
    return -2
  }

  return data.slice(1, 33).toString('hex')
}

/**
 * Get public key from private key.
 * @param {string} privateKey - Private Key.
 * @param {boolean} encode - If the returned public key should be encrypted. Defaults to true
 * @return {ArrayBuffer} ArrayBuffer containing the public key.
 */
export const getPublicKey = (privateKey, encode) => {
  let ecparams = ecurve.getCurveByName('secp256r1')
  let curvePt = ecparams.G.multiply(BigInteger.fromBuffer(hexstring2ab(privateKey)))
  return curvePt.getEncoded(encode)
}

/**
 * Encodes an unencoded public key.
 * @param {string} publicKey - Unencoded public key.
 * @return {string} Encoded public key.
 */
export const getPublicKeyEncoded = (publicKey) => {
  let publicKeyArray = hexstring2ab(publicKey)
  if (publicKeyArray[64] % 2 === 1) {
    return '03' + ab2hexstring(publicKeyArray.slice(1, 33))
  } else {
    return '02' + ab2hexstring(publicKeyArray.slice(1, 33))
  }
}

export const createSignatureScript = (publicKeyEncoded) => {
  return '21' + publicKeyEncoded.toString('hex') + 'ac'
}

/**
 * Get hash of string input
 * @param {string} signatureScript - String input
 * @returns {string} Hashed output
 */
export const getHash = (signatureScript) => {
  let ProgramHexString = CryptoJS.enc.Hex.parse(signatureScript)
  let ProgramSha256 = CryptoJS.SHA256(ProgramHexString)
  return CryptoJS.RIPEMD160(ProgramSha256)
}

/**
 * Signs a transaction with a private key
 * @param {string} data - Serialised transaction data.
 * @param {string} privateKey - Private Key
 * @returns {string} Signature data.
 */
export const signatureData = ($data, $privateKey) => {
  let msg = CryptoJS.enc.Hex.parse($data)
  let msgHash = CryptoJS.SHA256(msg)
  const msgHashHex = Buffer.from(msgHash.toString(), 'hex')
  // const privateKeyHex = Buffer.from($privateKey, 'hex')
  // console.log( "msgHash:", msgHashHex.toString('hex'));
  // console.log('buffer', privateKeyHex.toString('hex'));

  let elliptic = new EC('p256')
  const sig = elliptic.sign(msgHashHex, $privateKey, null)
  const signature = {
    signature: Buffer.concat([
      sig.r.toArrayLike(Buffer, 'be', 32),
      sig.s.toArrayLike(Buffer, 'be', 32)
    ])
  }
  return signature.signature.toString('hex')
}

/**
 * Get Account from Private Key
 * @param {string} privateKey - Private Key
 * @returns An Account object
 */
export const getAccountsFromPrivateKey = (privateKey) => {
  if (privateKey.length !== 64) {
    return -1
  }

  var publicKeyEncoded = getPublicKey(privateKey, true)
  // console.log( publicKeyEncoded )

  return getAccountsFromPublicKey(publicKeyEncoded, privateKey)
}

/**
 * Get Account from Public Key
 * @param {string} publicKeyEncoded - Public Key in encoded form
 * @param {string} privateKey - Private Key (optional)
 * @returns An Account object
 */
export const getAccountsFromPublicKey = (publicKeyEncoded, privateKey) => {
  if (!verifyPublicKeyEncoded(publicKeyEncoded)) {
    // verify failed.
    return -1
  }
  var publicKeyHash = getHash(publicKeyEncoded.toString('hex'))
  // console.log( publicKeyHash );

  var script = createSignatureScript(publicKeyEncoded)
  // console.log( script );

  var programHash = getHash(script)
  // console.log( programHash )

  var address = toAddress(hexstring2ab(programHash.toString()))
  // console.log( address );

  var accounts = []

  accounts[0] = {
    privatekey: privateKey,
    publickeyEncoded: publicKeyEncoded.toString('hex'),
    publickeyHash: publicKeyHash.toString(),
    programHash: programHash.toString(),
    address
  }

  return accounts
}

/**
 * Get Account from WIF
 * @param {string} WIFKey - WIF Key
 * @returns {Account|number} An Account object with {} or -1 for basic encoding errors, -2 for failed verification of WIF
 */
export const getAccountsFromWIFKey = ($WIFKey) => {
  let privateKey = getPrivateKeyFromWIF($WIFKey)
  if (privateKey === -1 || privateKey === -2) {
    return privateKey
  }
  return getAccountsFromPrivateKey(privateKey)
}
