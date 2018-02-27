***
RPC
***

Module ``rpc``

.. autoclass:: RPCClient
  :members:
  :exclude-members: net, history, version

  .. autoattribute:: RPCClient#net
  .. autoattribute:: RPCClient#history
  .. autoattribute:: RPCClient#version

.. autoclass:: Query
  :members:
  :exclude-members: req, completed, parse

  .. autoattribute:: Query#req
  .. autoattribute:: Query#completed
  .. autoattribute:: Query#parse

.. autofunction:: queryRPC
