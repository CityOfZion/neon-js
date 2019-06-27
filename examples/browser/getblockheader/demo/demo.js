// Hash of the block to get
const hash = "0x3d298e045e9b8d191e94239848a1ccee5b835afe01b9f7cfe07a1fa7af3d908c"

// Get an instance of Neoscan so we can find a working node
const provider = new Neon.api.neoscan.instance("TestNet");

// Ensure neon-js only talks to RPC endpoint (Neo node) using HTTPS
Neon.settings.httpsOnly = true;

function InvokeOperation()
{
  clearHtml();

  // Get an RPC Endpoint (Neo Node)
  provider.getRPCEndpoint().then(nodeUrl => {
		rpcQuery(response => {
			outputHtml('Block Data: ');
			outputHtml("Block Header: ");
			iterate(response, '');
		}, nodeUrl, "getblockheader", hash);
  });
}

// This is a reusable function that packages an unsupported RPC API call into a generic neon-js query object.
function rpcQuery(callback, url, method, parms) {
  let args

  if (parms) {
    let s = parms
    args = s.split(',')
    outputHtml('args: ' + args);
  }

  const query = Neon.default.create.query({method: method, params: args});

  query.execute(url).then(response => {
    callback(response);
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
  document.getElementById("result").innerHTML += s + "<br>";
}

function clearHtml() {
  document.getElementById("result").innerHTML = "";
}
