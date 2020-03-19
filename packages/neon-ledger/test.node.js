const nodeLedger = require("@ledgerhq/hw-transport-node-hid").default;
const ledgerPlugin = require("@cityofzion/neon-ledger").default;
const neon = require("@cityofzion/neon-js");

const neonJs = ledgerPlugin(neon);
const addressNumber = 0;

const neoscan = new neonJs.api.neoscan.instance("TestNet");

let ledgerInstance = null;

neonJs.ledger
  .getDevicePaths(nodeLedger)
  .then(paths => {
    console.log("\n\n ---Ledger devices---");
    console.log(paths);
    ledgerInstance = nodeLedger.open(paths[0]);
    return ledgerInstance;
  })
  .then(ledger => {
    ledgerInstance = ledger;
    const bip = neonJs.ledger.BIP44(addressNumber);
    console.log("\n\n ---BIP44 String---");
    console.log(bip);
    return neonJs.ledger.getPublicKey(ledger, bip);
  })
  .then(key => {
    console.log("\n\n ---Public Key---");
    console.log(key);
    return key;
  })
  .then(publicKey => {
    return neonJs.api.sendAsset({
      api: neoscan,
      account: new neonJs.wallet.Account(publicKey),
      intents: neonJs.api.makeIntent(
        { NEO: 1 },
        "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
      ),
      signingFunction: async (tx, pubKey) => {
        const sig = await neonJs.ledger.getSignature(
          ledgerInstance,
          tx,
          neonJs.ledger.BIP44(addressNumber)
        );
        const witness = await neonJs.tx.Witness.fromSignature(sig, pubKey);
        return witness.serialize();
      }
    });
  })
  .then(sendAsset => {
    console.log("\n\n---SendAsset---");
    console.log(sendAsset.response);
  })
  .catch(e => {
    console.log(e);
  });
