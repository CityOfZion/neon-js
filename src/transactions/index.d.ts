declare module 'neon-js' {
  type Balance = {
    GAS: TokenBalance
    NEO: TokenBalance
    address: string
    net: Net
  }

  type Claim = {
    claim: number
    index: number
    txid: string
  }
  type ClaimData = {
    claims: Claim[]
  }

  type Coin = {
    index: number
    txid: string
    value: number
  }

  type Invoke = {
    args?: Array | string | number| boolean
    operation?: string | null
    scriptHash: string
    useTailCall?: boolean
  }

  type TokenBalance = {
    balance: number
    unspent: Coin[]
  }

  interface Transaction {
    attributes: TransactionAttribute[]
    inputs: TransactionInput[]
    outputs: TransactionOutput[]
    scripts: Witness[]
    type: number
    version: number
  }
  type TransactionAttribute = {
    data: string
    usage: number
  }
  type TransactionInput = {
    prevHash: string
    prevIndex: number
  }
  type TransactionOutput = {
    assetId: string
    scriptHash: string
    value: number
  }

  type TransactionPartial = {
    [P in keyof Transaction]?: Transaction[P]
  }

  type Witness = {
    invocationScript: string
    verificationScript: string
  }

  class StringStream {
    public pter: 0

    constructor(
      public str: string = ''
    ): void

    public isEmpty(): boolean
    public read(bytes: number): string
    public readVarBytes(): string
    public readVarInt(): number
  }

  const ASSETS: {
    [key: string]: 'GAS'
    [key: string]: 'NEO'
    GAS: string
    NEO: string
  }

  const create: {
    claim: (
      publicKey: string,
      claimData: ClaimData,
      override?: TransactionPartial
    ) => Transaction

    contract: (
      publicKey: string,
      balances: Balance,
      intents: TransactionOutput[],
      override?: TransactionPartial
    ) => Transaction

    invocation: (
      publicKey: string,
      balances: Balance,
      intents: TransactionOutput[],
      invoke: Invoke | string,
      gasCost: number,
      override?: TransactionPartial
    ) => Transaction
  }

  const serialize: {
    attribute: (attr: TransactionAttribute) => string

    exclusiveData: {
      2: (transaction: Transaction) => string
      128: (transaction: Transaction) => ''
      209: (transaction: Transaction) => string
    }

    input: (input: TransactionInput) => string

    output: (output: TransactionOutput) => string

    script: (witness: Witness) => string
  }

  const deserialize: {
    attribute: comp.deserializeTransactionAttribute

    exclusiveData: {
      2: (stream: StringStream) => {
        claims: TransactionInput[]
      }

      128: (stream: StringStream) => {}

      209: (stream: StringStream) => {
        gas: number
        script: string
      }
    }

    input: (stream: StringStream) => TransactionInput

    output: (stream: StringStream) => TransactionOutput

    script: (stream: StringStream) => Witness
  }

  function serializeTransaction(
    transaction: Transaction,
    signed?: boolean
  ): string

  function deserializeTransaction(data: string): Transaction

  function signTransaction(
    transaction: Transaction,
    privateKey: string
  ): Transaction

  function getTransactionHash(transaction: Transaction): string
}
