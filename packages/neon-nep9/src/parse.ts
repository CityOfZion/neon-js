import { tx, wallet } from "../../neon-core/src/";
import { extractAmount, extractAsset, extractAttributes } from "./extract";

/**
 * Intent as expressed by an NEP9 URI string
 */
export interface NEP9Intent {
  address: string;
  attributes: tx.TransactionAttributeLike[];
  asset?: string;
  amount?: number;
}

/**
 * Parses an NEP9 URI string into a consumable intent object. This function does not check for runtime validity conditions (eg address or contract validity).
 * @param uri Case sensitive URI string.
 */
export function parse(uri: string) {
  const [scheme, uriBody] = uri.split(":", 2);
  validateScheme(scheme);
  if (!uriBody) {
    throw new Error("URI did not contain anything after neo:");
  }

  const [path, queryParams] = uriBody.split("?", 2);
  validatePath(path);

  const params = reduceParamsToDict(queryParams);

  const intent = {
    address: path
  } as NEP9Intent;

  intent.asset = extractAsset(params);
  intent.amount = extractAmount(params);
  intent.attributes = extractAttributes(params);
  return intent;
}

function validateScheme(scheme: string) {
  if (scheme !== "neo") {
    throw new Error("URI provided did not start with neo");
  }
}

function validatePath(path: string) {
  if (!path || !wallet.isAddress(path)) {
    throw new Error(`Invalid NEO address provided: ${path}`);
  }
}

function reduceParamsToDict(params: string): { [k: string]: string } {
  const keyvalues = params ? params.split("&") : [];
  return keyvalues.reduce(
    (obj, keyValuePair) => {
      const [key, val] = keyValuePair.split("=", 2);
      obj[key] = val;
      return obj;
    },
    {} as { [k: string]: string }
  );
}

export default parse;
