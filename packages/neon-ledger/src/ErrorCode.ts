import { cloneDeep } from "lodash-es";

export enum StatusWord {
  OK = 0x9000,
  DENY = 0x6985,
  WRONG_P1P2 = 0x6a86,
  WRONG_DATA_LENGTH = 0x6a87,
  INS_NOT_SUPPORTED = 0x6d00,
  CLA_NOT_SUPPORTED = 0x6e00,
  APP_CLOSED = 0x6e01,
  WRONG_RESPONSE_LENGTH = 0xb000,
  WRONG_TX_LENGTH = 0xb001,
  TX_PARSING_FAIL = 0xb002,
  TX_USER_CONFIRMATION_FAIL = 0xb003,
  BAD_STATE = 0xb004,
  SIGN_FAIL = 0xb005,
  BIP44_BAD_PURPOSE = 0xb100,
  BIP44_BAD_COIN_TYPE = 0xb101,
  BIP44_ACCOUNT_NOT_HARDENED = 0xb102,
  BIP44_BAD_ACCOUNT = 0xb103,
  BIP44_BAD_CHANGE = 0xb104,
  BIP44_BAD_ADDRESS = 0xb105,
  MAGIC_PARSING_FAIL = 0xb106,
  DISPLAY_SYSTEM_FEE_FAIL = 0xb107,
  DISPLAY_NETWORK_FEE_FAIL = 0xb108,
  DISPLAY_TOTAL_FEE_FAIL = 0xb109,
  DISPLAY_TOKEN_TRANSFER_AMOUNT_FAIL = 0xb10a,
  CONVERT_TO_ADDRESS_FAIL = 0xb200,
}

export interface TransportStatusError extends Error {
  name: "TransportStatusError";
  message: string;
  statusCode: number;
  statusText: string;
}

export function looksLikeTransportStatusError(
  err: unknown
): err is TransportStatusError {
  return (err as TransportStatusError).statusCode != undefined;
}
/**
 * Evaluates Transport Error thrown and rewrite the error message to be more user friendly.
 * @returns error with modified message if found.
 */
export function evalTransportError(err: Error): Error {
  const transportErr = cloneDeep(err) as TransportStatusError;
  switch (transportErr.statusCode) {
    case StatusWord.APP_CLOSED:
      transportErr.message = "Your NEO app is closed! Please login.";
      break;
    case StatusWord.DENY:
      transportErr.message = "Action rejected by user";
      break;
    case StatusWord.WRONG_P1P2:
      transportErr.message = "Incorrect P1 or P2 in APDU";
      break;
    case StatusWord.TX_USER_CONFIRMATION_FAIL:
      transportErr.message = "Transaction signing denied";
      break;
    default:
      transportErr.message = `Unknown status 0x${transportErr.statusCode.toString(
        16
      )}`;
  }
  return err;
}

export default StatusWord;
