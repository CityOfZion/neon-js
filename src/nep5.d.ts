declare module 'neon-js' {
  function getTokenInfo(net: Net, scriptHash: string): any

  function getTokenBalance(
    net: string,
    scriptHash: string,
    address: string
  ): any
}
