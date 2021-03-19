import { InteropServiceCode } from "./InteropServiceCode";

export interface InteropServicePriceParam {
  size: number;
  method: string;
}

const GAS_PER_BYTE = 100000e-8;
const fixedPrices = {
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETBLOCK]: 65536,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETHEIGHT]: 16,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTION]: 32768,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTIONFROMBLOCK]: 32768,
  [InteropServiceCode.SYSTEM_BLOCKCHAIN_GETTRANSACTIONHEIGHT]: 32768,
  [InteropServiceCode.NEO_CRYPTO_CHECKSIG]: 32768,
  [InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG]: 0,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATE]: 16,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATEFROMMETHOD]: 32768,
  [InteropServiceCode.SYSTEM_CALLBACK_CREATEFROMSYSCALL]: 16,
  [InteropServiceCode.SYSTEM_CALLBACK_INVOKE]: 32768,
  [InteropServiceCode.SYSTEM_CONTRACT_CALL]: 32768,
  [InteropServiceCode.SYSTEM_CONTRACT_CALLEX]: 32768,
  [InteropServiceCode.SYSTEM_CONTRACT_CALLNATIVE]: 32768,
  [InteropServiceCode.SYSTEM_CONTRACT_CREATESTANDARDACCOUNT]: 256,
  [InteropServiceCode.SYSTEM_CONTRACT_CREATEMULTISIGACCOUNT]: 256,
  [InteropServiceCode.SYSTEM_CONTRACT_GETCALLFLAGS]: 1024,
  [InteropServiceCode.SYSTEM_CONTRACT_ISSTANDARD]: 1024,
  [InteropServiceCode.SYSTEM_CONTRACT_NATIVEONPERSIST]: 0,
  [InteropServiceCode.SYSTEM_CONTRACT_NATIVEPOSTPERSIST]: 0,
  [InteropServiceCode.SYSTEM_ENUMERATOR_CONCAT]: 16,
  [InteropServiceCode.SYSTEM_ENUMERATOR_CREATE]: 16,
  [InteropServiceCode.SYSTEM_ENUMERATOR_NEXT]: 32768,
  [InteropServiceCode.SYSTEM_ENUMERATOR_VALUE]: 16,
  [InteropServiceCode.SYSTEM_ITERATOR_CONCAT]: 16,
  [InteropServiceCode.SYSTEM_ITERATOR_CREATE]: 16,
  [InteropServiceCode.SYSTEM_ITERATOR_KEY]: 16,
  [InteropServiceCode.SYSTEM_ITERATOR_KEYS]: 16,
  [InteropServiceCode.SYSTEM_ITERATOR_VALUES]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_CHECKWITNESS]: 1024,
  [InteropServiceCode.SYSTEM_RUNTIME_GASLEFT]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETCALLINGSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETENTRYSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETEXECUTINGSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETINVOCATIONCOUNTER]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETNOTIFICATIONS]: 256,
  [InteropServiceCode.SYSTEM_RUNTIME_GETSCRIPTCONTAINER]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTIME]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTRIGGER]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_LOG]: 32768,
  [InteropServiceCode.SYSTEM_RUNTIME_NOTIFY]: 32768,
  [InteropServiceCode.SYSTEM_RUNTIME_PLATFORM]: 8,
  [InteropServiceCode.SYSTEM_STORAGE_ASREADONLY]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_DELETE]: 0,
  [InteropServiceCode.SYSTEM_STORAGE_FIND]: 32768,
  [InteropServiceCode.SYSTEM_STORAGE_GET]: 32768,
  [InteropServiceCode.SYSTEM_STORAGE_GETCONTEXT]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_GETREADONLYCONTEXT]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_PUT]: 0,
};

function getStoragePrice(size: number): number {
  return size * GAS_PER_BYTE;
}

function getCheckMultiSigPrice(size: number): number {
  return size * fixedPrices[InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG];
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
    case InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG:
      return getCheckMultiSigPrice(param.size);
    case InteropServiceCode.SYSTEM_STORAGE_PUT:
    case InteropServiceCode.SYSTEM_STORAGE_DELETE:
      return getStoragePrice(param.size);
    case InteropServiceCode.SYSTEM_CONTRACT_NATIVEONPERSIST:
    case InteropServiceCode.SYSTEM_CONTRACT_NATIVEPOSTPERSIST:
      return param.size * GAS_PER_BYTE;
    default:
      throw new Error(`InteropServiceCode ${service} not supported`);
  }
}
