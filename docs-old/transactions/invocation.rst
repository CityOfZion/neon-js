***********************
Invocation Transaction
***********************

Sends a smart contract invocation script to the blockchain. Use this to call a smart contract and effect changes on the blockchain.

This is a real invocation as compared to the RPC methods invoke/invokefunction/invokescript. The RPC methods will only invoke the contract on the RPC node and returns the result as if a real InvocationTransaction was sent. However, the results are not effected on the blockchain. The use of those RPC methods is to verify the validity of the script as well as find out the actual gas cost of the invocation.

Exclusive Data
--------------

**script**

  The script to be executed by the VM. It is a bytearray but usually represented as an hexstring.
