export declare function constructMultiSigVerificationScript(signingThreshold: number, keys: string[]): string;
/**
 * Returns the list of public keys found in the verification script.
 * @param verificationScript Verification Script of an Account.
 */
export declare function getPublicKeysFromVerificationScript(verificationScript: string): string[];
/**
 * Returns the number of signatures required for signing for a verification Script.
 * @param verificationScript Verification Script of a multi-sig Account.
 */
export declare function getSigningThresholdFromVerificationScript(verificationScript: string): number;
/**
 * Extract signatures from invocationScript
 * @param invocationScript InvocationScript of a Witness.
 */
export declare function getSignaturesFromInvocationScript(invocationScript: string): string[];
