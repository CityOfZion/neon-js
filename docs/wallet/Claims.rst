******
Claims
******

::

  class Claims {
    net: string
    address: string
    claims: ClaimItem[]
  }

The Claims class is a collection of claims data belonging to an account. It is usually retrieved from a 3rd part API. We do not recommend you craft your own Claims manually. This class is here for completeness in terms of high level objects.

Like Balance, the constructor is the way to convert a Claims-like object into a ``neon-js`` Claims object. This is the primary method we use to convert the claims object we get from 3rd party API.

.. autoclass:: Claims
  :members:
  :exclude-members: net, address, claims

  .. autoattribute:: Claims#net
  .. autoattribute:: Claims#address
  .. autoattribute:: Claims#claims
