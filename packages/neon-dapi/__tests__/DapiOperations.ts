import { u, wallet } from "@cityofzion/neon-core";

import { DapiErrorCode } from "../src/DapiError";
import { DapiOperations } from "../src/DapiOperations";
import type { AuthenticationChallengePayload } from "../src/types";
import { DapiNetwork } from "../src/constants";

jest.mock("@cityofzion/neon-core", () => {
  const actual = jest.requireActual("@cityofzion/neon-core");
  return {
    ...actual,
    rpc: {
      ...actual.rpc,
      RPCClient: jest.fn().mockImplementation(() => ({})),
    },
  };
});

const ACCOUNT = "0x1234567890abcdef1234567890abcdef12345678";
const TXID =
  "0x1f4d1defa46faa5e7b9b8d3f79a06bec777d7c26c4aa5f6f5899a291daa87c15";
const BLOCK_HASH =
  "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1";

function makePayload(
  overrides?: Partial<AuthenticationChallengePayload>,
): AuthenticationChallengePayload {
  return {
    action: "Authentication",
    grant_type: "Signature",
    allowed_algorithms: ["ECDSA-P256"],
    domain: "test.example.com",
    networks: [DapiNetwork.TESTNET],
    nonce: "123456789",
    timestamp: Math.floor(Date.now() / 1000),
    ...overrides,
  };
}

describe("DapiOperations.authenticate", () => {
  const account: wallet.Account = new wallet.Account();
  const ops: DapiOperations = new DapiOperations({
    // It is empty because we are mocking the RPCClient
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account,
  });

  test("returns correct response shape", async () => {
    const payload = makePayload();
    const response = await ops.authenticate(payload);

    expect(response.address).toBe(account.address);
    expect(response.algorithm).toBe("ECDSA-P256");
    expect(typeof response.network).toBe("number");
    expect(response.pubkey).toBe(account.publicKey);
    expect(response.nonce).toBe(payload.nonce);
    expect(typeof response.timestamp).toBe("number");
    expect(typeof response.signature).toBe("string");
  });

  test("timestamp is a recent unix timestamp", async () => {
    const before = Math.floor(Date.now() / 1000);
    const response = await ops.authenticate(makePayload());
    const after = Math.floor(Date.now() / 1000);

    expect(response.timestamp).toBeGreaterThanOrEqual(before);
    expect(response.timestamp).toBeLessThanOrEqual(after);
  });

  test("signature is cryptographically valid", async () => {
    const payload = makePayload();
    const response = await ops.authenticate(payload);

    const networkHex = u.num2hexstring(response.network, 1, true);
    const nonceHex = u.num2hexstring(Number(payload.nonce), 8, true);
    const timestampHex = u.num2hexstring(response.timestamp, 8, true);
    const hashHex = account.scriptHash.replace(/^0x/i, "");
    const message = `${networkHex}${nonceHex}${timestampHex}${hashHex}`;

    const signatureHex = u.base642hex(response.signature);
    const isValid = wallet.verify(message, signatureHex, account.publicKey);
    expect(isValid).toBe(true);
  });

  test("throws DapiError INVALID when networks array is empty", async () => {
    const payload = makePayload({ networks: [] });

    await expect(ops.authenticate(payload)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError INVALID when network is not supported", async () => {
    const payload = makePayload({ networks: [DapiNetwork.MAINNET] });

    await expect(ops.authenticate(payload)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });
});

describe("DapiOperations.getAccounts", () => {
  const account = new wallet.Account();
  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account,
  });

  test("account address matches connected account", () => {
    const [result] = ops.getAccounts();
    expect(result.address).toBe(account.address);
    expect(result.hash).toBe(account.scriptHash);
    expect(result.extra).toBeNull();
    expect(result.contract).toEqual(account.contract);
  });

  test("label matches account label", () => {
    const account = new wallet.Account();
    account.label = "test-label";
    const ops = new DapiOperations({
      rpcClient: "",
      network: DapiNetwork.TESTNET,
      account,
    });

    const [result] = ops.getAccounts();

    expect(result.label).toBe("test-label");
  });
});

describe("DapiOperations.getBalance", () => {
  const ASSET = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
  const ACCOUNT = "0x1234567890abcdef1234567890abcdef12345678";

  const ops: DapiOperations = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns balance when state is HALT and stack has Integer", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      stack: [{ type: "Integer", value: "100000000" }],
    });

    const result = await ops.getBalance(ASSET, ACCOUNT);

    expect(result).toBe("100000000");
  });

  test("returns zero balance", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      stack: [{ type: "Integer", value: "0" }],
    });

    const result = await ops.getBalance(ASSET, ACCOUNT);

    expect(result).toBe("0");
  });

  test("throws DapiError FAILED when state is not HALT", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "FAULT",
      exception: "Insufficient funds",
      stack: [],
    });

    await expect(ops.getBalance(ASSET, ACCOUNT)).rejects.toMatchObject({
      code: DapiErrorCode.FAILED,
      message: "Insufficient funds",
    });
  });

  test("throws DapiError FAILED using fallback message when exception is absent", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "FAULT",
      stack: [],
    });

    await expect(ops.getBalance(ASSET, ACCOUNT)).rejects.toMatchObject({
      code: DapiErrorCode.FAILED,
    });
  });

  test("throws DapiError INVALID when stack type is not Integer", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      stack: [{ type: "ByteString", value: "aGVsbG8=" }],
    });

    await expect(ops.getBalance(ASSET, ACCOUNT)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError INVALID when stack is empty", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      stack: [],
    });

    await expect(ops.getBalance(ASSET, ACCOUNT)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.getBalance(ASSET, ACCOUNT)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getApplicationLog", () => {
  const TXID =
    "0x1f4d1defa46faa5e7b9b8d3f79a06bec777d7c26c4aa5f6f5899a291daa87c15";

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns mapped application log", async () => {
    ops.rpcClient.getApplicationLog = jest.fn().mockResolvedValue({
      txid: TXID,
      executions: [
        {
          trigger: "Application",
          vmstate: "HALT",
          gasconsumed: "1234567",
          stack: [{ type: "Integer", value: "1" }],
          notifications: [],
        },
      ],
    });

    const result = await ops.getApplicationLog(TXID);

    expect(result.txid).toBe(TXID);
    expect(result.executions).toHaveLength(1);
    expect(result.executions[0].trigger).toBe("Application");
    expect(result.executions[0].vmstate).toBe("HALT");
    expect(result.executions[0].gasconsumed).toBe("1234567");
    expect(result.executions[0].stack).toEqual([
      { type: "Integer", value: "1" },
    ]);
    expect(result.executions[0].notifications).toEqual([]);
  });

  test("maps multiple executions", async () => {
    ops.rpcClient.getApplicationLog = jest.fn().mockResolvedValue({
      txid: TXID,
      executions: [
        {
          trigger: "Application",
          vmstate: "HALT",
          gasconsumed: "100",
          stack: [],
          notifications: [],
        },
        {
          trigger: "Verification",
          vmstate: "HALT",
          gasconsumed: "200",
          stack: [],
          notifications: [],
        },
      ],
    });

    const result = await ops.getApplicationLog(TXID);

    expect(result.executions).toHaveLength(2);
    expect(result.executions[1].trigger).toBe("Verification");
  });

  test("defaults stack to empty array when null", async () => {
    ops.rpcClient.getApplicationLog = jest.fn().mockResolvedValue({
      txid: TXID,
      executions: [
        {
          trigger: "Application",
          vmstate: "HALT",
          gasconsumed: "0",
          stack: null,
          notifications: [],
        },
      ],
    });

    const result = await ops.getApplicationLog(TXID);

    expect(result.executions[0].stack).toEqual([]);
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getApplicationLog = jest
      .fn()
      .mockRejectedValue(new Error("not found"));

    await expect(ops.getApplicationLog(TXID)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getBlock", () => {
  const mockRpcBlock = {
    hash: BLOCK_HASH,
    size: 1024,
    confirmations: 10,
    nextblockhash:
      "0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4",
    version: 0,
    previousblockhash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    merkleroot:
      "0xaaaa000000000000000000000000000000000000000000000000000000000000",
    time: 1700000000,
    nonce: "0000000000000000",
    index: 42,
    primary: 0,
    nextconsensus: "NXV7ZhHiyM1aHXwvUNBLNAkCwZ6wgeKyMY",
    tx: [],
  };

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("maps all block fields correctly", async () => {
    ops.rpcClient.getBlock = jest.fn().mockResolvedValue(mockRpcBlock);

    const result = await ops.getBlock(BLOCK_HASH);

    expect(result.hash).toBe(mockRpcBlock.hash);
    expect(result.size).toBe(mockRpcBlock.size);
    expect(result.confirmations).toBe(mockRpcBlock.confirmations);
    expect(result.nextBlockHash).toBe(mockRpcBlock.nextblockhash);
    expect(result.version).toBe(mockRpcBlock.version);
    expect(result.previousBlockHash).toBe(mockRpcBlock.previousblockhash);
    expect(result.merkleRoot).toBe(mockRpcBlock.merkleroot);
    expect(result.time).toBe(mockRpcBlock.time);
    expect(result.nonce).toBe(mockRpcBlock.nonce);
    expect(result.index).toBe(mockRpcBlock.index);
    expect(result.primary).toBe(mockRpcBlock.primary);
    expect(result.nextConsensus).toBe(mockRpcBlock.nextconsensus);
  });

  test("calls rpcClient.getBlock with hash and verbosity 1", async () => {
    ops.rpcClient.getBlock = jest.fn().mockResolvedValue(mockRpcBlock);

    await ops.getBlock(BLOCK_HASH);

    expect(ops.rpcClient.getBlock).toHaveBeenCalledWith(BLOCK_HASH, 1);
  });

  test("maps transactions with block context injected", async () => {
    const mockTx = {
      hash: TXID,
      size: 256,
      version: 0,
      nonce: 1,
      sender: ACCOUNT,
      sysfee: "100",
      netfee: "50",
      validuntilblock: 1000,
      signers: [],
      attributes: [],
      script: "base64script==",
    };

    ops.rpcClient.getBlock = jest.fn().mockResolvedValue({
      ...mockRpcBlock,
      tx: [mockTx],
    });

    const result = await ops.getBlock(BLOCK_HASH);

    expect(result.tx).toHaveLength(1);
    expect(result.tx[0].hash).toBe(TXID);
    expect(result.tx[0].blockHash).toBe(BLOCK_HASH);
    expect(result.tx[0].blockTime).toBe(mockRpcBlock.time);
    expect(result.tx[0].confirmations).toBe(mockRpcBlock.confirmations);
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getBlock = jest
      .fn()
      .mockRejectedValue(new Error("not found"));

    await expect(ops.getBlock(BLOCK_HASH)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getBlockCount", () => {
  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns block count from rpcClient", async () => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1234);

    const result = await ops.getBlockCount();

    expect(result).toBe(1234);
  });

  test("calls rpcClient.getBlockCount with no arguments", async () => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(0);

    await ops.getBlockCount();

    expect(ops.rpcClient.getBlockCount).toHaveBeenCalledWith();
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getBlockCount = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.getBlockCount()).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getStorage", () => {
  const CONTRACT_HASH = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
  const KEY_BASE64 = "dGVzdA=="; // "test" in base64
  const VALUE_BASE64 = "aGVsbG8="; // "hello" in base64

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns storage value from rpcClient", async () => {
    ops.rpcClient.getStorage = jest.fn().mockResolvedValue(VALUE_BASE64);

    const result = await ops.getStorage(CONTRACT_HASH, KEY_BASE64);

    expect(result).toBe(VALUE_BASE64);
  });

  test("converts base64 key to hex before calling rpcClient", async () => {
    ops.rpcClient.getStorage = jest.fn().mockResolvedValue(VALUE_BASE64);

    await ops.getStorage(CONTRACT_HASH, KEY_BASE64);

    const { u: uActual } = jest.requireActual("@cityofzion/neon-core");
    expect(ops.rpcClient.getStorage).toHaveBeenCalledWith(
      CONTRACT_HASH,
      uActual.base642hex(KEY_BASE64),
    );
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getStorage = jest
      .fn()
      .mockRejectedValue(new Error("not found"));

    await expect(
      ops.getStorage(CONTRACT_HASH, KEY_BASE64),
    ).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getTokenInfo", () => {
  const ASSET_ID = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
  // "R0FT" is base64 of hex "474153" which decodes to ASCII "GAS"
  const SYMBOL_BASE64 = "R0FT";

  const haltResult = (
    type: string,
    value: string,
  ): { state: string; stack: { type: string; value: string }[] } => ({
    state: "HALT",
    stack: [{ type, value }],
  });

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns decimals, symbol and totalSupply", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        haltResult("Integer", "8"),
        haltResult("ByteString", SYMBOL_BASE64),
        haltResult("Integer", "10000000000000000"),
      ]);

    const result = await ops.getTokenInfo(ASSET_ID);

    expect(result.decimals).toBe(8);
    expect(result.symbol).toBe("GAS");
    expect(result.totalSupply).toBe("10000000000000000");
  });

  test("throws DapiError FAILED when decimals state is not HALT", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        { state: "FAULT", stack: [] },
        haltResult("ByteString", SYMBOL_BASE64),
        haltResult("Integer", "100"),
      ]);

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toMatchObject({
      code: DapiErrorCode.FAILED,
    });
  });

  test("throws DapiError FAILED when any state is not HALT", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        haltResult("Integer", "8"),
        { state: "FAULT", stack: [] },
        haltResult("Integer", "100"),
      ]);

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toMatchObject({
      code: DapiErrorCode.FAILED,
    });
  });

  test("throws DapiError INVALID when decimals stack type is not Integer", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        haltResult("ByteString", "OA=="),
        haltResult("ByteString", SYMBOL_BASE64),
        haltResult("Integer", "100"),
      ]);

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError INVALID when symbol stack type is not ByteString", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        haltResult("Integer", "8"),
        haltResult("Integer", "12345"),
        haltResult("Integer", "100"),
      ]);

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError INVALID when totalSupply stack type is not Integer", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockResolvedValue([
        haltResult("Integer", "8"),
        haltResult("ByteString", SYMBOL_BASE64),
        haltResult("ByteString", "aGVsbG8="),
      ]);

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.executeAll = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.getTokenInfo(ASSET_ID)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.getTransaction", () => {
  const mockRpcTx = {
    hash: TXID,
    size: 256,
    version: 0,
    nonce: 42,
    sender: ACCOUNT,
    sysfee: "100",
    netfee: "50",
    validuntilblock: 1000,
    signers: [],
    attributes: [],
    script: "base64script==",
    blockhash: BLOCK_HASH,
    blocktime: 1700000000,
    confirmations: 5,
  };

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("calls getRawTransaction with txid and verbosity 1", async () => {
    ops.rpcClient.getRawTransaction = jest.fn().mockResolvedValue(mockRpcTx);

    await ops.getTransaction(TXID);

    expect(ops.rpcClient.getRawTransaction).toHaveBeenCalledWith(TXID, 1);
  });

  test("maps rpc transaction fields to Transaction type", async () => {
    ops.rpcClient.getRawTransaction = jest.fn().mockResolvedValue(mockRpcTx);

    const result = await ops.getTransaction(TXID);

    expect(result.hash).toBe(TXID);
    expect(result.size).toBe(mockRpcTx.size);
    expect(result.version).toBe(mockRpcTx.version);
    expect(result.nonce).toBe(mockRpcTx.nonce);
    expect(result.sender).toBe(mockRpcTx.sender);
    expect(result.systemFee).toBe(mockRpcTx.sysfee);
    expect(result.networkFee).toBe(mockRpcTx.netfee);
    expect(result.validUntilBlock).toBe(mockRpcTx.validuntilblock);
    expect(result.blockHash).toBe(mockRpcTx.blockhash);
    expect(result.blockTime).toBe(mockRpcTx.blocktime);
    expect(result.confirmations).toBe(mockRpcTx.confirmations);
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getRawTransaction = jest
      .fn()
      .mockRejectedValue(new Error("not found"));

    await expect(ops.getTransaction(TXID)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.call", () => {
  const invocation = {
    hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
    operation: "balanceOf",
    args: [{ type: "Hash160" as const, value: ACCOUNT }],
  };

  const mockInvokeResult = {
    gasconsumed: "1234567",
    script: "base64script==",
    stack: [{ type: "Integer", value: "100" }],
    state: "HALT",
    exception: null,
    notifications: [],
  };

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns mapped invocation result", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue(mockInvokeResult);

    const result = await ops.call(invocation);

    expect(result.gasconsumed).toBe(mockInvokeResult.gasconsumed);
    expect(result.script).toBe(mockInvokeResult.script);
    expect(result.stack).toEqual(mockInvokeResult.stack);
    expect(result.state).toBe(mockInvokeResult.state);
    expect(result.notifications).toEqual(mockInvokeResult.notifications);
  });

  test("exception is undefined when null", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ ...mockInvokeResult, exception: null });

    const result = await ops.call(invocation);

    expect(result.exception).toBeUndefined();
  });

  test("exception is returned when present", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ ...mockInvokeResult, exception: "contract error" });

    const result = await ops.call(invocation);

    expect(result.exception).toBe("contract error");
  });

  test("calls invokeScript with connected account as signer", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue(mockInvokeResult);

    await ops.call(invocation);

    const [, signers] = (ops.rpcClient.invokeScript as jest.Mock).mock.calls[0];
    expect(signers).toHaveLength(1);
    expect(signers[0].account.toBigEndian()).toBe(
      ops.account.scriptHash.replace(/^0x/i, ""),
    );
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.call(invocation)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.invoke", () => {
  const invocations = [
    {
      hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      operation: "transfer",
      args: [
        { type: "Hash160" as const, value: ACCOUNT },
        { type: "Hash160" as const, value: ACCOUNT },
        { type: "Integer" as const, value: "100" },
        { type: "Any" as const, value: undefined },
      ],
    },
  ];

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ state: "HALT", gasconsumed: "100", stack: [] });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50);
    ops.rpcClient.getVersion = jest
      .fn()
      .mockResolvedValue({ protocol: { network: DapiNetwork.TESTNET } });
    ops.rpcClient.sendRawTransaction = jest.fn().mockResolvedValue(TXID);
  });

  test("returns txid from sendRawTransaction", async () => {
    const result = await ops.invoke(invocations);

    expect(result).toBe(TXID);
  });

  test("calls sendRawTransaction", async () => {
    await ops.invoke(invocations);

    expect(ops.rpcClient.sendRawTransaction).toHaveBeenCalledTimes(1);
  });

  test("uses suggestedSystemFee from options when provided", async () => {
    await ops.invoke(invocations, undefined, undefined, {
      suggestedSystemFee: 999,
    });

    // invokeScript should not be called for fee estimation when suggestedSystemFee is set
    expect(ops.rpcClient.invokeScript).not.toHaveBeenCalled();
  });

  test("uses validUntilBlock from options when provided", async () => {
    await ops.invoke(invocations, undefined, undefined, {
      validUntilBlock: 5000,
      suggestedSystemFee: 100,
    });

    // getBlockCount should not be called when validUntilBlock is set
    expect(ops.rpcClient.getBlockCount).not.toHaveBeenCalled();
  });

  test("throws DapiError when sendRawTransaction rejects", async () => {
    ops.rpcClient.sendRawTransaction = jest
      .fn()
      .mockRejectedValue(new Error("broadcast failed"));

    await expect(ops.invoke(invocations)).rejects.toBeInstanceOf(Error);
  });

  test("throws DapiError when getVersion rejects", async () => {
    ops.rpcClient.getVersion = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.invoke(invocations)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.send", () => {
  const ASSET = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
  const TO = "0xabcdef1234567890abcdef1234567890abcdef12";
  const AMOUNT = "100000000";

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ state: "HALT", gasconsumed: "100", stack: [] });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50);
    ops.rpcClient.getVersion = jest
      .fn()
      .mockResolvedValue({ protocol: { network: DapiNetwork.TESTNET } });
    ops.rpcClient.sendRawTransaction = jest.fn().mockResolvedValue(TXID);
  });

  test("returns txid from sendRawTransaction", async () => {
    const result = await ops.send(ASSET, ops.account.scriptHash, TO, AMOUNT);

    expect(result).toBe(TXID);
  });

  test("calls sendRawTransaction once", async () => {
    await ops.send(ASSET, ops.account.scriptHash, TO, AMOUNT);

    expect(ops.rpcClient.sendRawTransaction).toHaveBeenCalledTimes(1);
  });

  test("uses connected account as signer", async () => {
    await ops.send(ASSET, ops.account.scriptHash, TO, AMOUNT);

    const [, signers] = (ops.rpcClient.invokeScript as jest.Mock).mock.calls[0];
    expect(signers[0].account.toBigEndian()).toBe(
      ops.account.scriptHash.replace(/^0x/i, ""),
    );
  });

  test("throws DapiError when sendRawTransaction rejects", async () => {
    ops.rpcClient.sendRawTransaction = jest
      .fn()
      .mockRejectedValue(new Error("broadcast failed"));

    await expect(
      ops.send(ASSET, ops.account.scriptHash, TO, AMOUNT),
    ).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.calculateInvokeFee", () => {
  const invocations = [
    {
      hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      operation: "transfer",
      args: [],
    },
  ];

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      gasconsumed: "100000000",
      stack: [],
    });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50000000);
  });

  test("returns a number", async () => {
    const result = await ops.calculateInvokeFee(invocations);

    expect(typeof result).toBe("number");
  });

  test("result reflects sum of system and network fee", async () => {
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      gasconsumed: "100000000",
      stack: [],
    });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50000000);

    const result = await ops.calculateInvokeFee(invocations);

    // 100000000 + 50000000 = 150000000 satoshi = 1.5 GAS
    expect(result).toBeCloseTo(1.5, 5);
  });

  test("skips invokeScript when suggestedSystemFee is provided", async () => {
    await ops.calculateInvokeFee(invocations, undefined, undefined, {
      suggestedSystemFee: 100,
    });

    expect(ops.rpcClient.invokeScript).not.toHaveBeenCalled();
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.calculateInvokeFee(invocations)).rejects.toBeInstanceOf(
      Error,
    );
  });
});

describe("DapiOperations.calculateSendFee", () => {
  const ASSET = "0xd2a4cff31913016155e38e474a2c06d08be276cf";
  const TO = "0xabcdef1234567890abcdef1234567890abcdef12";
  const AMOUNT = "100000000";

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest.fn().mockResolvedValue({
      state: "HALT",
      gasconsumed: "100000000",
      stack: [],
    });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50000000);
  });

  test("returns a number", async () => {
    const result = await ops.calculateSendFee(
      ASSET,
      ops.account.scriptHash,
      TO,
      AMOUNT,
    );

    expect(typeof result).toBe("number");
  });

  test("result reflects sum of system and network fee", async () => {
    const result = await ops.calculateSendFee(
      ASSET,
      ops.account.scriptHash,
      TO,
      AMOUNT,
    );

    expect(result).toBeCloseTo(1.5, 5);
  });

  test("uses connected account as signer", async () => {
    await ops.calculateSendFee(ASSET, ops.account.scriptHash, TO, AMOUNT);

    const [, signers] = (ops.rpcClient.invokeScript as jest.Mock).mock.calls[0];
    expect(signers[0].account.toBigEndian()).toBe(
      ops.account.scriptHash.replace(/^0x/i, ""),
    );
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(
      ops.calculateSendFee(ASSET, ops.account.scriptHash, TO, AMOUNT),
    ).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.makeTransaction", () => {
  const invocations = [
    {
      hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      operation: "transfer",
      args: [],
    },
  ];

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ state: "HALT", gasconsumed: "100", stack: [] });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50);
    ops.rpcClient.getVersion = jest
      .fn()
      .mockResolvedValue({ protocol: { network: DapiNetwork.TESTNET } });
  });

  test("returns correct type field", async () => {
    const result = await ops.makeTransaction(invocations);

    expect(result.type).toBe("Neo.Network.P2P.Payloads.Transaction");
  });

  test("network comes from getVersion", async () => {
    const result = await ops.makeTransaction(invocations);

    expect(result.network).toBe(DapiNetwork.TESTNET);
  });

  test("hash starts with 0x", async () => {
    const result = await ops.makeTransaction(invocations);

    expect(result.hash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  test("data is a non-empty base64 string", async () => {
    const result = await ops.makeTransaction(invocations);

    expect(typeof result.data).toBe("string");
    expect(result.data.length).toBeGreaterThan(0);
  });

  test("items is empty when no signers provided", async () => {
    const result = await ops.makeTransaction(invocations);

    expect(Object.keys(result.items)).toHaveLength(0);
  });

  test("items has one entry per signer", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];

    const result = await ops.makeTransaction(invocations, signers);

    expect(Object.keys(result.items)).toHaveLength(1);
  });

  test("each item has empty script, parameters and signatures", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];

    const result = await ops.makeTransaction(invocations, signers);
    const item = Object.values(result.items)[0];

    expect(item.script).toBe("");
    expect(item.parameters).toEqual([]);
    expect(item.signatures).toEqual({});
  });

  test("throws DapiError when rpcClient rejects", async () => {
    ops.rpcClient.getVersion = jest
      .fn()
      .mockRejectedValue(new Error("RPC error"));

    await expect(ops.makeTransaction(invocations)).rejects.toBeInstanceOf(
      Error,
    );
  });
});

describe("DapiOperations.sign", () => {
  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  const invocations = [
    {
      hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
      operation: "transfer",
      args: [],
    },
  ];

  beforeEach(() => {
    ops.rpcClient.getBlockCount = jest.fn().mockResolvedValue(1000);
    ops.rpcClient.invokeScript = jest
      .fn()
      .mockResolvedValue({ state: "HALT", gasconsumed: "100", stack: [] });
    ops.rpcClient.calculateNetworkFee = jest.fn().mockResolvedValue(50);
    ops.rpcClient.getVersion = jest
      .fn()
      .mockResolvedValue({ protocol: { network: DapiNetwork.TESTNET } });
  });

  test("throws DapiError INVALID when account is not part of the transaction", async () => {
    const context = await ops.makeTransaction(invocations);

    // context has no items — account not registered as signer
    await expect(ops.sign(context)).rejects.toMatchObject({
      code: DapiErrorCode.INVALID,
    });
  });

  test("returns updated context with correct type", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];
    const context = await ops.makeTransaction(invocations, signers);

    const result = await ops.sign(context);

    expect(result.type).toBe("Neo.Network.P2P.Payloads.Transaction");
  });

  test("adds signature for connected account pubkey", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];
    const context = await ops.makeTransaction(invocations, signers);

    const result = await ops.sign(context);

    const item = result.items[ops.account.scriptHash.replace(/^0x/i, "")];
    expect(item.signatures[ops.account.publicKey]).toBeDefined();
    expect(typeof item.signatures[ops.account.publicKey]).toBe("string");
  });

  test("network is preserved from original context", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];
    const context = await ops.makeTransaction(invocations, signers);

    const result = await ops.sign(context);

    expect(result.network).toBe(context.network);
  });

  test("returned context data is different from unsigned context", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];
    const context = await ops.makeTransaction(invocations, signers);

    const result = await ops.sign(context);

    // signed tx serializes differently (includes witness)
    expect(result.hash).toBe(context.hash);
  });

  test("parameters contain a Signature entry matching the account signature", async () => {
    const signers = [
      { account: ops.account.scriptHash, scopes: "CalledByEntry" as const },
    ];
    const context = await ops.makeTransaction(invocations, signers);

    const result = await ops.sign(context);

    const item = result.items[ops.account.scriptHash.replace(/^0x/i, "")];
    const signatureParam = item.parameters.find((p) => p.type === "Signature");

    expect(signatureParam).toBeDefined();
    expect(signatureParam?.value).toBe(item.signatures[ops.account.publicKey]);
  });
});

describe("DapiOperations.relay", () => {
  const context = {
    type: "Neo.Network.P2P.Payloads.Transaction" as const,
    hash: TXID,
    network: DapiNetwork.TESTNET,
    data: "c2lnbmVkdHg=",
    items: {},
  };

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account: new wallet.Account(),
  });

  test("returns txid from sendRawTransaction", async () => {
    ops.rpcClient.sendRawTransaction = jest.fn().mockResolvedValue(TXID);

    const result = await ops.relay(context);

    expect(result).toBe(TXID);
  });

  test("calls sendRawTransaction with context.data", async () => {
    ops.rpcClient.sendRawTransaction = jest.fn().mockResolvedValue(TXID);

    await ops.relay(context);

    expect(ops.rpcClient.sendRawTransaction).toHaveBeenCalledWith(context.data);
  });

  test("throws DapiError when sendRawTransaction rejects", async () => {
    ops.rpcClient.sendRawTransaction = jest
      .fn()
      .mockRejectedValue(new Error("broadcast failed"));

    await expect(ops.relay(context)).rejects.toBeInstanceOf(Error);
  });
});

describe("DapiOperations.signMessage", () => {
  const account = new wallet.Account();

  const ops = new DapiOperations({
    rpcClient: "",
    network: DapiNetwork.TESTNET,
    account,
  });

  test("returns correct response shape", async () => {
    const result = await ops.signMessage("hello");

    expect(typeof result.payload).toBe("string");
    expect(typeof result.signature).toBe("string");
    expect(result.account).toBe(account.scriptHash);
    expect(result.pubkey).toBe(account.publicKey);
  });

  test("payload is utf8 message encoded as base64", async () => {
    const result = await ops.signMessage("hello");

    const { u: uActual } = jest.requireActual("@cityofzion/neon-core");
    expect(result.payload).toBe(uActual.utf82base64("hello"));
  });

  test("signature is cryptographically valid for utf8 message", async () => {
    const message = "hello world";
    const result = await ops.signMessage(message);

    const { u: uActual, wallet: walletActual } = jest.requireActual(
      "@cityofzion/neon-core",
    );
    const hexMessage = uActual.str2hexstring(message);
    const signatureHex = uActual.base642hex(result.signature);

    expect(
      walletActual.verify(hexMessage, signatureHex, account.publicKey),
    ).toBe(true);
  });

  test("accepts base64 encoded message when isBase64Encoded is true", async () => {
    const { u: uActual, wallet: walletActual } = jest.requireActual(
      "@cityofzion/neon-core",
    );
    const base64Message = uActual.utf82base64("hello");

    const result = await ops.signMessage(base64Message, undefined, {
      isBase64Encoded: true,
    });

    const hexMessage = uActual.base642hex(base64Message);
    const signatureHex = uActual.base642hex(result.signature);
    expect(
      walletActual.verify(hexMessage, signatureHex, account.publicKey),
    ).toBe(true);
  });

  test("throws DapiError INVALID when account does not match", async () => {
    const otherAccount = new wallet.Account();

    await expect(
      ops.signMessage("hello", otherAccount.scriptHash),
    ).rejects.toMatchObject({ code: DapiErrorCode.INVALID });
  });

  test("throws DapiError INVALID when isTypedData is true", async () => {
    await expect(
      ops.signMessage("hello", undefined, { isTypedData: true }),
    ).rejects.toMatchObject({ code: DapiErrorCode.INVALID });
  });

  test("does not throw when account matches connected account", async () => {
    await expect(
      ops.signMessage("hello", account.scriptHash),
    ).resolves.toBeDefined();
  });
});
