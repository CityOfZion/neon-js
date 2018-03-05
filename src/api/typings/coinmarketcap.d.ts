interface Prices {
  [key: string]: number
}

/** DEPRECATED: Returns the price of coin in the symbol given */
export function getPrice(coin?: string, currency?: string): Promise<number>

/** Returns a mapping of the symbol for a coin to its price */
export function getPrices(coin?: string[], currency?: string): Promise<Prices>
