// ScriptHash of the contract to subscribe to
const contractHash = "0x314b5aac1cdd01d10661b00886197f2194c3c89b";

// Get an instance of the Notifications server
const provider = new Neon.api.notifications.instance("MainNet");

function InvokeOperation()
{
  clearHtml();

  // Unsubscribe any previous handlers
  provider.unsubscribe(contractHash);

  // Get an RPC Endpoint (Neo Node)
  provider.subscribe(contractHash, (event) => {
    outputHtml('Event data: ');
    outputHtml(JSON.stringify(event, null, "  "));
  });
}

// Utility function to print output to an HTML div tag
function outputHtml(s) {
  document.getElementById("result").innerHTML += s + "<br>";
}

function clearHtml() {
  document.getElementById("result").innerHTML = "";
}
