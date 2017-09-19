// this code draws heavily from functions written originally by snowypowers

import bs58check from 'bs58check';
import wif from 'wif';
import { SHA256, AES, enc } from 'crypto-js';
import C from 'crypto-js';
import scrypt from 'js-scrypt';
import { getAccountsFromWIFKey, getAccountsFromPrivateKey, generatePrivateKey, getWIFFromPrivateKey } from './wallet';
import { ab2hexstring, hexXor } from './utils';

const NEP_HEADER = '0142',
      NEP_FLAG = 'e0';

// specified by nep2, same as bip38
const SCRYPT_OPTIONS = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
};

// encrypts a given wif given passphrase,
// retuns account object...
export const encryptWifAccount = (wif, passphrase) => {
  return encryptWIF(wif, passphrase).then((encryptedWif) => {
    return {
      wif,
      encryptedWif,
      passphrase,
      address: getAccountsFromWIFKey(wif)[0].address
    };
  });
};

// generate new encrypted wif given passphrase
// (returns a promise)
export const generateEncryptedWif = (passphrase) => {
  const wif = getWIFFromPrivateKey(generatePrivateKey());
  return encryptWIF(wif, passphrase).then(
    (encryptedWif) => ({
      wif,
      encryptedWif,
      passphrase,
      address: getAccountsFromWIFKey(wif)[0].address
    })
  )
};

// encrypt wif using keyphrase under nep2 standard
// returns encrypted wif
const encrypt = (wifKey, keyphrase, progressCallback) => {
    const { address, privatekey: privateKey } = getAccountsFromWIFKey(wifKey)[0],
    // SHA Salt (use the first 4 bytes)
          addressHash = SHA256(SHA256(enc.Latin1.parse(address))).toString().slice(0, 8),
    // Scrypt
          derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), SCRYPT_OPTIONS, progressCallback).toString('hex'),
          derived1 = derived.slice(0, 64),
          derived2 = derived.slice(64),
    //AES Encrypt
          xor = hexXor(privateKey, derived1),
          encrypted = AES.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding }),
    //Construct
          assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString();
    return bs58check.encode(Buffer.from(assembled, 'hex'));
};

// decrypt encrypted wif using keyphrase under nep2 standard
// returns wif
const decrypt = (encryptedKey, keyphrase, progressCallback) => {
    const assembled = ab2hexstring(bs58check.decode(encryptedKey)),
          addressHash = assembled.substr(6, 8),
          encrypted = assembled.substr(-64),
          derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), SCRYPT_OPTIONS, progressCallback).toString('hex'),
          derived1 = derived.slice(0, 64),
          derived2 = derived.slice(64),
          ciphertext = { ciphertext: enc.Hex.parse(encrypted), salt: '' },
          decrypted = AES.decrypt(ciphertext, enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding }),
          privateKey = hexXor(decrypted.toString(), derived1),
          { address } = getAccountsFromPrivateKey(privateKey)[0],
          newAddressHash = SHA256(SHA256(enc.Latin1.parse(address))).toString().slice(0, 8);
    if (addressHash !== newAddressHash) throw new Error('Wrong Password!');
    return getWIFFromPrivateKey(Buffer.from(privateKey, 'hex'));
};

// helpers to wrap synchronous functions in promises

export const encryptWIF = (wif, passphrase) => (
  new Promise(
    (success, reject) => success(encrypt(wif, passphrase))
  )
);
export const encrypt_wif = encryptWIF;

export const decryptWIF = (encryptedWIF, passphrase) => (
  new Promise(
    (success, reject) => success(decrypt(encryptedWIF, passphrase))
  )
);
export const decrypt_wif = decryptWIF;
