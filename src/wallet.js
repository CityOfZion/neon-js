import ecurve from 'ecurve';
import BigInteger from 'bigi';
import { ec } from 'elliptic';
import CryptoJS from 'crypto-js';
import WIF from 'wif';
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
import { ab2str,
  str2ab,
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory,
  stringToBytes } from './utils';

const base58 = require('base-x')(BASE58);
import secureRandom from 'secure-random';
import buffer from 'buffer';


// All of this stuff was wrapped in a class before, but really unnecessary as none of these were stateful
// This flat structure should be more interpretable, and we can export them all as a module instead

// TODO: exporting ALL of these, but some of them are probably helpers and don't need to be exported
// TODO: go through and add at least a basic description of everything these methods are doing

export const getWIFFromPrivateKey = (privateKey) => WIF.encode(128, new Buffer(ab2hexstring(privateKey), 'hex'), true);

export const getTxHash = ($data) => {
  return CryptoJS.SHA256(
    CryptoJS.SHA256(
      CryptoJS.enc.Hex.parse($data)
    )
  ).toString();
};

// TODO: this needs a lot of documentation, also better name!
export const getInputData = ($coin, $amount) => {
  // sort
  var coinOrdered = $coin.list;
  for (let i = 0; i < coinOrdered.length - 1; i++) {
    for (let j = 0; j < coinOrdered.length - 1 - i; j++) {
      if (parseFloat(coinOrdered[j].value) < parseFloat(coinOrdered[j + 1].value)) {
        var temp = coinOrdered[j];
        coinOrdered[j] = coinOrdered[j + 1];
        coinOrdered[j + 1] = temp;
      }
    }
  }

  // calc sum
  const sum = coinOrdered.reduce((sum, coin) => sum + parseFloat(coin.value), 0);

  // if sum < amount then exit;
  let amount = parseFloat($amount);
  if (sum < amount) return -1;

  // find input coins
  let k = 0;
  while (parseFloat(coinOrdered[k].value) <= amount) {
    amount = amount - parseFloat(coinOrdered[k].value);
    if (amount == 0) break;
    k = k + 1;
  }

  /////////////////////////////////////////////////////////////////////////
  // coin[0]- coin[k]
  let data = new Uint8Array(1 + 34 * (k + 1));

  // input num
  data.set(
    hexstring2ab(
      numStoreInMemory((k + 1).toString(16), 2)
    )
  );

  // input coins
  for (let x = 0; x < k + 1; x++) {

    // txid
    data.set(
      reverseArray(hexstring2ab(coinOrdered[x].txid)),
      1 + (x * 34)
    );
    //data.set(hexstring2ab(coinOrdered[x]['txid']), pos);

    // index
    //inputIndex = numStoreInMemory(coinOrdered[x]['n'].toString(16), 2);
    data.set(
      hexstring2ab(
        numStoreInMemory(coinOrdered[x].index.toString(16), 4)
      ),
      1 + (x * 34) + 32
    );
  }

  /////////////////////////////////////////////////////////////////////////

  // calc coin_amount
  let coinAmount = 0;
  for (let i = 0; i < k + 1; i++) {
    coinAmount += parseFloat(coinOrdered[i].value);
  }

  /////////////////////////////////////////////////////////////////////////

  return {
    amount: coinAmount,
    data
  }
};

// TODO: We many not need to keep this function in the API
// for now, leaving as reference
export const issueTransaction = ($issueAssetID, $issueAmount, $publicKeyEncoded) => {
  const issueAmount = numStoreInMemory(($issueAmount * 100000000 ).toString(16), 16),
        signedHash = getHash(
          createSignatureScript($publicKeyEncoded)
        ).toString();
  return `0100000001${$issueAssetID}${issueAmount}${signedHash}`;
};

// TODO: we probably don't need to keep this function in the API, people aren't going to be using the wallet to register new assets
// for now, leaving as reference
export const registerTransaction = ($assetName, $assetAmount, $publicKeyEncoded) => {
  const curvePt = ecurve.Point.decodeFrom(ecurve.getCurveByName('secp256r1'), new Buffer($publicKeyEncoded, 'hex')),
        curvePtX = curvePt.affineX.toBuffer(32),
        curvePtY = curvePt.affineY.toBuffer(32),
        assetName = ab2hexstring(stringToBytes($assetName)),
        assetNameLen = (assetName.length / 2).toString(),
        lengthPrefix = assetNameLen === 1 ? '0' : '';

  let data = `4000${lengthPrefix}${assetNameLen}${assetName}000100`;

  // asset amount
  data += numStoreInMemory(
    ($assetAmount * 100000000).toString(16),
    16
  );

  data += `20${curvePtX.toString('hex')}20${curvePtY.toString('hex')}`;
  data += getHash(createSignatureScript($publicKeyEncoded)).toString();
  data += '000000';

  return data;
};

// TODO: this is important
// Also, likely want some high level wrapper that combines TransferTransaction, addContract, and signatureData
export const addContract = ( $txData, $sign, $publicKeyEncoded ) => {
  const signatureScript = createSignatureScript($publicKeyEncoded);
  return `${$txData}014140${$sign}23${signatureScript}`
};

// verify that an ANS address is valid
export const verifyAddress = ( $toAddress ) => {
  const programHash = base58.decode($toAddress),
        programSHA256Buffer = hexstring2ab(
          CryptoJS.SHA256(
            CryptoJS.SHA256(
              CryptoJS.enc.Hex.parse(
                ab2hexstring(programHash.slice(0, 21))
              )
            )
          ).toString()
        );

  if (ab2hexstring(programSHA256Buffer.slice(0, 4)) != ab2hexstring(programHash.slice(21, 25))) {
    //address verify failed.
    return false;
  }

  if (toAddress(programHash.slice(1, 21)) !== $toAddress) {
    //address is not valid Neo address, could be btc, ltc etc.
    return false;
  }

  return true;
}

// verify that public key is valid
export const verifyPublicKeyEncoded = ( $publicKeyEncoded ) => {
  const publicKeyArray = hexstring2ab($publicKeyEncoded);
  if ( publicKeyArray[0] != 0x02 && publicKeyArray[0] != 0x03 ) {
    return false;
  }

  const curvePt = ecurve.Point.decodeFrom(ecurve.getCurveByName('secp256r1'), new Buffer($publicKeyEncoded, 'hex')),
        curvePtX = curvePt.affineX.toBuffer(32),
        curvePtY = curvePt.affineY.toBuffer(32);

  return (publicKeyArray[0] == 0x02 && curvePtY[31] % 2 == 0) ||
           (publicKeyArray[0] == 0x03 && curvePtY[31] % 2 == 1);
};

// TODO: important, requires significant documentation
// all of these arguments should be documented and made clear, what $coin looks like etc.
// also, remove $ variable names, most likey
export const transferTransaction = ($coin, $publicKeyEncoded, $toAddress, $Amount) => {
  let programHash = base58.decode($toAddress);

  if (ab2hexstring(
        hexstring2ab(
          CryptoJS.SHA256(
            CryptoJS.SHA256(
              CryptoJS.enc.Hex.parse(
                ab2hexstring(programHash.slice(0, 21))
              )
            )
          ).toString()).slice(0, 4)
      ) != ab2hexstring(programHash.slice(21, 25))) {
    //address verify failed.
    return -1;
  }

  programHash = programHash.slice(1, 21);

  if(toAddress(programHash) !== $toAddress) {
    throw 'Not a valid Neo address!';
  }

  // INPUT CONSTRUCT
  const inputData = getInputData($coin, $Amount);
  if (inputData == -1) return null;

  const { length: inputLen } = inputData.data,
        { amount: inputAmount } = inputData;

  // console.log(inputLen, inputAmount, $Amount);
  // Set SignableData Len
  let signableDataLen = 124 + inputLen;
  if (inputAmount == $Amount) {
    signableDataLen = 64 + inputLen;
  }

  // CONSTRUCT
  const data = new Uint8Array(signableDataLen);

  // type
  data.set(hexstring2ab('80'), 0);

  // version
  data.set(hexstring2ab('00'), 1);

  // Attributes
  data.set(hexstring2ab('00'), 2);

  // INPUT
  data.set(inputData.data, 3);

  // OUTPUT
  if (inputAmount == $Amount) {
    // only one output

    // output num
    data.set(hexstring2ab('01'), inputLen + 3);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab($coin.assetid)), inputLen + 4);

    // output value
    data.set(
      hexstring2ab(
        numStoreInMemory(
          parseInt($Amount * 100000000).toString(16),
          16
        )
      ),
      inputLen + 36
    );

    // output programHash
    data.set(programHash, inputLen + 44);

    ////////////////////////////////////////////////////////////////////

  } else {

    // output num
    data.set(hexstring2ab('02'), inputLen + 3);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab($coin.assetid)), inputLen + 4);
    //data.set(hexstring2ab($coin['assetid']), inputLen + 4);

    // output value
    const num1 = parseInt($Amount * 100000000);
    data.set(
      hexstring2ab(
        numStoreInMemory(num1.toString(16), 16)
      ),
      inputLen + 36
    );

    // output programHash
    data.set(programHash, inputLen + 44);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 1

    // output asset
    data.set(reverseArray(hexstring2ab($coin['assetid'])), inputLen+64);
    //data.set(hexstring2ab($coin['assetid']), inputLen + 64);

    // output value
    data.set(hexstring2ab(numStoreInMemory(parseInt(inputAmount * 100000000 - num1).toString(16), 16)), inputLen + 96);

    // output programHash
    data.set(hexstring2ab(getHash(createSignatureScript($publicKeyEncoded)).toString()), inputLen + 104);

    ////////////////////////////////////////////////////////////////////

    //console.log( 'Signature Data:', ab2hexstring(data) );
  }

  return ab2hexstring(data);
};

export const claimTransaction = (claims, publicKeyEncoded, toAddress, amount) => {
  // Type = ClaimTransaction
  let data = '0200';

  data += numStoreInMemory(claims.length.toString(16), 2);

  // 2) iterate over claim txids
  for (let k = 0; k < claims.length; k++) {
    // get the txid
    let { txid } = claims[k];
    // add txid to data
    data += ab2hexstring(reverseArray(hexstring2ab(txid)));
    data += numStoreInMemory(claims[k].index.toString(16), 4);
  }

  data += '000001';

  // First add assetId for GAS
  data += ab2hexstring(reverseArray(hexstring2ab('602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7')))

  // Net add total amount of the claim
  data += numStoreInMemory(amount.toString(16), 16);

  // Finally add program hash
  data += getHash(createSignatureScript(publicKeyEncoded)).toString();

  return data;
};

export const toAddress = ($programHash) => {
  const data = new Uint8Array(1 + $programHash.length);
  data.set([23]);
  data.set($programHash, 1);


  const datas = new Uint8Array(1 + $programHash.length + 4);
  datas.set(data);
  datas.set(
    hexstring2ab(
      CryptoJS.SHA256(
        CryptoJS.SHA256(
          CryptoJS.enc.Hex.parse(ab2hexstring(data))
        )
      ).toString()
    ).slice(0, 4),
    21
  );

  return base58.encode(datas);
};

export const generateRandomArray = ($arrayLen) => secureRandom($arrayLen);
export const generatePrivateKey = () => secureRandom(32);

export const getPrivateKeyFromWIF = ($wif) => {
  const data = base58.decode($wif);

  if (data.length != 38 || data[0] != 0x80 || data[33] != 0x01) {
    // basic encoding errors
    return -1;
  }

  if (ab2hexstring(
        hexstring2ab(
          CryptoJS.SHA256(
            CryptoJS.SHA256(
              CryptoJS.enc.Hex.parse(
                ab2hexstring(data.slice(0, data.length - 4))
              )
            )
          ).toString()
        ).slice(0, 4)
      ) != ab2hexstring(data.slice(data.length - 4, data.length))) {
    //wif verify failed.
    return -2;
  }

  return data.slice(1, 33).toString('hex');
};

export const getPublicKey = ($privateKey, $encode) => ecurve.getCurveByName('secp256r1').G.multiply(
  BigInteger.fromBuffer(
    hexstring2ab($privateKey)
  )
).getEncoded($encode);

export const getPublicKeyEncoded = ($publicKey) => {
  const publicKeyArray = hexstring2ab($publicKey),
        prefix = publicKeyArray[64] % 2 == 1 ? '03' : '02' ;
  return `${prefix}${ab2hexstring(publicKeyArray.slice(1, 33))}`;
};

export const createSignatureScript = ($publicKeyEncoded) => `21${$publicKeyEncoded.toString('hex')}ac`;

export const getHash = ($SignatureScript) => CryptoJS.RIPEMD160(
  CryptoJS.SHA256(
    CryptoJS.enc.Hex.parse($SignatureScript)
  )
);

export const signatureData = ($data, $privateKey) => {
  const elliptic = new ec('p256'),
        privateKeyHex = new Buffer($privateKey, 'hex'),
        sig = elliptic.sign(
          new Buffer(CryptoJS.SHA256(CryptoJS.enc.Hex.parse($data)).toString(), 'hex'),
          $privateKey,
          null
        ),
        signature = {
          signature: Buffer.concat([
            sig.r.toArrayLike(Buffer, 'be', 32),
            sig.s.toArrayLike(Buffer, 'be', 32)
          ])
        };
  return signature.signature.toString('hex');
};

export const fetchAccountsFromPublicKeyEncoded = ($publicKeyEncoded) => {
  if ( !verifyPublicKeyEncoded($publicKeyEncoded) ) {
    // verify failed.
    return -1
  }

  const programHash = getHash(
    createSignatureScript($publicKeyEncoded)
  ).toString();

  return [{
    programHash,
    privatekey: '',
    publickeyEncoded: $publicKeyEncoded,
    publickeyHash: getHash($publicKeyEncoded).toString(),
    address: toAddress(hexstring2ab(programHash)),
  }];
};

// TODO: why does this wrap return info in a list? seems unnecessary
// ditto for all the other GetAccounts methods
export const getAccountsFromPrivateKey = ($privateKey) => {
  if ($privateKey.length != 64) {
    return -1;
  }

  return getAccountsFromPublicKey(getPublicKey($privateKey, true), $privateKey);
}
export const getAccountsFromPublicKey = (publicKeyEncoded, privatekey) => {
  const programHash = getHash(createSignatureScript(publicKeyEncoded)).toString()

  return [{
    privatekey,
    programHash,
    address: toAddress(hexstring2ab(programHash)),
    publickeyEncoded: publicKeyEncoded.toString('hex'),
    publickeyHash: getHash(publicKeyEncoded.toString('hex')).toString()
  }];
};

// lookup account data (publicKey, privateKey, address, etc. from WIF)
// returns -1 for basic encoding errors
// returns -2 for WIF verify fail
export const getAccountsFromWIFKey = ($WIFKey) => {
  const privateKey = getPrivateKeyFromWIF($WIFKey);
  if (privateKey == -1 || privateKey == -2) {
    return privateKey;
  }

  return getAccountsFromPrivateKey(privateKey);
};
