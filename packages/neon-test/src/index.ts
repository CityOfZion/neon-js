import { api, rpc } from "@cityofzion/neon-js";

const RPC_URL = "https://testnet1.neo.coz.io:443";

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
