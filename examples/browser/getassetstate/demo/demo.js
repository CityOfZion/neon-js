// Hashes of the Neo and Gas assets
const neoHash = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
const gasHash = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"
const hash = neoHash

// Get an instance of Neoscan so we can find a working node
const provider = new Neon.api.neoscan.instance("TestNet");
// Ensure neon-js only talks to RPC endpoint (Neo node) using HTTPS
Neon.settings.httpsOnly = true;

function InvokeOperation()
{
  clearHtml();

  // Get an RPC Endpoint (Neo Node)
  provider.getRPCEndpoint().then(nodeUrl => {
    const client = Neon.default.create.rpcClient(nodeUrl);
    client.getAssetState(hash).then(response => {
      outputHtml('Hash: ' + hash);
      outputHtml('Asset:');
      iterate(response, '');
    });
  });
}

// Utility function to iterate over objects and display them to an output div
function iterate(obj, stack) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object") {
        iterate(obj[property], stack + '.' + property);
      } else {
        console.log(property + "  " + obj[property]);
        outputHtml(stack + '.' + property + ': ' + obj[property]);
      }
    }
  }
}

// Utility function to print output to an HTML div tag
function outputHtml(s) {
  document.getElementById("result").innerHTML += s;
}

function clearHtml() {
  document.getElementById("result").innerHTML = "";
}
