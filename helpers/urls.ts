import { rpc } from "@cityofzion/neon-core";

const TESTNET_URLS = [
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
  "https://mainnet1.neo2.coz.io:443",
  "https://mainnet2.neo2.coz.io:443",
  "https://mainnet3.neo2.coz.io:443",
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
      const res = (await rpc.Query.getBlockCount().execute(slicedUrls[i], {
        timeout: 2000,
      })) as {
        result: number;
      };
      const currentBlockCount = res.result;
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
