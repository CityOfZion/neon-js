import { InteropServiceCode } from "./InteropServiceCode";

const fixedPrices = {
  [InteropServiceCode.SYSTEM_CONTRACT_CALL]: 32768,
  [InteropServiceCode.SYSTEM_CONTRACT_CALLNATIVE]: 0,
  [InteropServiceCode.SYSTEM_CONTRACT_GETCALLFLAGS]: 1024,
  [InteropServiceCode.SYSTEM_CONTRACT_NATIVEONPERSIST]: 0,
  [InteropServiceCode.SYSTEM_CONTRACT_NATIVEPOSTPERSIST]: 0,
  [InteropServiceCode.SYSTEM_CRYPTO_CHECKSIG]: 32768,
  [InteropServiceCode.SYSTEM_ITERATOR_NEXT]: 32768,
  [InteropServiceCode.SYSTEM_ITERATOR_VALUE]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_BURNGAS]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_CHECKWITNESS]: 1024,
  [InteropServiceCode.SYSTEM_RUNTIME_CURRENTSIGNERS]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GASLEFT]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETADDRESSVERSION]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETCALLINGSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETENTRYSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETEXECUTINGSCRIPTHASH]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETINVOCATIONCOUNTER]: 16,
  [InteropServiceCode.SYSTEM_RUNTIME_GETNETWORK]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETNOTIFICATIONS]: 4096,
  [InteropServiceCode.SYSTEM_RUNTIME_GETSCRIPTCONTAINER]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTIME]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_GETTRIGGER]: 8,
  [InteropServiceCode.SYSTEM_RUNTIME_LOADSCRIPT]: 32768,
  [InteropServiceCode.SYSTEM_RUNTIME_LOG]: 32768,
  [InteropServiceCode.SYSTEM_RUNTIME_NOTIFY]: 32768,
  [InteropServiceCode.SYSTEM_RUNTIME_PLATFORM]: 8,
  [InteropServiceCode.SYSTEM_STORAGE_ASREADONLY]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_DELETE]: 32768,
  [InteropServiceCode.SYSTEM_STORAGE_FIND]: 32768,
  [InteropServiceCode.SYSTEM_STORAGE_GET]: 32768,
  [InteropServiceCode.SYSTEM_STORAGE_GETCONTEXT]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_GETREADONLYCONTEXT]: 16,
  [InteropServiceCode.SYSTEM_STORAGE_PUT]: 32768,
};

type fixedPriceInteropServiceCode = keyof typeof fixedPrices;

function isFixedPrice(
  code: InteropServiceCode,
): code is fixedPriceInteropServiceCode {
  return code in fixedPrices;
}

export function getInteropServicePrice(service: InteropServiceCode): number {
  if (isFixedPrice(service)) {
    return fixedPrices[service as keyof typeof fixedPrices];
  }

  throw new Error(
    `InteropServiceCode ${service} not supported as it is dynamically priced.`,
  );
}
