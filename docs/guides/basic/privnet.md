---
id: privnet
title: Basic - Using a Private Net
---

This article describes the necessary setup required in order to use `neon-js` on a private net.

A private net is defined as a private instance of the NEO blockchain. It can be running either locally or on the cloud depending on your needs. It is useful for development work as it gives the developer all the GAS and NEO needed without having to beg and steal.

## Infrastructure

As `neon-js` is a light wallet SDK, there are several pieces of infrastructure that should be in place in order for `neon-js` to be effective.

First, the private chain must be running and its RPC ports be open. The RPC ports are usually configured to be 10332 or 20332 depending on whether you are running a main net or test net configuration. If using HTTPS, the ports are usually 10331 or 20331. Do test this by doing a simple curl towards your private network:

```sh
curl \
-H "Content-Type: application/json" \
-X POST \
-d '{"jsonrpc":"2.0","id":"123","method":"getversion","params":[]}' \
http://localhost:10332
```

If the NEO node is listening to that port, you should get something like:

```sh
{"jsonrpc":"2.0","id":"123","result":{"port":10332,"nonce":771124497,"useragent":"\/NEO:2.7.3\/"}}
```

Next, we need a data provider that can help aggregate the blockchain and provide us with the necessary information with a single API call. This is important as NEO uses the UTXO system for its native assets. This means that we need the references to every single transaction output that we have received in order to spend it.

Currently, this service is available as either neon-wallet-db or neoscan. Once this is setup, do check that your service is available through a curl request too as `neon-js` will be using HTTP requests to retrieve the data.

## Adding the private net

Now that all this is done, we will prepare our `Network` class that will configure and inform `neon-js` about our private net. First, we create the following javascript object:

```js
const config = {
  name: "PrivateNet",
  extra: {
    neoscan: "http://localhost:4000/api/main_net"
  }
};
```

For this example, we have a neoscan service setup serving our private net. The `name` field will be the name which we reference this in `neon-js`.

Now, we construct the `Network` object and add it to our `networks`:

```js
const privateNet = new rpc.Network(config);
Neon.add.network(privateNet);

// You will be able to lookup an instance of PrivateNet neoscan
var privateNetNeoscan = new Neon.api.neoscan.instance("PrivateNet");

privateNetNeoscan.getBalance(address).then(res => console.log(res));
```

We should be able to see a printout of the balance of the address if it is successful.

Finally, if you want to have access to event notifications, you'll have to run the notification server locally and add its url to the network configuration:

```js
const config = {
  name: "PrivateNet",
  extra: {
    neoscan: "http://localhost:4000/api/main_net",
    notifications: "ws://localhost:8080/event"
  }
};
```

## Notes

- If you are using docker to host everything (for example, relying on neoscan docker), the urls from `getRPCEndpoint` will not be reliable as they are local urls.
- You might want to setup a startup script that imports `neon-js` and imports the network in.
