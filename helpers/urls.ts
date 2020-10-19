import { rpc } from "@cityofzion/neon-core";

const TESTNET_URLS = [
  "https://test1.cityofzion.io:443",
  "https://test2.cityofzion.io:443",
  "https://test3.cityofzion.io:443",
  "http://seed1.ngd.network:20332",
  "http://seed2.ngd.network:20332",
  "http://seed3.ngd.network:20332",
  "http://seed4.ngd.network:20332",
  "http://seed5.ngd.network:20332",
  "http://seed6.ngd.network:20332",
  "http://seed7.ngd.network:20332",
  "http://seed8.ngd.network:20332",
  "http://seed9.ngd.network:20332",
  "http://seed10.ngd.network:20332",
];

const MAINNET_URLS = [
  "http://seed1.ngd.network:10332",
  "http://seed2.ngd.network:10332",
  "http://seed3.ngd.network:10332",
  "http://seed4.ngd.network:10332",
  "http://seed5.ngd.network:10332",
  "http://seed6.ngd.network:10332",
  "http://seed7.ngd.network:10332",
  "http://seed8.ngd.network:10332",
  "http://seed9.ngd.network:10332",
  "http://seed10.ngd.network:10332",
  "https://seed0.cityofzion.io:443",
  "https://seed1.cityofzion.io:443",
  "https://seed2.cityofzion.io:443",
  "https://seed3.cityofzion.io:443",
  "https://seed4.cityofzion.io:443",
  "https://seed5.cityofzion.io:443",
  "https://seed6.cityofzion.io:443",
  "https://seed7.cityofzion.io:443",
  "https://seed8.cityofzion.io:443",
  "https://seed9.cityofzion.io:443",
];

export function getUrls(net: string): string[] {
  if (net === "TestNet") {
    return TESTNET_URLS;
  } else if (net === "MainNet") {
    return MAINNET_URLS;
  } else {
    throw new Error("Expected MainNet or TestNet");
  }
}

function cutArray<T>(arr: T[]): T[] {
  const randomStartIndex = Math.floor(Math.random() * arr.length);
  return arr.slice(randomStartIndex).concat(arr.slice(0, randomStartIndex));
}
export async function getUrl(net: string): Promise<string> {
  const orderedUrls = getUrls(net);

  const slicedUrls = cutArray(orderedUrls);
  let previousBlockCount = 0;
  for (let i = 0; i < slicedUrls.length; i++) {
    try {
      const dispatcher = new rpc.RpcDispatcher(slicedUrls[i]);
      const currentBlockCount = await dispatcher.execute<number>(
        rpc.Query.getBlockCount()
      );
      if (currentBlockCount - previousBlockCount <= 5) {
        return slicedUrls[i];
      }
      previousBlockCount = Math.max(currentBlockCount, previousBlockCount);
    } catch (e) {
      continue;
    }
  }
  throw new Error("Exhausted all urls but found no available RPC");
}