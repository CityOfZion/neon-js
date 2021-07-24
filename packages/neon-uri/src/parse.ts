import type { sc } from "@cityofzion/neon-core";

const INTENT_PREFIXES = ["pay", "vote"];

// We hardcode these so we can avoid a full dependency.
const NATIVE_TOKENS = {
  neo: "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
  gas: "d2a4cff31913016155e38e474a2c06d08be276cf",
};

/**
 * Results of parsing a NEO uri. Contains a displayable string describing the intent and a partial ContractCall object that requires more information to be used in a Transaction.
 */
export interface UriIntent {
  intent: "pay" | "vote";
  // Human-readable description of the intent.
  description: string;
  // Partial ContractCall that can be filled up further and used to create a script for Transaction.
  contractCall: sc.ContractCallJson;
}

/**
 * Parses an NEP9 URI string into a consumable intent object. This function does not check for runtime validity conditions (eg address or contract validity).
 * @param uri - case sensitive URI string.
 */
export function parse(uri: string): UriIntent {
  const [scheme, uriBody] = uri.split(":", 2);
  validateScheme(scheme);
  if (!uriBody) {
    throw new Error("URI did not contain anything after neo:");
  }

  const bodyParts = uriBody.split("?", 2);

  const { intent, targetIdentifier } = parsePath(bodyParts[0]);
  const params = reduceParamsToDict(bodyParts.length > 1 ? bodyParts[1] : "");

  switch (intent) {
    case "pay":
      return createPayIntent(targetIdentifier, params);
    case "vote":
      return createVoteIntent(targetIdentifier, params);
    default:
      throw new Error("Unreachable.");
  }
}

function validateScheme(scheme: string): void {
  if (scheme !== "neo") {
    throw new Error("URI provided did not start with neo");
  }
}

function parsePath(path: string): { intent: string; targetIdentifier: string } {
  const result = path.split("-", 2);
  if (result.length === 1) {
    // No intent found, default to "pay"
    return { intent: "pay", targetIdentifier: result[0] };
  }
  const parsedIntent = result[0].toLowerCase();
  if (INTENT_PREFIXES.includes(parsedIntent)) {
    return { intent: parsedIntent, targetIdentifier: result[1] };
  }

  throw new Error(`Intent ${parsedIntent} is not supported.`);
}

function reduceParamsToDict(params: string): Record<string, string> {
  const keyvalues = params ? params.split("&") : [];
  const baseDict: { [k: string]: string } = {};
  return keyvalues.reduce((obj, keyValuePair) => {
    const [key, val] = keyValuePair.split("=", 2);
    obj[key] = val;
    return obj;
  }, baseDict);
}

function createPayIntent(
  toAddress: string,
  queryParams: Record<string, string>
): UriIntent {
  if (!queryParams["asset"]) {
    throw new Error("Parse error: payment uri requires a 'asset' parameter. ");
  }
  const assetString = queryParams["asset"].toLowerCase();
  const scriptHash = parseAssetToScriptHash(assetString);
  const description = createPayDescription(
    assetString,
    toAddress,
    queryParams["amount"]
  );

  return {
    intent: "pay",
    description: description,
    contractCall: {
      scriptHash: scriptHash,
      operation: "transfer",
      args: [
        { type: "Hash160", value: "" },
        { type: "Hash160", value: toAddress },
        { type: "Integer", value: queryParams["amount"] ?? "" },
      ],
    },
  };
}

function createPayDescription(
  assetString: string,
  toAddress: string,
  amount?: string
): string {
  const tokenName =
    assetString === "neo" || assetString === "gas"
      ? assetString.toUpperCase()
      : `tokens(${assetString})`;

  return `Transfer ${amount ?? "some"} ${tokenName} to ${toAddress}`;
}

function parseAssetToScriptHash(assetString: string): string {
  if (assetString === "neo" || assetString === "gas") {
    return NATIVE_TOKENS[assetString];
  }
  if (assetString.length !== 40) {
    throw new Error(
      `Parse error:  ${assetString} does not look like a contract hash.`
    );
  }
  return assetString;
}

function createVoteIntent(
  publicKey: string,
  _queryParams: Record<string, string>
): UriIntent {
  return {
    intent: "vote",
    description: `Vote for ${publicKey}`,
    contractCall: {
      scriptHash: NATIVE_TOKENS.neo,
      operation: "vote",
      args: [
        { type: "Hash160", value: "" },
        { type: "PublicKey", value: publicKey },
      ],
    },
  };
}
