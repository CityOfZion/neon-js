import { api, rpc } from "@cityofzion/neon-js";

const RPC_URL = "http://seed1t.neo.org:20332";

const rpcClient = new rpc.RPCClient(RPC_URL);
console.log("Neo Weather Report");

rpcClient
  .getBlockCount()
  .then((currentHeight) => console.log(`Blockchain height: ${currentHeight}`))
  .then(() => api.getFeeInformation(rpcClient))
  .then((feeInfo) =>
    console.log(
      `Current fees: ${feeInfo.feePerByte} per byte, ${feeInfo.executionFeeFactor} multipler`
    )
  );
