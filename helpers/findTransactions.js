const rpc = require("@cityofzion/neon-core").rpc;

const START_BLOCK = 500;
const STOPPING_POINT = 10;

const client = new rpc.RPCClient("http://seed3t.neo.org:20332");

let currentBlock = START_BLOCK;
let found = 0;
(async () => {
  while (found < STOPPING_POINT) {
    const block = await client.getBlock(currentBlock, true);
    if (block.tx.length > 0) {
      found++;
      block.tx.forEach((tx) => console.log(tx.hash));
    }
    currentBlock++;
  }
})();

// Some TestNet examples
//0x1e16f97be7fe8e9e2136dfdea37207fc27d2bc42661dd1feb6f37381233c44ad
//0x4ab526c3384c98c713cd6f6648ec484a2ce7c1a4855561fe15bad91f1bda63c0
//0xd8454136d8f911ee00028235579f635ddc684edadc92c3844aa1c03abab2c877
//0x50dafac34a0ec0702883a64cb9dfc6559ac87a392a3b7d4c5c25bdbc3fc6880c
