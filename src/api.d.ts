declare module 'neon-js' {
  type AssetAmounts = {
    GAS: number
    NEO: number
  }

  type History = {
    address: string
    history: PastTransaction[]
    name: string
    net: Net
  }

  type PastTransaction = {
    GAS: number
    NEO: number
    block_index: number
    gas_sent: boolean
    neo_sent: boolean
    txid: string
  }

  type RpcMethod = 'getstorage' | 'invokescript' | 'sendrawtransaction'

  type Response = {
    id: number
    jsonrpc: string
    result: any
  }

  type SigningFunction = (unsignedTx: string, publicKeyEncoded: string) => Promise<any>

  type StackItem<T> = {
    type: T
    value: string
  }

  const neoId: string
  const gasId: string
  const allAssetIds: string[]

  function doClaimAllGas(
    net: string,
    fromWif: string
  ): Promise<Response>

  function hardwareDoClaimAllGas(
    net: string,
    fromPublicKey: string,
    signingFunction: SigningFunction
  ): Promise<Response>

  function doInvokeScript(net: Net, script: string, parse?: boolean): any

  // See https://www.typescriptlang.org/docs/handbook/functions.html#overloads
  function parseVMStack(stack: StackItem<'ByteArray'>[]): string[]
  function parseVMStack(stack: StackItem<'Integer'>[]): number[]

  function getStorage(
    net: Net,
    scriptHash: string,
    key: string
  ): Promise<Response>

  function doSendAsset(
    net: Net,
    toAddress: string,
    fromWif: string,
    assetAmounts: AssetAmounts
  ): Promise<Response>

  function hardwareDoSendAsset(
    net: Net,
    toAddress: string,
    from: string,
    assetAmounts: AssetAmounts,
    signingFunction?: SigningFunction
  ): Promise<Response>

  function doMintTokens(
    net: Net,
    scriptHash: string,
    fromWif: string,
    neo: number,
    gasCost: number
  ): Promise<Response>

  function doSendTx(
    net: Net,
    transaction: string | Transaction,
    id?: number
  ): Promise<Response>

  function getAPIEndpoint(net: Net): string

  function getBalance(net: Net, address: string): Promise<Balance>

  type GetClaimAmountsResponse = {
    available: number,
    unavailable: number
  }
  function getClaimAmounts(
    net: Net,
    address: string
  ): Promise<GetClaimAmountsResponse>

  function getRPCEndpoint(net: Net): Promise<string>

  function getTransactionHistory(net: Net, address: string): Promise<History>

  function getWalletDBHeight(net: Net): Promise<number>

  function queryRPC(
    net: string,
    method: RpcMethod,
    params: string[],
    id?: number
  ): Promise<Response>

  function testInvokeRPC(script: string): Promise<Response>
}
