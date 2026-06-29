import { rpc, tx, u, wallet } from "@cityofzion/neon-core";

import { DapiError, DapiErrorCode } from "./DapiError.js";
import type {
  ApplicationLog,
  Argument,
  AuthenticationChallengePayload,
  AuthenticationResponsePayload,
  Base64Encoded,
  Block,
  ContractParametersContext,
  ContractParameterType,
  Integer,
  InvocationArguments,
  InvocationResult,
  Signer,
  SignedMessage,
  SignOptions,
  Token,
  Transaction,
  TransactionAttribute,
  TransactionOptions,
  TriggerType,
  UInt160,
  UInt256,
  VMState,
  Account,
} from "./types.js";
import {
  buildSendInvokeParams,
  calculateFee,
  getAttributes,
  getNetworkFee,
  getScriptBuilder,
  getSystemFee,
  getValidUntilBlock,
  getWitnesses,
  transformTransaction,
} from "./utils.js";
import type { DapiNetwork } from "./constants.js";

type DapiOperationsConfig = {
  rpcClient: string | rpc.RPCClient;
  network: DapiNetwork;
  account: string | wallet.Account;
};

/**
 * Helper class that implements the blockchain and cryptographic operations required by `DapiProvider`.
 *
 * This class is not a `DapiProvider` itself — it exists to reduce boilerplate in concrete provider
 * implementations by handling the heavy lifting: RPC calls, transaction building, signing, and fee
 * calculation.
 *
 * Not all `DapiProvider` methods are covered here. Methods that require direct wallet UI interaction
 * (e.g. `pickAddress`) are intentionally omitted because they depend on the
 * specific wallet environment and cannot be generalized.
 */
export class DapiOperations {
  rpcClient: rpc.RPCClient;
  account: wallet.Account;
  network: DapiNetwork;

  constructor({ rpcClient, network, account }: DapiOperationsConfig) {
    this.rpcClient =
      rpcClient instanceof rpc.RPCClient
        ? rpcClient
        : new rpc.RPCClient(rpcClient);

    this.account =
      account instanceof wallet.Account ? account : new wallet.Account(account);

    this.network = network;
  }

  /**
   * Requests authentication. Usually used to log in to a website.
   * The authentication process is described in detail in NEP-20.
   * @param payload - The authentication challenge payload issued by the dApp.
   * @returns A signed authentication response payload.
   * @throws DapiError - UNSUPPORTED | INVALID | TIMEOUT | CANCELED
   */
  async authenticate(
    payload: AuthenticationChallengePayload,
  ): Promise<AuthenticationResponsePayload> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);

      if (!payload.networks.length) {
        throw new DapiError(DapiErrorCode.INVALID, "Networks is empty");
      }

      if (!payload.networks.includes(this.network)) {
        throw new DapiError(DapiErrorCode.INVALID, "Network is not supported");
      }

      const networkHex = u.num2hexstring(this.network, 4, true);
      const nonceHex = u.num2hexstring(Number(payload.nonce), 8, true);
      const timestampHex = u.num2hexstring(timestamp, 4, true);
      const hashHex = this.account.scriptHash.replace(/^0x/i, "");
      const actionHex = u.str2hexstring(payload.action);
      const domainHex = u.str2hexstring(payload.domain);

      const hash =
        networkHex + nonceHex + timestampHex + hashHex + actionHex + domainHex;

      const signature = wallet.sign(hash, this.account.privateKey);

      return {
        address: this.account.address,
        algorithm: "ECDSA-P256",
        network: this.network,
        pubkey: this.account.publicKey,
        nonce: payload.nonce,
        timestamp,
        signature: u.hex2base64(signature),
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Returns the current connected account in the wallet.
   * @returns Array containing the connected account.
   */
  getAccounts(): Account[] {
    return [
      {
        address: this.account.address,
        hash: this.account.scriptHash,
        contract: this.account.contract as Account["contract"],
        extra: null,
        label: this.account.label,
      },
    ];
  }

  /**
   * Gets the balance of the specified account for the given asset.
   * The account can be in the wallet or an arbitrary address.
   * @param asset - The script hash of the NEP-17 token contract.
   * @param account - The script hash of the account to query.
   * @returns The token balance as an integer string.
   * @throws DapiError - INVALID | NOTFOUND | FAILED | RPC_ERROR
   */
  async getBalance(asset: UInt160, account: UInt160): Promise<Integer> {
    try {
      const scriptBuilder = getScriptBuilder([
        {
          operation: "balanceOf",
          hash: asset,
          args: [{ type: "Hash160", value: account }],
        },
      ]);

      const result = await this.rpcClient.invokeScript(
        u.HexString.fromHex(scriptBuilder.build()),
        [{ account, scopes: "CalledByEntry" }],
      );

      if (result.state !== "HALT") {
        throw new DapiError(
          DapiErrorCode.FAILED,
          result.exception || "Transaction state is not HALT",
        );
      }

      const stack = result.stack[0];

      if (stack?.type !== "Integer" || typeof stack.value !== "string") {
        throw new DapiError(DapiErrorCode.INVALID, "Invalid stack type");
      }

      return stack.value;
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets the application log of the specified transaction.
   * @param txid - The transaction hash.
   * @returns The application log containing all executions and notifications.
   * @throws DapiError - INVALID | RPC_ERROR
   */
  async getApplicationLog(txid: UInt256): Promise<ApplicationLog> {
    try {
      const applicationLog = await this.rpcClient.getApplicationLog(txid);
      return {
        txid: applicationLog.txid,
        executions: applicationLog.executions.map((execution) => ({
          trigger: execution.trigger as TriggerType,
          vmstate: execution.vmstate as VMState,
          gasconsumed: execution.gasconsumed,
          stack: execution.stack ?? [],
          notifications: execution.notifications,
          exception: execution.exception,
        })),
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets the block by its hash.
   * @param hash - The block hash.
   * @returns The block data including all transactions.
   * @throws DapiError - INVALID | NOTFOUND | RPC_ERROR
   */
  getBlock(hash: UInt256): Promise<Block>;
  /**
   * Gets the block by its index.
   * @param index - The block index (height).
   * @returns The block data including all transactions.
   * @throws DapiError - INVALID | NOTFOUND | RPC_ERROR
   */
  getBlock(index: number): Promise<Block>;
  async getBlock(hashOrIndex: UInt256 | number): Promise<Block> {
    try {
      const block = await this.rpcClient.getBlock(hashOrIndex, 1);

      const transactions = block.tx.map((transaction) =>
        transformTransaction({
          ...transaction,
          blockhash: block.hash,
          blocktime: block.time,
          confirmations: block.confirmations,
        }),
      );

      return {
        hash: block.hash,
        size: block.size,
        confirmations: block.confirmations,
        nextBlockHash: block.nextblockhash,
        version: block.version,
        previousBlockHash: block.previousblockhash,
        merkleRoot: block.merkleroot,
        time: block.time,
        nonce: block.nonce,
        index: block.index,
        primary: block.primary,
        nextConsensus: block.nextconsensus,
        tx: transactions,
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets the total number of blocks in the blockchain.
   * @returns The current block count.
   * @throws DapiError - RPC_ERROR
   */
  async getBlockCount(): Promise<number> {
    try {
      return await this.rpcClient.getBlockCount();
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets a storage entry from a contract.
   * @param hash - The script hash of the contract.
   * @param key - The storage key encoded as base64.
   * @returns The storage value encoded as base64.
   * @throws DapiError - INVALID | NOTFOUND | RPC_ERROR
   */
  async getStorage(hash: UInt160, key: Base64Encoded): Promise<Base64Encoded> {
    try {
      return await this.rpcClient.getStorage(hash, u.base642hex(key));
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets symbol, decimals, and total supply of a NEP-17 token.
   * @param assetId - The script hash of the token contract.
   * @returns Token metadata including symbol, decimals, and total supply.
   * @throws DapiError - INVALID | NOTFOUND | FAILED | RPC_ERROR
   */
  async getTokenInfo(assetId: UInt160): Promise<Token> {
    try {
      const decimalsScriptBuilder = getScriptBuilder([
        { hash: assetId, operation: "decimals" },
      ]);
      const symbolScriptBuilder = getScriptBuilder([
        { hash: assetId, operation: "symbol" },
      ]);
      const totalSupplyScriptBuilder = getScriptBuilder([
        { hash: assetId, operation: "totalSupply" },
      ]);

      const [decimalsResult, symbolResult, totalSupplyResult] =
        await this.rpcClient.executeAll<
          [rpc.InvokeResult, rpc.InvokeResult, rpc.InvokeResult]
        >([
          rpc.Query.invokeScript(
            u.HexString.fromHex(decimalsScriptBuilder.build()),
            [],
          ),
          rpc.Query.invokeScript(
            u.HexString.fromHex(symbolScriptBuilder.build()),
            [],
          ),
          rpc.Query.invokeScript(
            u.HexString.fromHex(totalSupplyScriptBuilder.build()),
            [],
          ),
        ]);

      if (
        decimalsResult.state !== "HALT" ||
        symbolResult.state !== "HALT" ||
        totalSupplyResult.state !== "HALT"
      ) {
        throw new DapiError(
          DapiErrorCode.FAILED,
          "Transaction state is not HALT",
        );
      }

      const decimalsStack = decimalsResult.stack[0];
      const symbolStack = symbolResult.stack[0];
      const totalSupplyStack = totalSupplyResult.stack[0];

      if (
        decimalsStack?.type !== "Integer" ||
        typeof decimalsStack.value !== "string"
      ) {
        throw new DapiError(
          DapiErrorCode.INVALID,
          "Invalid decimals stack type",
        );
      }

      if (
        symbolStack?.type !== "ByteString" ||
        typeof symbolStack.value !== "string"
      ) {
        throw new DapiError(DapiErrorCode.INVALID, "Invalid symbol stack type");
      }

      if (
        totalSupplyStack?.type !== "Integer" ||
        typeof totalSupplyStack.value !== "string"
      ) {
        throw new DapiError(
          DapiErrorCode.INVALID,
          "Invalid totalSupply stack type",
        );
      }

      return {
        decimals: Number(decimalsStack.value),
        symbol: u.HexString.fromBase64(symbolStack.value).toAscii(),
        totalSupply: totalSupplyStack.value,
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Gets the transaction by its hash.
   * @param txid - The transaction hash.
   * @returns The transaction data.
   * @throws DapiError - INVALID | NOTFOUND | RPC_ERROR
   */
  async getTransaction(txid: UInt256): Promise<Transaction> {
    try {
      const transaction = await this.rpcClient.getRawTransaction(txid, 1);
      return transformTransaction(transaction);
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Calls a contract off-chain and returns the execution result without broadcasting a transaction.
   * @param invocation - The contract invocation arguments.
   * @returns The result of the script execution.
   * @throws DapiError - INVALID | RPC_ERROR
   */
  async call(invocation: InvocationArguments): Promise<InvocationResult> {
    try {
      const scriptBuilder = getScriptBuilder([invocation]);

      const result = await this.rpcClient.invokeScript(
        u.HexString.fromHex(scriptBuilder.build()),
        [
          new tx.Signer({
            account: this.account.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          }),
        ],
      );

      return {
        gasconsumed: result.gasconsumed,
        script: result.script,
        stack: result.stack,
        state: result.state,
        exception: result.exception || undefined,
        notifications: result.notifications,
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Calls one or more contracts on-chain and broadcasts the transaction.
   * @param invocations - One or more contract invocations to execute in the transaction.
   * @param signers - Optional list of signers for the transaction.
   * @param attributes - Optional transaction attributes.
   * @param options - Optional fee and validity overrides.
   * @returns The hash of the broadcasted transaction.
   * @throws DapiError - INVALID | FAILED | TIMEOUT | CANCELED | RPC_ERROR
   */
  async invoke(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions,
  ): Promise<UInt256> {
    try {
      const transaction = new tx.Transaction();

      const scriptBuilder = getScriptBuilder(invocations);

      transaction.script = u.HexString.fromHex(scriptBuilder.build());

      transaction.validUntilBlock = await getValidUntilBlock(
        this.rpcClient,
        options,
      );

      transaction.signers =
        signers?.map((signer) => new tx.Signer(signer)) || [];

      transaction.witnesses = getWitnesses(this.account, signers || []);

      transaction.attributes = getAttributes(attributes);

      transaction.systemFee = await getSystemFee(
        this.rpcClient,
        scriptBuilder,
        transaction.signers,
        options,
      );

      transaction.networkFee = await getNetworkFee(this.rpcClient, transaction);

      const version = await this.rpcClient.getVersion();

      transaction.sign(this.account, version.protocol.network);

      return await this.rpcClient.sendRawTransaction(transaction);
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Calculates the total fee (system + network) for an invoke transaction without broadcasting it.
   * @param invocations - One or more contract invocations.
   * @param signers - Optional list of signers for the transaction.
   * @param attributes - Optional transaction attributes.
   * @param options - Optional fee and validity overrides.
   * @returns The total fee in GAS as a decimal number.
   * @throws DapiError - INVALID | RPC_ERROR
   */
  async calculateInvokeFee(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions,
  ): Promise<number> {
    try {
      return await calculateFee(
        this.account,
        this.rpcClient,
        invocations,
        signers,
        attributes,
        options,
      );
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Builds a transaction for one or more contract invocations without broadcasting it.
   * Returns a `ContractParametersContext` that can be passed to `sign` and then `relay`.
   * @param invocations - One or more contract invocations.
   * @param signers - Optional list of signers for the transaction.
   * @param attributes - Optional transaction attributes.
   * @param options - Optional fee and validity overrides.
   * @returns An unsigned contract parameters context ready for signing.
   * @throws DapiError - INVALID | FAILED | TIMEOUT | CANCELED | RPC_ERROR
   */
  async makeTransaction(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions,
  ): Promise<ContractParametersContext> {
    try {
      const transaction = new tx.Transaction();

      const scriptBuilder = getScriptBuilder(invocations);

      transaction.script = u.HexString.fromHex(scriptBuilder.build());

      transaction.validUntilBlock = await getValidUntilBlock(
        this.rpcClient,
        options,
      );

      transaction.signers =
        signers?.map((signer) => new tx.Signer(signer)) || [];

      transaction.attributes = getAttributes(attributes);

      transaction.systemFee = await getSystemFee(
        this.rpcClient,
        scriptBuilder,
        transaction.signers,
        options,
      );

      transaction.networkFee = await getNetworkFee(this.rpcClient, transaction);

      const version = await this.rpcClient.getVersion();

      const items = transaction.signers.reduce(
        (acc, signer) => {
          const account = signer.account.toBigEndian();

          acc[account] = {
            script: "",
            parameters: [],
            signatures: {},
          };

          return acc;
        },
        {} as ContractParametersContext["items"],
      );

      return {
        type: "Neo.Network.P2P.Payloads.Transaction",
        hash: `0x${transaction.hash()}`,
        network: version.protocol.network,
        data: u.hex2base64(transaction.serialize(false)),
        items,
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Broadcasts a signed transaction to the network.
   * @param context - A fully signed contract parameters context.
   * @returns The hash of the broadcasted transaction.
   * @throws DapiError - INVALID | TIMEOUT | CANCELED | INSUFFICIENT_FUNDS | RPC_ERROR
   */
  async relay(context: ContractParametersContext): Promise<UInt256> {
    try {
      return await this.rpcClient.sendRawTransaction(context.data);
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Transfers a NEP-17 asset and broadcasts the transaction.
   * @param asset - The script hash of the NEP-17 token contract.
   * @param from - The script hash of the sender account (must be the connected account).
   * @param to - The script hash of the recipient account.
   * @param amount - The amount to transfer as an integer string.
   * @param data - Optional extra data forwarded to the token's `transfer` method.
   * @returns The hash of the broadcasted transaction.
   * @throws DapiError - INVALID | NOTFOUND | FAILED | TIMEOUT | CANCELED | INSUFFICIENT_FUNDS | RPC_ERROR
   */
  async send(
    asset: UInt160,
    from: UInt160,
    to: UInt160,
    amount: Integer,
    data?: Argument,
  ): Promise<UInt256> {
    try {
      const { invocations, signers } = buildSendInvokeParams(
        this.account,
        asset,
        from,
        to,
        amount,
        data,
      );
      return await this.invoke(invocations, signers);
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Calculates the total fee (system + network) for a NEP-17 transfer without broadcasting it.
   * @param asset - The script hash of the NEP-17 token contract.
   * @param from - The script hash of the sender account.
   * @param to - The script hash of the recipient account.
   * @param amount - The amount to transfer as an integer string.
   * @param data - Optional extra data forwarded to the token's `transfer` method.
   * @returns The total fee in GAS as a decimal number.
   * @throws DapiError - INVALID | RPC_ERROR
   */
  async calculateSendFee(
    asset: UInt160,
    from: UInt160,
    to: UInt160,
    amount: Integer,
    data?: Argument,
  ): Promise<number> {
    try {
      const { invocations, signers } = buildSendInvokeParams(
        this.account,
        asset,
        from,
        to,
        amount,
        data,
      );
      return await this.calculateInvokeFee(invocations, signers);
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Signs a transaction with the connected account.
   * For multi-signature transactions, call this once per participating account and
   * pass the updated context to the next signer until the threshold is met.
   * @param context - The contract parameters context containing the unsigned transaction.
   * @returns An updated context with the signature appended. If the signing threshold is
   *          reached for a multi-sig account, the witness is also added.
   * @throws DapiError - UNSUPPORTED | INVALID | NOTFOUND | TIMEOUT | CANCELED
   */
  async sign(
    context: ContractParametersContext,
  ): Promise<ContractParametersContext> {
    try {
      const transaction = tx.Transaction.deserialize(
        u.base642hex(context.data),
      );

      let scriptHash: string | undefined;
      let verificationScript: string | undefined;
      let signatures: Record<string, string> | undefined;
      let verificationScriptPublicKeys: string[] | undefined;
      let parameters: Argument[] | undefined;

      for (const [contextItemScriptHash, contextItem] of Object.entries(
        context.items,
      )) {
        // If already exists a verification script, we need to verify if the connected account is part of the verification script
        // For multisig accounts, the dApp should provide the script in the first sign attempt, since the account's contract script is the verification script of the multisig account and it is not possible to determine the verification script from the scriptHash
        // It does not means it is necessarily a multisig account, it could be a transaction with two signers and the second sign call will have the verification script in the context since the first call already added the verification script
        if (contextItem.script.length > 0) {
          const contextItemVerificationScript = u.base642hex(
            contextItem.script,
          );
          const publicKeys = wallet.getPublicKeysFromVerificationScript(
            contextItemVerificationScript,
          );
          if (publicKeys.includes(this.account.publicKey)) {
            scriptHash = contextItemScriptHash;
            verificationScript = contextItemVerificationScript;
            signatures = contextItem.signatures;
            verificationScriptPublicKeys = publicKeys;
            parameters = contextItem.parameters;

            break;
          }
        }

        if (contextItemScriptHash === this.account.scriptHash) {
          scriptHash = contextItemScriptHash;
          verificationScript = wallet.getVerificationScriptFromPublicKey(
            this.account.publicKey,
          );
          signatures = contextItem.signatures;
          verificationScriptPublicKeys = [this.account.publicKey];
          parameters = this.account.contract.parameters.map((parameter) => ({
            type: parameter.type as ContractParameterType,
            value: undefined,
          }));

          break;
        }
      }

      if (
        !scriptHash ||
        !verificationScript ||
        !signatures ||
        !verificationScriptPublicKeys ||
        !parameters
      ) {
        throw new DapiError(
          DapiErrorCode.INVALID,
          "Connected account is not part of the transaction",
        );
      }

      const signMessage = transaction.getMessageForSigning(context.network);
      const signature = wallet.sign(signMessage, this.account.privateKey);
      const base64Signature = u.hex2base64(signature);
      const updatedSignatures = {
        ...signatures,
        [this.account.publicKey]: base64Signature,
      };

      const updatedParameters = parameters.filter(
        (parameter) => parameter.type !== "Signature",
      );
      verificationScriptPublicKeys.forEach((publicKey) => {
        updatedParameters.push({
          type: "Signature",
          value: updatedSignatures[publicKey],
        });
      });

      const isMultiSig = verificationScriptPublicKeys.length > 1;
      if (isMultiSig) {
        const publicKeysSignatures = verificationScriptPublicKeys
          .map((publicKey) => updatedSignatures[publicKey])
          .filter((sig) => sig !== undefined)
          .map((sig) => u.base642hex(sig));
        const threshold =
          wallet.getSigningThresholdFromVerificationScript(verificationScript);

        if (threshold === publicKeysSignatures.length) {
          transaction.addWitness(
            tx.Witness.buildMultiSig(
              signMessage,
              publicKeysSignatures,
              verificationScript,
            ),
          );
        }
      } else {
        transaction.addWitness(
          tx.Witness.fromSignature(signature, this.account.publicKey),
        );
      }

      return {
        type: "Neo.Network.P2P.Payloads.Transaction",
        hash: `0x${transaction.hash()}`,
        network: context.network,
        data: u.hex2base64(transaction.serialize(true)),
        items: {
          ...context.items,
          [scriptHash]: {
            script: u.hex2base64(verificationScript),
            parameters: updatedParameters,
            signatures: updatedSignatures,
          },
        },
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }

  /**
   * Signs a message with the connected account using ECDSA-P256.
   * @param message - The message to sign. Treated as a UTF-8 string unless `options.isBase64Encoded` is true.
   * @param account - Optional script hash to verify the connected account matches before signing.
   * @param options - Encoding and signature options.
   * @returns The signed message with payload, signature, account, and public key.
   * @throws DapiError - INVALID | NOTFOUND | TIMEOUT | CANCELED
   */
  async signMessage(
    message: string | Base64Encoded,
    account?: UInt160,
    options?: SignOptions,
  ): Promise<SignedMessage> {
    try {
      if (options?.isTypedData) {
        throw new DapiError(
          DapiErrorCode.INVALID,
          "Typed data is not supported yet",
        );
      }

      if (account && this.account.scriptHash !== account) {
        throw new DapiError(DapiErrorCode.INVALID, "Account does not match");
      }

      let hexMessage: string;
      if (options?.isBase64Encoded) {
        hexMessage = u.base642hex(message);
      } else {
        hexMessage = u.str2hexstring(message);
      }

      const signature = wallet.sign(hexMessage, this.account.privateKey);

      return {
        payload: u.hex2base64(hexMessage),
        signature: u.hex2base64(signature),
        account: this.account.scriptHash,
        pubkey: this.account.publicKey,
      };
    } catch (error) {
      throw DapiError.parseError(error);
    }
  }
}
