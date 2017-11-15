*********
Interface
*********

``neon-js`` is merely a library to build interactions with the blockchain. It relies on external data sources for the data it needs for building transactions. However, this information is not available easily from the official NEO nodes. Thus, there have been efforts to build 3rd-party nodes in order to fill this gap.

Here, we will describe the information required from external data sources.

Balance
=======

A balance describes the assets that an address owns, as well as list the unspent coins. The unspent coins are used in most of the transactions that require transfer of assets. ``neon-js`` currently requires this format::

  {// Balance
    address: string, // The address
    NEO: {
      balance: number,
      unspent: Coin[]
      },
    GAS: {
      balance: number,
      unspent: Coin[]
      }
  }

The address property acts as an ID for this object and is used to derive the scriptHash when calculating the change to give back to the account.

All the other properties are named using asset symbols. Currently, there are only 2 assets available (NEO/GAS) and they both have similar names to symbols. Symbols should be in capital letters and be of 3-4 letters long.

Each symbol will be contain the ``balance`` and ``unspent`` property. ``balance`` tells us the total amount of this asset available and serves as a simple check if there is enough assets available to fulfil the sending intents. ``unspent`` contains a list of ``Coin`` that are used as Transaction Inputs.


Coin
====

The coin is essentially a spendable Transaction Output::

  {// Coin
    index: number,
    txid: string,
    value: number
  }

The coin describes an existing unspent TransactionOutput that can be used as an TransactionInput in a new transaction.

Claim
=====

The ``Claim`` object is used specifically for constructing ClaimTransaction::

  {
    claim: number, // Amount claimable, multipled by 10^8
    end: number, // Block which this coin was spent
    index: number, // array index of transaction in outputs
    start: number, // Block which this coin was created
    sysfee: number, // System fees involved
    txid: string, // Transaction ID of the coin
    value: number // Amount of NEO held in this coin
  }

NEO generates GAS when held. When NEO is spent, the gas that it generates is unlocked and made claimable through ClaimTransaction. The ``Claim`` object makes it possible for us to calculate the amount of gas claimable for that coin. The formula is::

  claim = (start - end) * 8 + sysfee
