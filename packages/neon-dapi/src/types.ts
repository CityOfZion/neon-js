/* eslint-disable @typescript-eslint/no-explicit-any */

// Represents a piece of data encoded as a base64 string.
export type Base64Encoded = string;

// Represents a N3 address.
// Example: "NSiVJYZej4XsxG5CUpdwn7VRQk8iiiDMPM"
export type Address = string;

// A 160-bit hash represented by a hexadecimal string.
// Example: "0x682cca3ebdc66210e5847d7f8115846586079d4a"
export type UInt160 = string;

// A 256-bit hash represented by a hexadecimal string.
// Example: "0x1f4d1defa46faa5e7b9b8d3f79a06bec777d7c26c4aa5f6f5899a291daa87c15"
export type UInt256 = string;

// Represents an ECC public key.
// Example: "03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c"
export type ECPoint = string;

// A large integer of any length expressed as a string or number.
// It is used to represent values that may exceed the safe integer limit of JavaScript.
export type Integer = number | string;

// Represents a piece of data encoded as a hexadecimal string.
export type HexString = string;

// Represents a version.
// Example: "1.0.0"
export type Version = string;

// Represents the N3 network.
// MAINNET: 860833102
// TESTNET: 894710606
export type Network = number;

// Represents the name of the event in IDapiProvider.
export type EventName =
  | "accountchanged" // Triggered when the user has changed the connected account in the wallet.
  | "networkchanged"; // Triggered when the user switches the current network.

// Represents the type of Parameter. See NEP-14 for more details.
export type ContractParameterType =
  | "Any" // Indicates that the parameter can be of any type.
  | "Boolean" // Indicates that the parameter is of Boolean type.
  | "Integer" // Indicates that the parameter is an integer.
  | "ByteArray" // Indicates that the parameter is a byte array.
  | "String" // Indicates that the parameter is a string.
  | "Hash160" // Indicates that the parameter is a 160-bit hash.
  | "Hash256" // Indicates that the parameter is a 256-bit hash.
  | "PublicKey" // Indicates that the parameter is a public key.
  | "Signature" // Indicates that the parameter is a signature.
  | "Array" // Indicates that the parameter is an array.
  | "Map" // Indicates that the parameter is a map.
  | "InteropInterface" // Indicates that the parameter is an interoperable interface.
  | "Void"; // It can be only used as the return type of a method, meaning that the method has no return value.

// Represents a parameter of a contract method.
export type Parameter = {
  name?: string; // The name of the parameter.
  type: ContractParameterType; // The type of the parameter.
};

// Represents an account in a wallet.
export type Account = {
  hash: UInt160; // The script hash of the account.
  address: Address; // The address of the account.
  label?: string; // The label of the account.
  contract?: {
    // The contract of the account.
    script?: Base64Encoded; // The verification script of the contract.
    parameters: Parameter[]; // The parameters of the verification script.
    deployed: boolean; // Indicates whether the contract is deployed on the blockchain.
  };
  extra?: any; // Additional data for the account.
};

// Represents the scope of a witness.
export type WitnessScope =
  | "None" // Indicates that no contract was witnessed. Only sign the transaction.
  | "CalledByEntry" // Indicates that the calling contract must be the entry contract.
  | "CustomContracts" // Custom hash for contract-specific.
  | "CustomGroups" // Custom pubkey for group members.
  | "WitnessRules" // Indicates that the current context must satisfy the specified rules.
  | "Global" // This allows the witness in all contexts (default Neo2 behavior).
  | "CalledByEntry, CustomContracts"
  | "CalledByEntry, CustomGroups"
  | "CalledByEntry, WitnessRules"
  | "CustomContracts, CustomGroups"
  | "CustomContracts, WitnessRules"
  | "CustomGroups, WitnessRules"
  | "CalledByEntry, CustomContracts, CustomGroups"
  | "CalledByEntry, CustomContracts, WitnessRules"
  | "CalledByEntry, CustomGroups, WitnessRules"
  | "CustomContracts, CustomGroups, WitnessRules"
  | "CalledByEntry, CustomContracts, CustomGroups, WitnessRules";

export interface BooleanCondition {
  type: "Boolean";
  expression: boolean;
}

export interface NotCondition {
  type: "Not";
  expression: WitnessCondition;
}

export interface AndCondition {
  type: "And";
  expressions: WitnessCondition[];
}

export interface OrCondition {
  type: "Or";
  expressions: WitnessCondition[];
}

export interface ScriptHashCondition {
  type: "ScriptHash";
  hash: UInt160;
}

export interface GroupCondition {
  type: "Group";
  group: ECPoint;
}

export interface CalledByEntryCondition {
  type: "CalledByEntry";
}

export interface CalledByContractCondition {
  type: "CalledByContract";
  hash: UInt160;
}

export interface CalledByGroupCondition {
  type: "CalledByGroup";
  group: ECPoint;
}

// Represents the condition of a WitnessRule.
export type WitnessCondition =
  | BooleanCondition
  | NotCondition
  | AndCondition
  | OrCondition
  | ScriptHashCondition
  | GroupCondition
  | CalledByEntryCondition
  | CalledByContractCondition
  | CalledByGroupCondition;

// Represents the type of WitnessCondition.
export type WitnessConditionType = WitnessCondition["type"];

export type WitnessRule = {
  action: "Deny" | "Allow";
  condition: WitnessCondition;
};

export type Signer = {
  account: UInt160;
  scopes: WitnessScope;
  allowedContracts?: UInt160[];
  allowedGroups?: ECPoint[];
  rules?: WitnessRule[];
};

export type HighPriorityAttribute = {
  type: "HighPriority";
};

export type OracleResponseCode =
  | "Success"
  | "ProtocolNotSupported"
  | "ConsensusUnreachable"
  | "NotFound"
  | "Timeout"
  | "Forbidden"
  | "ResponseTooLarge"
  | "InsufficientFunds"
  | "ContentTypeNotSupported"
  | "Error";

export type OracleResponseAttribute = {
  type: "OracleResponse";
  id: number;
  code: OracleResponseCode;
  result?: Base64Encoded;
};

export type TransactionAttribute =
  | HighPriorityAttribute
  | OracleResponseAttribute;

export type TransactionAttributeType = TransactionAttribute["type"];

export type Transaction = {
  hash: UInt256;
  size: number;
  blockHash: UInt256;
  blockTime: number;
  confirmations: number;
  version: number;
  nonce: number;
  systemFee: Integer;
  networkFee: Integer;
  validUntilBlock: number;
  sender: UInt160;
  signers: Signer[];
  attributes: TransactionAttribute[];
  script: Base64Encoded;
};

export type Block = {
  hash: UInt256;
  size: number;
  confirmations: number;
  nextBlockHash?: UInt256;
  version: number;
  previousBlockHash: UInt256;
  merkleRoot: UInt256;
  time: number;
  nonce: HexString;
  index: number;
  primary: number;
  nextConsensus: UInt160;
  tx: Transaction[];
};

export type TriggerType =
  | "OnPersist"
  | "PostPersist"
  | "Verification"
  | "Application";

export type VMState = "NONE" | "HALT" | "FAULT" | "BREAK";

export type StackItemType =
  | "Any"
  | "Pointer"
  | "Boolean"
  | "Integer"
  | "ByteString"
  | "Buffer"
  | "Array"
  | "Struct"
  | "Map"
  | "InteropInterface";

export type StackItem = {
  type: StackItemType;
  value?: any;
};

export type Notification = {
  contract: UInt160; // The script hash of the contract that triggered the event.
  eventname: string; // The name of the event.
  state: StackItem; // The data of the event.
};

export type ApplicationLog = {
  txid: UInt256;
  executions: {
    trigger: TriggerType;
    vmstate: VMState;
    exception?: string;
    gasconsumed: Integer;
    stack: StackItem[];
    notifications: Notification[];
  }[];
};

export type Token = {
  symbol: string;
  decimals: number;
  totalSupply: Integer;
};

// Represents an argument for a contract call.
export type Argument = {
  type: ContractParameterType; // The type of the argument.
  value?: any; // The value of the argument. It can be omitted if the type is "Any".
};

// Provides the necessary arguments for a contract call.
export type InvocationArguments = {
  hash: UInt160; // The hash of the contract to be called.
  operation: string; // The operation of the contract to be called.
  args?: Argument[]; // The arguments for the call.
  abortOnFail?: boolean; // Indicates whether the entire transaction should fail when the contract returns `false`.
};

// Represents the result of a contract call.
export type InvocationResult = {
  script: Base64Encoded; // The script that was executed.
  state: VMState; // The final state of the VM after execution.
  gasconsumed: Integer; // The amount of gas consumed during the execution.
  exception?: string; // The exception message if the execution failed.
  notifications: Notification[]; // The notifications triggered during the execution.
  stack: StackItem[]; // The return value of the execution.
};

export type TransactionOptions = {
  suggestedSystemFee?: Integer; // The suggested system fee for the transaction. If provided, the wallet will not automatically calculate the system fee, but will use this value instead. `extraSystemFee` will be ignored if `suggestedSystemFee` is provided.
  extraSystemFee?: Integer; // The extra system fee that the user wants to pay for the transaction. The wallet will automatically calculate the system fee and add this value to it.
  validUntilBlock?: number; // The block until which the transaction is valid. If not provided, the wallet will use a default value.
};

export type ContractParametersContext = {
  type: "Neo.Network.P2P.Payloads.Transaction";
  hash: UInt256;
  data: Base64Encoded;
  items: Record<
    UInt160,
    {
      script: Base64Encoded;
      parameters: Argument[];
      signatures: Record<ECPoint, Base64Encoded>;
    }
  >;
  network: Network;
};

export type SignOptions = {
  isBase64Encoded?: boolean; // Indicates whether the message is a base64 encoded string. The default value is `false`.
  isTypedData?: boolean; // Indicates whether the message is a typed data. This value can only be set to `false` at the moment, but it is reserved for future use.
  isLedgerCompatible?: boolean; // Indicates whether the signature should be compatible with Ledger devices. The default value is `false`. If set to `true`, the message will be wrapped in a transaction-like structure before signing.
};

export type SignedMessage = {
  payload: Base64Encoded; // The base64 encoded payload of the message that was signed.
  signature: Base64Encoded; // The signature of the message.
  account: UInt160; // The account used to sign the message.
  pubkey: ECPoint; // The public key of the account used to sign the message.
};

export type AuthenticationChallengePayload = {
  action: "Authentication";
  grant_type: "Signature";
  allowed_algorithms: ["ECDSA-P256"];
  domain: string;
  networks: Network[];
  nonce: string;
  timestamp: number;
};

export type AuthenticationResponsePayload = {
  algorithm: "ECDSA-P256";
  network: Network;
  pubkey: ECPoint;
  address: Address;
  nonce: string;
  timestamp: number;
  signature: Base64Encoded;
};

export interface DapiProvider {
  // Properties

  // The name of the provider.
  name: string;

  // The version of the provider.
  version: Version;

  // The version of the dAPI. It must currently be "1.0".
  dapiVersion: Version;

  // Indicates the standards supported by this provider.
  // It should include "NEP-21" if the provider supports this standard.
  // Example: ["NEP-11", "NEP-17", "NEP-21"]
  compatibility: string[];

  // Indicates whether the user has connected their wallet to the dApp.
  connected: boolean;

  // Indicates the network currently in use.
  network: Network;

  // Indicates the networks supported by this provider.
  supportedNetworks: Network[];

  // The icon of the provider, represented as a URL.
  // Should be a square image with a size of at least 128x128 pixels for better display quality.
  // The scheme of the URL should be either "https" or "data".
  icon: string;

  // The website of the provider.
  website: string;

  // Additional data for the provider.
  extra: any;

  // Events

  // Adds an event handler for the specified event.
  on(event: EventName, listener: (e: CustomEvent) => void): void;

  // Removes an event handler for the specified event.
  removeListener(event: EventName, listener: (e: CustomEvent) => void): void;

  // Methods

  // Requests for authentication. Usually used to log in to a website.
  // The authentication process is described in detail in NEP-20.
  // Possible errors: UNSUPPORTED, INVALID, TIMEOUT, CANCELED.
  authenticate(
    payload: AuthenticationChallengePayload,
  ): Promise<AuthenticationResponsePayload>;

  // Gets the current connected account in the wallet.
  getAccounts(): Promise<Account[]>;

  // Prompts the user to select an account from the wallet and returns the selected address.
  // This method is usually used when the dApp needs to access an account that is different from the currently connected one.
  // Possible errors: CANCELED.
  pickAddress(prompt?: string): Promise<Address>;

  // Gets the balance of the specified account.
  // The account can be either in the wallet or an arbitrary address.
  // Possible errors: INVALID, NOTFOUND, FAILED, RPC_ERROR.
  getBalance(asset: UInt160, account: UInt160): Promise<Integer>;

  // Sends assets to an account and returns the hash of the transaction.
  // The `from` account must be in the wallet, while the `to` account can be either in the wallet or an arbitrary address.
  // If `from` is not specified, the wallet should automatically select an account or prompt the user to select one.
  // The `data` field can be used to pass additional data for the transfer, which can be used by the wallet or the receiving contract.
  // Possible errors: INVALID, NOTFOUND, FAILED, TIMEOUT, CANCELED, INSUFFICIENT_FUNDS, RPC_ERROR.
  send(
    asset: UInt160,
    from: UInt160,
    to: UInt160,
    amount: Integer,
    data?: Argument,
  ): Promise<UInt256>;

  // Calls a contract offchain and get the execution result.
  // Possible errors: INVALID, RPC_ERROR.
  call(invocation: InvocationArguments): Promise<InvocationResult>;

  // Calls one or more contracts onchain and returns the hash of the transaction.
  // Possible errors: INVALID, FAILED, TIMEOUT, CANCELED, RPC_ERROR.
  invoke(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions,
  ): Promise<UInt256>;

  // Calls one or more contracts onchain and return the transaction without relaying.
  // Possible errors: INVALID, FAILED, TIMEOUT, CANCELED, RPC_ERROR.
  makeTransaction(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions,
  ): Promise<ContractParametersContext>;

  // Signs the transaction with the current wallet. Usually used for multi-signature transactions.
  // Possible errors: UNSUPPORTED, INVALID, NOTFOUND, TIMEOUT, CANCELED.
  sign(context: ContractParametersContext): Promise<ContractParametersContext>;

  // Signs the message with the specified account.
  // The algorithm used is ECDsa with SHA256.
  // If `account` is omitted, the wallet should automatically select an account or prompt the user to select one.
  // Possible errors: INVALID, NOTFOUND, TIMEOUT, CANCELED.
  signMessage(
    message: string | Base64Encoded,
    account?: UInt160,
    options?: SignOptions,
  ): Promise<SignedMessage>;

  // Relays a transaction and returns the hash of it.
  // Possible errors: INVALID, TIMEOUT, CANCELED, INSUFFICIENT_FUNDS, RPC_ERROR.
  relay(context: ContractParametersContext): Promise<UInt256>;

  // Gets the block of the specified hash.
  // Possible errors: INVALID, NOTFOUND, RPC_ERROR.
  getBlock(hash: UInt256): Promise<Block>;

  // Gets the block of the specified index.
  // Possible errors: INVALID, NOTFOUND, RPC_ERROR.
  getBlock(index: number): Promise<Block>;

  // Gets the count of blocks in the blockchain.
  // Possible errors: RPC_ERROR.
  getBlockCount(): Promise<number>;

  // Gets the transaction of the specified hash.
  // Possible errors: INVALID, NOTFOUND, RPC_ERROR.
  getTransaction(txid: UInt256): Promise<Transaction>;

  // Gets the application log of the specified transaction.
  // Possible errors: INVALID, RPC_ERROR.
  getApplicationLog(txid: UInt256): Promise<ApplicationLog>;

  // Gets the specified storage entry.
  // Possible errors: INVALID, NOTFOUND, RPC_ERROR.
  getStorage(hash: UInt160, key: Base64Encoded): Promise<Base64Encoded>;

  // Gets the information of the specified token.
  // Possible errors: INVALID, NOTFOUND, FAILED, RPC_ERROR.
  getTokenInfo(hash: UInt160): Promise<Token>;
}

// Represents the event when the provider is ready to be used.
export type ProviderReadyEvent = CustomEvent<{
  provider: DapiProvider; // The instance of the provider that is ready.
}>;

// Represents the event when a dApp requests for a provider to be injected.
export type ProviderRequestEvent = CustomEvent<{
  version: Version; // The version of the dAPI that the requester expects to use.
}>;

// Represents the event when the user has changed the connected account in the wallet.
export type AccountChangedEvent = CustomEvent<{
  accounts: Account[]; // The new connected accounts in the wallet.
}>;

// Represents the event when the user switches the current network.
export type NetworkChangedEvent = CustomEvent<{
  network: Network; // The new network.
}>;
