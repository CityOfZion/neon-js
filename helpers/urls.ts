import { rpc } from "@cityofzion/neon-core";

export function getUrls(net: string): string[] {
  if (net === "TestNet") {
    return parseJson(require("./testServers.json"));
  } else if (net === "MainNet") {
    return parseJson(require("./mainServers.json"));
  } else {
    throw new Error("Expected MainNet or TestNet");
  }
}

function parseJson(jsonFile): string[] {
  let returnArr = [];
  let concatURL: string;
  for (var i in jsonFile.sites) {
    if (jsonFile.sites[i].protocol) {
      concatURL = jsonFile.sites[i].protocol + "://" + jsonFile.sites[i].url + ":" +jsonFile.sites[i].port
      returnArr.push(concatURL);
    }
  }
  return returnArr;
};

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
