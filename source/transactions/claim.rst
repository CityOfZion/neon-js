********************
Claim Transaction
********************

Used to claim GAS for an address. Whenever NEO is 'spent', the GAS attached to the 'spent' NEO is made claimable through the transaction that spent the NEO. This transaction creates the GAS and sends it to a designated address.

Exclusive Data
---------------

**claims**

  An array of TransactionInputs which are the transactions that we are claiming gas for.
