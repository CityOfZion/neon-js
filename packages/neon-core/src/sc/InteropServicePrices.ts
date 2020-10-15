import { InteropServiceCode } from "./InteropServiceCode";

export interface InteropServicePriceParam {
  size: number;
  method: string;
}

const GAS_PER_BYTE = 100000e-8;
const fixedPrices = {
  [InteropServiceCode.NEO_CRYPTO_RIPEMD160]: 1000000e-8,
  [InteropServiceCode.NEO_CRYPTO_SHA256]: 1000000e-8,
  [InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256K1]: 1000000e-8,
  [InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1]: 1000000e-8,
  [InteropServiceCode.NEO_NATIVE_CALL]: 0e-8,
  [InteropServiceCode.NEO_NATIVE_DEPLOY]: 0e-8,
  [InteropServiceCode.SYSTEM_BINARY_BASE58DECODE]: 100000e-8,
  [InteropServiceCode.SYSTEM_BINARY_BASE58ENCODE]: 100000e-8,
  [InteropServiceCode.SYSTEM_BINARY_BASE64DECODE]: 100000e-8,
  [InteropServiceCode.SYSTEM_BINARY_BASE64ENCODE]: 100000e-8,
  [InteropServiceCode.SYSTEM_BINARY_DESERIALIZE]: 500000e-8,
  [InteropServiceCode.SYSTEM_BINARY_SERIALIZE]: 100000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETBLOCK]: 2500000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETCONTRACT]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETHEIGHT]: 400e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTION]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTIONFROMBLOCK]: 1000000e-8,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTIONHEIGHT]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATE]: 400e-8,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATEFROMMETHOD]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATEFROMSYSCALL]: 400e-8,
  [InteropServiceCode.SYSTEM_CALLBACK_INVOKE]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_CALL]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_CALLEX]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_CREATESTANDARDACCOUNT]: 10000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_DESTROY]: 1000000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_GETCALLFLAGS]: 30000e-8,
  [InteropServiceCode.SYSTEM_CONTRACT_ISSTANDARD]: 30000e-8,
  [InteropServiceCode.SYSTEM_ENUMERATOR_CONCAT]: 400e-8,
  [InteropServiceCode.SYSTEM_ENUMERATOR_CREATE]: 400e-8,
  [InteropServiceCode.SYSTEM_ENUMERATOR_NEXT]: 1000000e-8,
  [InteropServiceCode.SYSTEM_ENUMERATOR_VALUE]: 400e-8,
  [InteropServiceCode.SYSTEM_ITERATOR_CONCAT]: 400e-8,
  [InteropServiceCode.SYSTEM_ITERATOR_CREATE]: 400e-8,
  [InteropServiceCode.SYSTEM_ITERATOR_KEY]: 400e-8,
  [InteropServiceCode.SYSTEM_ITERATOR_KEYS]: 400e-8,
  [InteropServiceCode.SYSTEM_ITERATOR_VALUES]: 400e-8,
  [InteropServiceCode.SYSTEM_JSON_DESERIALIZE]: 500000e-8,
  [InteropServiceCode.SYSTEM_JSON_SERIALIZE]: 100000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_CHECKWITNESS]: 30000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GASLEFT]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETCALLINGSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETENTRYSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETEXECUTINGSCRIPTHASH]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETINVOCATIONCOUNTER]: 400e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETNOTIFICATIONS]: 10000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETSCRIPTCONTAINER]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTIME]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTRIGGER]: 250e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_LOG]: 1000000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_NOTIFY]: 1000000e-8,
  [InteropServiceCode.SYSTEM_RUNTIME_PLATFORM]: 250e-8,
  [InteropServiceCode.SYSTEM_STORAGE_ASREADONLY]: 400e-8,
  [InteropServiceCode.SYSTEM_STORAGE_FIND]: 1000000e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GET]: 1000000e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GETCONTEXT]: 400e-8,
  [InteropServiceCode.SYSTEM_STORAGE_GETREADONLYCONTEXT]: 400e-8,
};

function getStoragePrice(size: number): number {
  return size * GAS_PER_BYTE;
}

function getCheckMultiSigPrice(size: number): number {
  return (
    size * fixedPrices[InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1]
  );
}

type fixedPriceInteropServiceCode = keyof typeof fixedPrices;

function isFixedPrice(
  code: InteropServiceCode
): code is fixedPriceInteropServiceCode {
  return code in fixedPrices;
}

export function getInteropServicePrice(
  service: InteropServiceCode,
  param?: Partial<InteropServicePriceParam>
): number {
  if (isFixedPrice(service)) {
    return fixedPrices[service as keyof typeof fixedPrices];
  }
  if (!param || !param.size) {
    throw new Error(
      `size param is necessary for InteropServiceCode ${service}`
    );
  }
  switch (service) {
    case InteropServiceCode.NEO_CRYPTO_CHECKMULTISIGWITHECDSASECP256R1:
    case InteropServiceCode.NEO_CRYPTO_CHECKMULTISIGWITHECDSASECP256K1:
      return getCheckMultiSigPrice(param.size);
    case InteropServiceCode.SYSTEM_STORAGE_PUT:
    case InteropServiceCode.SYSTEM_STORAGE_PUTEX:
    case InteropServiceCode.SYSTEM_STORAGE_DELETE:
      return getStoragePrice(param.size);
    case InteropServiceCode.SYSTEM_CONTRACT_UPDATE:
    case InteropServiceCode.SYSTEM_CONTRACT_CREATE:
      return param.size * GAS_PER_BYTE;
  }
}
