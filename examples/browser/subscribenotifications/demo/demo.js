// ScriptHash of the contract to subscribe to
const contractHash = "0x314b5aac1cdd01d10661b00886197f2194c3c89b";
// Subscriptions to null are equivalent to subscribing to all the contracts
const allContractHashes = null;

// Get an instance of the Notifications server
const provider = new Neon.api.notifications.instance("wss://YOUR_PUBSUB_SERVER.com/event");

let subscription;

function InvokeSubscribeOperation()
{
  clearHtml();

  // Create a subscription
  subscription = provider.subscribe(allContractHashes, (event) => {
    outputHtml('Event data: ');
    outputHtml(JSON.stringify(event, null, "  "));
  });
}

function InvokeUnsubscribeOperation()
{
  if(subscription !== undefined){
    // Unsubscribe the previous handler
    subscription.unsubscribe();
  }
}


// Utility function to print output to an HTML div tag
function outputHtml(s) {
  document.getElementById("result").innerHTML += s + "<br>";
}

function clearHtml() {
  document.getElementById("result").innerHTML = "";
}
