
## JSFiddle Examples

- [JSFiddle Examples](#jsfiddle-examples)
	- [/Neo:v2.9.0/ API Reference](#neov290-api-reference)
		- [Asset Identifiers](#asset-identifiers)
		- [Get Account State](#get-account-state)
			- [getaccountstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getaccountstate/demo)
		- [Get Asset State](#get-asset-state)
			- [getassetstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getassetstate/demo)
		- [Get Balance (not implemented)](#get-balance-not-implemented)
			- [getbalance](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getbalance/demo)
		- [Get Best Block Hash](#get-best-block-hash)
			- [getbestblockhash](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getbestblockhash/demo)
		- [Get Block](#get-block)
			- [getblock](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblock/demo)
		- [Get Block Count](#get-block-count)
			- [getblockcount](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblockcount/demo)
		- [Get Block Header](#get-block-header)
			- [getblockheader](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblockheader/demo)
		- [Get Block Sys Fee](#get-block-sys-fee)
			- [getblocksysfee](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblocksysfee/demo)
		- [Get Connection Count](#get-connection-count)
			- [getconnectioncount](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getconnectioncount/demo)
		- [Get Contract State](#get-contract-state)
			- [getcontractstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getcontractstate/demo)
		- [Get Peers](#get-peers)
			- [getpeers](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getpeers/demo)
		- [Get Raw Memory Pool](#get-raw-memory-pool)
			- [getrawmempool](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getrawmempool/demo)
		- [Get Raw Transaction](#get-raw-transaction)
			- [getrawtransaction](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getrawtransaction/demo)
		- [Get Storage](#get-storage)
			- [getstorage](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getstorage/demo)
		- [Get Transaction Output](#get-transaction-output)
			- [gettxout](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/gettxout/demo)
		- [Get Validators](#get-validators)
			- [getvalidators](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getvalidators/demo)
		- [Get Version](#get-version)
			- [getversion](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getassetstate/demo)
		- [Subscribe to Notifications](#subscribe-notifications)
			- [subscribe](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/subscribenotifications/demo)
		- [Invoke](#invoke)
			- [doinvoke](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/doinvoke/demo)
		- [Invoke Function](#invoke-function)
			- [invokefunction](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/invokefunction/demo)
		- [Invoke Script](#invoke-script)
			- [invokescript](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/invokescript/demo)
		- [Validate Address](#validate-address)
			- [validateaddress](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/validateaddress/demo)
	- [Other Examples](#other-examples)
	- [Utilities](#utilities)

### /Neo:v2.9.0/ API Reference
This section provides links to JSFiddle examples of the neon-js implementation of the /Neo:v2.9.0/ API.

See https://docs.neo.org/en-us/node/cli/2.9.0/api.html for more information.

NOTES:
  - In most cases, the '0x' prefix for hashes is optional.
  - If an API endpoint isn't implemented by neon-js, a generic query is built and executed using neon-js RPC query.execute().

### Asset Identifiers

Neo: 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b

Gas: 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7

#### Get Account State

getaccountstate(address)

Get the account state for a wallet address.

JSFiddle: [getaccountstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getaccountstate/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getaccountstate.html

#### Get Asset State

getassetstate(asset_id_hash)

Queries the asset information, based on the specified asset number.

JSFiddle: [getassetstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getassetstate/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getassetstate.html

#### Get Balance (not implemented)

getbalance(asset_id_hash)

Returns the balance of the corresponding asset in the wallet according to the specified asset number.

NOTE: getBalance is not currently implemented as an RPC call in neon-js as the Neo API requires a wallet to be open to access it. Balances for arbitrary addresses can be queried with getaccountstate. This reference is here to educate and provide reminder to future implementation using an API like Neoscan.

JSFiddle: [getbalance](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getbalance/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getbalance.html

#### Get Best Block Hash

getbestblockhash()

Get the hash of the highest (most recent) block.

JSFiddle: [getBestBlockHash](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getbestblockhash/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getbestblockhash.html

#### Get Block

getblock(hash)

getblock(index)

Get block data by its hash or index.

JSFiddle: [getBlock](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblock/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getblock.html

#### Get Block Count

getblockcount()

Get the number of blocks on a chain.

JSFiddle: [getBlockCount](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblockcount/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getblockcount.html

#### Get Block Header

getblockheader(hash)

Returns the corresponding block header information according to the specified script hash.
This method builds a custom request and executes it using the neon-js RPC query facility.

JSFiddle: [getblockheader](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblockheader/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getblockheader.html

#### Get Block Sys Fee

getblocksysfee(blockIndex)

Returns the system fees of the block, based on the specified index.

JSFiddle: [getblocksysfee](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getblocksysfee/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getblocksysfee.html

#### Get Connection Count

getconnectioncount()

Gets the current number of connections for the node.

JSFiddle: [getconnectioncount](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getconnectioncount/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getconnectioncount.html

#### Get Contract State

getcontractstate(hash)

Queries contract information, according to the contract script hash.

JSFiddle: [getcontractstate](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getcontractstate/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getcontractstate.html

#### Get Peers

getpeers()

Gets a list of nodes that are currently connected/disconnected by this node.

JSFiddle: [getpeers](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getpeers/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getpeers.html


#### Get Raw Memory Pool

getrawmempool()

Gets a list of unconfirmed transactions in memory.

JSFiddle: [getrawmempool](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getrawmempool/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getrawmempool.html

#### Get Raw Transaction

getrawtransaction(hash)

Returns the corresponding transaction information based on the specified hash value.

JSFiddle: [getrawtransaction](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getrawtransaction/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getrawtransaction.html

#### Get Storage

getstorage(hash, key)

Returns the stored value, according to the contract script hash and the stored key.

JSFiddle: [getstorage](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getstorage/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getstorage.html

#### Get Transaction Output

gettxout(txid, index)

Returns the corresponding unspent transaction output information (returned change), based on the specified hash and index. If the transaction output is already spent, the result value will be null.

JSFiddle: [gettxout](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/gettxout/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/gettxout.html

#### Get Validators

getvalidators()

Returns the current NEO consensus nodes information and voting status.

JSFiddle: [getvalidators](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getvalidators/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getvalidators.html

#### Get Version

getversion()

Gets version information of this node.

JSFiddle: [getversion](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/getversion/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/getversion.html

#### Subscribe Notifications

subscribe(scriptHash, callback)

Subscribe to receive event notifications from a contract.

JSFiddle: [invoke](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/subscribenotifications/demo)

API Ref: https://github.com/corollari/neo-PubSub

#### Invoke

invoke(scriptHash, params)

Invokes a smart contract at specified script hash with the given parameters.

neon-js wraps invoke with a helper called doInvoke.

JSFiddle: [invoke](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/doinvoke/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/invoke.html

#### Invoke Function

invokefunction(scriptHash, operation, params)

Invokes a smart contract at specified script hash, passing in an operation and its params.

JSFiddle: [invokefunction](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/invokefunction/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/invokefunction.html

#### Invoke Script

invokescript(script)

Runs a script through the virtual machine and returns the results.

JSFiddle: [invokescript](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/invokescript/demo)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/invokescript.html

#### Validate Address

validateaddress(address)

Verify that the address is a correct NEO address.

JSFiddle: [validateAddress](https://jsfiddle.net/gh/get/jquery/3.0/cityofzion/neon-js/tree/master/examples/browser/validateaddress/demo/)

API Ref: https://docs.neo.org/en-us/node/cli/2.9.0/api/validateaddress.html



### Other Examples

[Restrict API to HTTPS Operation](https://jsfiddle.net/n1o5xjy4/)

[Transfer Tokens](https://jsfiddle.net/t16y0ek3/)


### Utilities
