// ── Assertion helpers ─────────────────────────────────────────────────────────

const toJson = (value) => JSON.stringify(value);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ── Config ────────────────────────────────────────────────────────────────────

// Set to a known account script hash on the target network
const GAS = "0xd2a4cff31913016155e38e474a2c06d08be276cf";

// ── Tests ─────────────────────────────────────────────────────────────────────

const authenticateTest = {
  id: "auth",
  name: "authenticate",
  tag: "interactive",
  fn: async (provider) => {
    const payload = {
      action: "Authentication",
      grant_type: "Signature",
      allowed_algorithms: ["ECDSA-P256"],
      domain: location.hostname || "localhost",
      networks: [894710606],
      nonce: Math.floor(Math.random() * 1e9).toString(),
      timestamp: Math.floor(Date.now() / 1000),
    };

    const authResponse = await provider.authenticate(payload);

    assert(
      authResponse && typeof authResponse === "object",
      "expected object response",
    );
    assert(
      authResponse.algorithm === "ECDSA-P256",
      'expected algorithm "ECDSA-P256", got ' + toJson(authResponse.algorithm),
    );
    assert(
      typeof authResponse.network === "number",
      "expected network number, got " + typeof authResponse.network,
    );
    assert(
      typeof authResponse.pubkey === "string" && authResponse.pubkey.length > 0,
      "pubkey must be non-empty string",
    );
    assert(
      typeof authResponse.address === "string" &&
        authResponse.address.length > 0,
      "address must be non-empty string",
    );
    assert(typeof authResponse.nonce === "string", "nonce must be string");
    assert(
      typeof authResponse.timestamp === "number",
      "timestamp must be number",
    );
    assert(
      typeof authResponse.signature === "string" &&
        authResponse.signature.length > 0,
      "signature must be non-empty string",
    );

    return authResponse;
  },
};

const getAccountsTest = {
  id: "getAccounts",
  name: "getAccounts",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();

    assert(Array.isArray(accounts), "expected array, got " + typeof accounts);
    assert(
      accounts.length > 0,
      "expected at least one account — connect an account in the wallet first",
    );

    const firstAccount = accounts[0];
    assert(
      typeof firstAccount.hash === "string" && firstAccount.hash.length > 0,
      "account.hash must be non-empty string",
    );
    assert(
      typeof firstAccount.address === "string" &&
        firstAccount.address.length > 0,
      "account.address must be non-empty string",
    );
    if (firstAccount.label !== undefined)
      assert(
        typeof firstAccount.label === "string",
        "account.label must be string if present",
      );
    if (firstAccount.contract !== undefined) {
      assert(
        typeof firstAccount.contract === "object",
        "account.contract must be object if present",
      );
      assert(
        Array.isArray(firstAccount.contract.parameters),
        "account.contract.parameters must be array",
      );
      assert(
        typeof firstAccount.contract.deployed === "boolean",
        "account.contract.deployed must be boolean",
      );
    }

    return accounts;
  },
};

const callTest = {
  id: "call",
  name: "call",
  fn: async (provider) => {
    const callResult = await provider.call({
      hash: GAS,
      operation: "symbol",
      args: [],
    });

    assert(
      callResult && typeof callResult === "object",
      "expected object response",
    );
    assert(
      typeof callResult.script === "string" && callResult.script.length > 0,
      "script must be non-empty string",
    );
    assert(
      callResult.state === "HALT",
      'expected state "HALT", got ' + toJson(callResult.state),
    );
    assert(
      Number.isInteger(Number(callResult.gasconsumed)),
      "gasconsumed must be a non-float integer, got " +
        toJson(callResult.gasconsumed),
    );
    assert(
      Array.isArray(callResult.notifications),
      "notifications must be array",
    );
    assert(
      Array.isArray(callResult.stack) && callResult.stack.length > 0,
      "stack must be non-empty array",
    );
    assert(
      callResult.stack[0].type === "ByteString",
      'expected stack[0].type "ByteString", got ' +
        toJson(callResult.stack[0].type),
    );

    return callResult;
  },
};

const getBalanceTest = {
  id: "getBalance",
  name: "getBalance",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    console.log(accounts);

    const balance = await provider.getBalance(GAS, accounts[0].hash);

    assert(
      typeof balance === "string" || typeof balance === "number",
      "expected string or number, got " + typeof balance,
    );
    assert(
      Number.isInteger(Number(balance)),
      "balance must be a non-float integer, got " + toJson(balance),
    );
    assert(
      Number(balance) >= 0,
      "balance must be non-negative, got " + toJson(balance),
    );

    return balance;
  },
};

const getApplicationLogTest = {
  id: "getApplicationLog",
  name: "getApplicationLog",
  fn: async (provider) => {
    const applicationLog = await provider.getApplicationLog(
      "0xdf8bb3aa6fcd3b0b9e54a7ae563cd13648fb2ad42f67c4ea47435bd014d10626",
    );

    assert(
      applicationLog && typeof applicationLog === "object",
      "expected object response",
    );
    assert(
      typeof applicationLog.txid === "string" && applicationLog.txid.length > 0,
      "txid must be non-empty string",
    );
    assert(
      Array.isArray(applicationLog.executions) &&
        applicationLog.executions.length > 0,
      "executions must be non-empty array",
    );

    const firstExecution = applicationLog.executions[0];
    assert(
      typeof firstExecution.trigger === "string",
      "executions[0].trigger must be string",
    );
    assert(
      typeof firstExecution.vmstate === "string",
      "executions[0].vmstate must be string",
    );
    assert(
      Number.isInteger(Number(firstExecution.gasconsumed)),
      "executions[0].gasconsumed must be a non-float integer, got " +
        toJson(firstExecution.gasconsumed),
    );
    assert(
      Array.isArray(firstExecution.stack),
      "executions[0].stack must be array",
    );
    assert(
      Array.isArray(firstExecution.notifications),
      "executions[0].notifications must be array",
    );

    return applicationLog;
  },
};

const getBlockCountTest = {
  id: "getBlockCount",
  name: "getBlockCount",
  fn: async (provider) => {
    const blockCount = await provider.getBlockCount();

    assert(
      typeof blockCount === "number",
      "expected number, got " + typeof blockCount,
    );
    assert(
      Number.isInteger(blockCount),
      "blockCount must be a non-float integer, got " + toJson(blockCount),
    );
    assert(
      blockCount > 0,
      "blockCount must be greater than 0, got " + toJson(blockCount),
    );

    return blockCount;
  },
};

const getBlockTest = {
  id: "getBlock",
  name: "getBlock",
  fn: async (provider) => {
    const blockCount = await provider.getBlockCount();
    const block = await provider.getBlock(Number(blockCount - 1));

    assert(block && typeof block === "object", "expected object response");
    assert(
      typeof block.hash === "string" && block.hash.length > 0,
      "block.hash must be non-empty string",
    );
    assert(
      Number.isInteger(block.size) && block.size > 0,
      "block.size must be a positive integer, got " + toJson(block.size),
    );
    assert(
      Number.isInteger(block.confirmations) && block.confirmations > 0,
      "block.confirmations must be a positive integer, got " +
        toJson(block.confirmations),
    );
    assert(
      Number.isInteger(block.version),
      "block.version must be integer, got " + toJson(block.version),
    );
    assert(
      typeof block.previousBlockHash === "string",
      "block.previousBlockHash must be string",
    );
    assert(
      typeof block.merkleRoot === "string" && block.merkleRoot.length > 0,
      "block.merkleRoot must be non-empty string",
    );
    assert(
      Number.isInteger(block.time) && block.time > 0,
      "block.time must be a positive integer, got " + toJson(block.time),
    );
    assert(
      typeof block.nonce === "string" && block.nonce.length > 0,
      "block.nonce must be non-empty string",
    );
    assert(
      Number.isInteger(block.index),
      "block.index must be integer, got " + toJson(block.index),
    );
    assert(
      Number.isInteger(block.primary),
      "block.primary must be integer, got " + toJson(block.primary),
    );
    assert(
      typeof block.nextConsensus === "string" && block.nextConsensus.length > 0,
      "block.nextConsensus must be non-empty string",
    );
    assert(Array.isArray(block.tx), "block.tx must be array");

    return block;
  },
};

const getStorageTest = {
  id: "getStorage",
  name: "getStorage",
  fn: async (provider) => {
    const totalSupplyKey = "Cw==";
    const storageValue = await provider.getStorage(GAS, "Cw==");

    assert(
      typeof storageValue === "string" && storageValue.length > 0,
      "expected non-empty string, got " + typeof storageValue,
    );
    assert(
      /^[A-Za-z0-9+/]*={0,2}$/.test(storageValue),
      "storageValue must be valid base64, got " + toJson(storageValue),
    );

    return storageValue;
  },
};

const getTokenInfoTest = {
  id: "getTokenInfo",
  name: "getTokenInfo",
  fn: async (provider) => {
    const tokenInfo = await provider.getTokenInfo(GAS);

    assert(
      tokenInfo && typeof tokenInfo === "object",
      "expected object response",
    );
    assert(
      typeof tokenInfo.symbol === "string" && tokenInfo.symbol.length > 0,
      "tokenInfo.symbol must be non-empty string",
    );
    assert(
      tokenInfo.symbol === "GAS",
      'expected symbol "GAS", got ' + toJson(tokenInfo.symbol),
    );
    assert(
      Number.isInteger(tokenInfo.decimals),
      "tokenInfo.decimals must be a non-float integer, got " +
        toJson(tokenInfo.decimals),
    );
    assert(
      tokenInfo.decimals === 8,
      "tokenInfo.decimals must be 8, got " + toJson(tokenInfo.decimals),
    );
    assert(
      typeof tokenInfo.totalSupply === "string" ||
        typeof tokenInfo.totalSupply === "number",
      "tokenInfo.totalSupply must be string or number, got " +
        typeof tokenInfo.totalSupply,
    );
    assert(
      Number.isInteger(Number(tokenInfo.totalSupply)),
      "tokenInfo.totalSupply must be a non-float integer, got " +
        toJson(tokenInfo.totalSupply),
    );

    return tokenInfo;
  },
};

const getTransactionTest = {
  id: "getTransaction",
  name: "getTransaction",
  fn: async (provider) => {
    const applicationLog = await provider.getApplicationLog(
      "0xdf8bb3aa6fcd3b0b9e54a7ae563cd13648fb2ad42f67c4ea47435bd014d10626",
    );
    const transaction = await provider.getTransaction(applicationLog.txid);

    assert(
      transaction && typeof transaction === "object",
      "expected object response",
    );
    assert(
      typeof transaction.hash === "string" && transaction.hash.length > 0,
      "transaction.hash must be non-empty string",
    );
    assert(
      transaction.hash === applicationLog.txid,
      "transaction.hash must match requested txid",
    );
    assert(
      Number.isInteger(transaction.size) && transaction.size > 0,
      "transaction.size must be a positive integer, got " +
        toJson(transaction.size),
    );
    assert(
      Number.isInteger(transaction.version),
      "transaction.version must be integer, got " + toJson(transaction.version),
    );
    assert(
      Number.isInteger(transaction.nonce),
      "transaction.nonce must be integer, got " + toJson(transaction.nonce),
    );
    assert(
      typeof transaction.blockHash === "string" &&
        transaction.blockHash.length > 0,
      "transaction.blockHash must be non-empty string",
    );
    assert(
      Number.isInteger(transaction.blockTime) && transaction.blockTime > 0,
      "transaction.blockTime must be a positive integer, got " +
        toJson(transaction.blockTime),
    );
    assert(
      Number.isInteger(transaction.confirmations) &&
        transaction.confirmations > 0,
      "transaction.confirmations must be a positive integer, got " +
        toJson(transaction.confirmations),
    );
    assert(
      Number.isInteger(Number(transaction.systemFee)),
      "transaction.systemFee must be a non-float integer, got " +
        toJson(transaction.systemFee),
    );
    assert(
      Number.isInteger(Number(transaction.networkFee)),
      "transaction.networkFee must be a non-float integer, got " +
        toJson(transaction.networkFee),
    );
    assert(
      Number.isInteger(transaction.validUntilBlock),
      "transaction.validUntilBlock must be integer, got " +
        toJson(transaction.validUntilBlock),
    );
    assert(
      typeof transaction.sender === "string" && transaction.sender.length > 0,
      "transaction.sender must be non-empty string",
    );
    assert(
      Array.isArray(transaction.signers),
      "transaction.signers must be array",
    );
    assert(
      Array.isArray(transaction.attributes),
      "transaction.attributes must be array",
    );
    assert(
      typeof transaction.script === "string" && transaction.script.length > 0,
      "transaction.script must be non-empty string",
    );

    return transaction;
  },
};

const invokeTest = {
  id: "invoke",
  name: "invoke",
  tag: "interactive",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    const senderHash = accounts[0].hash;

    const txid = await provider.invoke(
      [
        {
          hash: GAS,
          operation: "transfer",
          args: [
            { type: "Hash160", value: senderHash },
            { type: "Hash160", value: senderHash },
            { type: "Integer", value: 1 },
            { type: "String", value: "321" },
          ],
        },
      ],
      [{ account: senderHash, scopes: "CalledByEntry" }],
    );

    assert(
      typeof txid === "string" && txid.length > 0,
      "expected non-empty string txid, got " + typeof txid,
    );
    assert(
      txid.startsWith("0x"),
      'txid must start with "0x", got ' + toJson(txid),
    );
    assert(
      txid.length === 66,
      "txid must be 66 characters (0x + 64 hex), got length " + txid.length,
    );

    return txid;
  },
};

const sendTest = {
  id: "send",
  name: "send",
  tag: "interactive",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    const senderHash = accounts[0].hash;

    // Send 1 datoshi (0.00000001 GAS) to self — minimal cost, safe for testnet
    const txid = await provider.send(GAS, senderHash, senderHash, "1");

    assert(
      typeof txid === "string" && txid.length > 0,
      "expected non-empty string txid, got " + typeof txid,
    );
    assert(
      txid.startsWith("0x"),
      'txid must start with "0x", got ' + toJson(txid),
    );
    assert(
      txid.length === 66,
      "txid must be 66 characters (0x + 64 hex), got length " + txid.length,
    );

    return txid;
  },
};

const signMessageTest = {
  id: "signMessage",
  name: "signMessage",
  tag: "interactive",
  fn: async (provider) => {
    const signedMessage = await provider.signMessage("Hello Neo");

    assert(
      signedMessage && typeof signedMessage === "object",
      "expected object response",
    );
    assert(
      typeof signedMessage.payload === "string" &&
        signedMessage.payload.length > 0,
      "signedMessage.payload must be non-empty string",
    );
    assert(
      /^[A-Za-z0-9+/]*={0,2}$/.test(signedMessage.payload),
      "signedMessage.payload must be valid base64",
    );
    assert(
      typeof signedMessage.signature === "string" &&
        signedMessage.signature.length > 0,
      "signedMessage.signature must be non-empty string",
    );
    assert(
      /^[A-Za-z0-9+/]*={0,2}$/.test(signedMessage.signature),
      "signedMessage.signature must be valid base64",
    );
    assert(
      typeof signedMessage.account === "string" &&
        signedMessage.account.length > 0,
      "signedMessage.account must be non-empty string",
    );
    assert(
      typeof signedMessage.pubkey === "string" &&
        signedMessage.pubkey.length > 0,
      "signedMessage.pubkey must be non-empty string",
    );

    return signedMessage;
  },
};

const makeTransactionTest = {
  id: "makeTransaction",
  name: "makeTransaction",
  tag: "interactive",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    const senderHash = accounts[0].hash;
    const signers = [{ account: senderHash, scopes: "CalledByEntry" }];
    const context = await provider.makeTransaction(
      [
        {
          hash: GAS,
          operation: "transfer",
          args: [
            { type: "Hash160", value: senderHash },
            { type: "Hash160", value: senderHash },
            { type: "Integer", value: 1 },
            { type: "String", value: "321" },
          ],
        },
      ],
      signers,
    );

    assert(context && typeof context === "object", "expected object response");
    assert(
      context.type === "Neo.Network.P2P.Payloads.Transaction",
      'context.type must be "Neo.Network.P2P.Payloads.Transaction", got ' +
        toJson(context.type),
    );
    assert(
      typeof context.hash === "string" && context.hash.length > 0,
      "context.hash must be non-empty string",
    );
    assert(
      context.hash.startsWith("0x"),
      'context.hash must start with "0x", got ' + toJson(context.hash),
    );
    assert(
      typeof context.data === "string" && context.data.length > 0,
      "context.data must be non-empty string",
    );
    assert(
      /^[A-Za-z0-9+/]*={0,2}$/.test(context.data),
      "context.data must be valid base64",
    );

    assert(
      context.items && typeof context.items === "object",
      "context.items must be object",
    );
    const itemKeys = Object.keys(context.items);
    assert(
      itemKeys.length === signers.length,
      "context.items must have the same number of entries as signers",
    );
    for (const key of itemKeys) {
      const item = context.items[key];
      assert(
        key === senderHash,
        "context.items[" + key + "] must be equal to senderHash",
      );
      assert(
        typeof item === "object" && item !== null,
        "context.items[" + key + "] must be object",
      );
      assert(
        typeof item.script === "string" && item.script.length === 0,
        "context.items[" + key + "].script must be empty string",
      );
      assert(
        Array.isArray(item.parameters) && item.parameters.length === 0,
        "context.items[" + key + "].parameters must be array",
      );
      assert(
        typeof item.signatures === "object" &&
          Object.keys(item.signatures).length === 0,
        "context.items[" + key + "].signatures must be object",
      );
    }
    assert(
      typeof context.network === "number",
      "context.network must be number, got " + typeof context.network,
    );

    return context;
  },
};

const signTest = {
  id: "sign",
  name: "sign",
  tag: "interactive",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    const senderHash = accounts[0].hash;
    const signers = [{ account: senderHash, scopes: "CalledByEntry" }];

    const context = await provider.makeTransaction(
      [
        {
          hash: GAS,
          operation: "transfer",
          args: [
            { type: "Hash160", value: senderHash },
            { type: "Hash160", value: senderHash },
            { type: "Integer", value: 1 },
            { type: "String", value: "321" },
          ],
        },
      ],
      signers,
    );

    const signedContext = await provider.sign(context);

    assert(
      signedContext && typeof signedContext === "object",
      "expected object response",
    );
    assert(
      signedContext.type === "Neo.Network.P2P.Payloads.Transaction",
      'signedContext.type must be "Neo.Network.P2P.Payloads.Transaction", got ' +
        toJson(signedContext.type),
    );
    assert(
      signedContext.hash === context.hash,
      "signedContext.hash must match original context hash",
    );
    assert(
      typeof signedContext.data === "string" && signedContext.data.length > 0,
      "signedContext.data must be non-empty string",
    );
    assert(
      /^[A-Za-z0-9+/]*={0,2}$/.test(signedContext.data),
      "signedContext.data must be valid base64",
    );

    assert(
      signedContext.items && typeof signedContext.items === "object",
      "signedContext.items must be object",
    );
    const itemKeys = Object.keys(signedContext.items);
    assert(
      itemKeys.length === signers.length,
      "signedContext.items must have at least one entry",
    );
    for (const key of itemKeys) {
      const item = signedContext.items[key];

      assert(
        key === senderHash,
        "context.items[" + key + "] must be equal to senderHash",
      );
      assert(
        typeof item.script === "string" && item.script.length > 0,
        "context.items[" + key + "].script must be non-empty string",
      );
      assert(
        /^[A-Za-z0-9+/]*={0,2}$/.test(item.script),
        "context.items[" + key + "].script must be valid base64",
      );

      assert(
        Array.isArray(item.parameters),
        "context.items[" + key + "].parameters must be array",
      );
      const signatureParameters = item.parameters.find(
        (parameter) => parameter.type === "Signature",
      );
      assert(
        typeof signatureParameters.value === "string" &&
          signatureParameters.value.length > 0,
        "context.items[" +
          key +
          "].parameters must have at least one signature",
      );
      assert(
        /^[A-Za-z0-9+/]*={0,2}$/.test(signatureParameters.value),
        "context.items[" +
          key +
          "].parameters must have at least one signature",
      );

      assert(
        typeof item.signatures === "object" && item.signatures !== null,
        "signedContext.items[" + key + "].signatures must be object",
      );
      const signatureKeys = Object.keys(item.signatures);
      assert(
        signatureKeys.length > 0,
        "signedContext.items[" +
          key +
          "].signatures must have at least one signature",
      );
      for (const pubkey of signatureKeys) {
        assert(
          /^[A-Za-z0-9+/]*={0,2}$/.test(item.signatures[pubkey]),
          "signature for pubkey " + pubkey + " must be valid base64",
        );
      }
    }
    assert(
      typeof signedContext.network === "number",
      "signedContext.network must be number, got " +
        typeof signedContext.network,
    );

    return signedContext;
  },
};

const relayTest = {
  id: "relay",
  name: "relay",
  tag: "interactive",
  fn: async (provider) => {
    const accounts = await provider.getAccounts();
    assert(
      Array.isArray(accounts) && accounts.length > 0,
      "no connected accounts — connect an account in the wallet first",
    );

    const senderHash = accounts[0].hash;

    const context = await provider.makeTransaction(
      [
        {
          hash: GAS,
          operation: "transfer",
          args: [
            { type: "Hash160", value: senderHash },
            { type: "Hash160", value: senderHash },
            { type: "Integer", value: 1 },
            { type: "String", value: "321" },
          ],
        },
      ],
      [{ account: accounts[0].hash, scopes: "CalledByEntry" }],
    );
    const signedContext = await provider.sign(context);
    const txid = await provider.relay(signedContext);

    assert(
      typeof txid === "string" && txid.length > 0,
      "expected non-empty string txid, got " + typeof txid,
    );
    assert(
      txid.startsWith("0x"),
      'txid must start with "0x", got ' + toJson(txid),
    );
    assert(
      txid.length === 66,
      "txid must be 66 characters (0x + 64 hex), got length " + txid.length,
    );

    return txid;
  },
};

// ── Groups ────────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    id: "ia",
    title: "Tests",
    tests: [
      authenticateTest,
      getAccountsTest,
      callTest,
      getBalanceTest,
      getBlockCountTest,
      getBlockTest,
      getStorageTest,
      getTokenInfoTest,
      getTransactionTest,
      getApplicationLogTest,
      invokeTest,
      sendTest,
      signMessageTest,
      makeTransactionTest,
      signTest,
      relayTest,
    ],
  },
];
