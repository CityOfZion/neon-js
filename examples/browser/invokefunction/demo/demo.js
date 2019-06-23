
const contractHash = "5b7074e873973a6ed3708862f219a6fbf4d1c411";

// Get an instance of Neoscan so we can find a working node
const provider = new Neon.api.neoscan.instance("TestNet");

// Ensure neon-js only talks to RPC endpoint (Neo node) using HTTPS
Neon.settings.httpsOnly = true;

function InvokeOperation()
{
  clearHtml();

  // Get an RPC Endpoint (Neo Node)
  provider.getRPCEndpoint().then(nodeUrl => {
		invokeFunction(response => {
			outputHtml('Results: ');
			iterate(response, '');
		}, nodeUrl);
  });
}

// We're wrapping the neon-js call to make our code a little clearer.
function invokeFunction(callback, url) {
  Neon.rpc.Query.invokeFunction(contractHash, "name")
    .execute(url)
    .then(res => {
      callback(res); // You should get a result with state: "HALT, BREAK"
    })
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
