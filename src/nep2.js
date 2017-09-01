// this code draws heavily from functions written originally by snowypowers

import bs58check from 'bs58check';
import wif from 'wif';
import { SHA256, AES, enc } from 'crypto-js'
import C from 'crypto-js'
import scrypt from 'js-scrypt'
import { getAccountsFromWIFKey, getAccountsFromPrivateKey, generatePrivateKey, getWIFFromPrivateKey } from './wallet';
import { ab2hexstring, hexXor } from './utils';

const NEP_HEADER = "0142"
const NEP_FLAG = "e0"

// specified by nep2, same as bip38
const scrypt_options = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
};

// encrypts a given wif given passphrase,
// retuns account object...
export const encryptWifAccount = (wif, passphrase) => {
  return encrypt_wif(wif, passphrase).then((encWif) => {
    const loadAccount = getAccountsFromWIFKey(wif);
    return {
      wif: wif,
      address: loadAccount[0].address,
      encryptedWif: encWif,
      passphrase: passphrase
    };
  });
};

// generate new encrypted wif given passphrase
// (returns a promise)
export const generateEncryptedWif = (passphrase) => {
  const newPrivateKey = generatePrivateKey();
  const newWif = getWIFFromPrivateKey(newPrivateKey);
  return encrypt_wif(newWif, passphrase).then((encWif) => {
    const loadAccount = getAccountsFromWIFKey(newWif);
    return {
      wif: newWif,
      address: loadAccount[0].address,
      encryptedWif: encWif,
      passphrase: passphrase
    };
  });
};

// encrypt wif using keyphrase under nep2 standard
// returns encrypted wif
const encrypt = (wifKey, keyphrase, progressCallback) => {
    const address = getAccountsFromWIFKey(wifKey)[0].address
    const privateKey = getAccountsFromWIFKey(wifKey)[0].privatekey
    // SHA Salt (use the first 4 bytes)
    const addressHash = SHA256(SHA256(enc.Latin1.parse(address))).toString().slice(0, 8)
    // Scrypt
    const derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), scrypt_options, progressCallback).toString('hex')
    const derived1 = derived.slice(0, 64)
    const derived2 = derived.slice(64)
    //AES Encrypt
    const xor = hexXor(privateKey, derived1)
    const encrypted = AES.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding })
    //Construct
    const assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString()
    return bs58check.encode(Buffer.from(assembled, 'hex'))
};

// decrypt encrypted wif using keyphrase under nep2 standard
// returns wif
const decrypt = (encryptedKey, keyphrase, progressCallback) => {
    const assembled = ab2hexstring(bs58check.decode(encryptedKey))
    const addressHash = assembled.substr(6, 8)
    const encrypted = assembled.substr(-64)
    const derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), scrypt_options, progressCallback).toString('hex')
    const derived1 = derived.slice(0, 64)
    const derived2 = derived.slice(64)
    const ciphertext = { ciphertext: enc.Hex.parse(encrypted), salt: "" }
    const decrypted = AES.decrypt(ciphertext, enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding })
    const privateKey = hexXor(decrypted.toString(), derived1)
    const address = getAccountsFromPrivateKey(privateKey)[0].address
    const newAddressHash = SHA256(SHA256(enc.Latin1.parse(address))).toString().slice(0, 8)
    if (addressHash !== newAddressHash) throw new Error("Wrong Password!")
    return getWIFFromPrivateKey(Buffer.from(privateKey, 'hex'));
};

// helpers to wrap synchronous functions in promises

export const encrypt_wif = (wif, passphrase) => {
  return (new Promise((success, reject) => {
    success(encrypt(wif, passphrase));
  }));
};

export const decrypt_wif = (encrypted_wif, passphrase) => {
  return (new Promise((success, reject) => {
    success(decrypt(encrypted_wif, passphrase));
  }));
};
