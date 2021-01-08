import {
  ContractManifest,
  ContractManifestLike,
  ContractParamType,
  ContractPermissionJson,
} from "../../../src/sc";

const defaultManifestLike: ContractManifestLike = {
  name: undefined,
  supportedStandards: [],
  abi: {
    events: [],
    hash: "",
    methods: [],
  },
  features: {
    payable: false,
    storage: false,
  },
  groups: [],
  permissions: [],
  safeMethods: "*",
  trusts: "*",
  extra: undefined,
};

const definedManifestLike: ContractManifestLike = {
  supportedStandards: ["NEP-5"],
  abi: {
    events: [
      {
        name: "transfer",
        parameters: [
          {
            name: "from",
            type: ContractParamType.Hash160,
          },
          {
            name: "to",
            type: ContractParamType.Hash160,
          },
          {
            name: "amount",
            type: ContractParamType.Integer,
          },
        ],
      },
    ],
    hash: "43cf98eddbe047e198a3e5d57006311442a0ca15",
    methods: [
      {
        name: "transfer",
        offset: 0,
        parameters: [
          {
            name: "from",
            type: ContractParamType.Hash160,
          },
          {
            name: "to",
            type: ContractParamType.Hash160,
          },
          {
            name: "amount",
            type: ContractParamType.Integer,
          },
        ],
        returnType: ContractParamType.Boolean,
      },
    ],
  },
  features: {
    payable: false,
    storage: false,
  },
  groups: [
    {
      pubKey: "this_is_a_public_key",
      signature: "this_is_a_signature",
    },
  ],
  permissions: [
    {
      contract: "a1760976db5fcdfab2a9930e8f6ce875b2d18225",
      methods: ["balanceOf"],
    },
  ],
  safeMethods: "*",
  trusts: "*",
  extra: "random note",
};

describe("constructor & export", () => {
  test("default", () => {
    const manifest = new ContractManifest({});
    expect(manifest.export()).toStrictEqual(defaultManifestLike);
  });

  test("specified", () => {
    const manifest = new ContractManifest(definedManifestLike);
    expect(manifest.export()).toStrictEqual(definedManifestLike);
  });
});

describe("getter", () => {
  test("hash", () => {
    const manifest = new ContractManifest(definedManifestLike);
    expect(manifest.hash).toBe("43cf98eddbe047e198a3e5d57006311442a0ca15");
  });
});

describe("canCall", () => {
  test("Cannot call according to Hash", () => {
    const manifest1 = new ContractManifest(definedManifestLike);
    const manifest2 = new ContractManifest(definedManifestLike);
    manifest2.abi.hash = "43cf98eddbe047e198a3e5d57006311442a0ca15";
    expect(manifest1.canCall(manifest2, "balanceOf")).toBeFalsy();
  });

  test("Can call according to Hash", () => {
    const manifest1 = new ContractManifest(definedManifestLike);
    const manifest2 = new ContractManifest(definedManifestLike);
    manifest2.abi.hash = "a1760976db5fcdfab2a9930e8f6ce875b2d18225";
    expect(manifest1.canCall(manifest2, "balanceOf")).toBeTruthy();
  });

  test("Cannot call according to Group", () => {
    const manifest1 = new ContractManifest(
      Object.assign({}, definedManifestLike, {
        permissions: [
          {
            contract:
              "03ff12614a7f6f370fb22260061be9da8b320ff33207aa10118b2bb2e717f5159d",
            methods: ["balanceOf"],
          },
        ],
      })
    );
    const manifest2 = new ContractManifest(definedManifestLike);
    expect(manifest1.canCall(manifest2, "balanceOf")).toBeFalsy();
  });

  test("Can call according to Group", () => {
    const manifest1 = new ContractManifest(
      Object.assign({}, definedManifestLike, {
        permissions: [
          {
            contract:
              "03ff12614a7f6f370fb22260061be9da8b320ff33207aa10118b2bb2e717f5159d",
            methods: ["balanceOf"],
          },
        ],
      })
    );
    const manifest2 = new ContractManifest(
      Object.assign({}, definedManifestLike, {
        groups: [
          {
            pubKey:
              "03ff12614a7f6f370fb22260061be9da8b320ff33207aa10118b2bb2e717f5159d",
            signature: "this_is_a_signature",
          },
        ],
      })
    );
    expect(manifest1.canCall(manifest2, "balanceOf")).toBeTruthy();
  });

  test("Can not call according to methods", () => {
    const manifest1 = new ContractManifest(definedManifestLike);
    const manifest2 = new ContractManifest(definedManifestLike);
    manifest2.abi.hash = "a1760976db5fcdfab2a9930e8f6ce875b2d18225";
    expect(manifest1.canCall(manifest2, "name")).toBeFalsy();
  });
});

describe("fromJson", () => {
  test("neo", () => {
    const neoManifestJson = {
      groups: [],
      features: {
        storage: true,
        payable: false,
      },
      supportedstandards: ["NEP-5"],
      abi: {
        hash: "0xde5f57d430d3dece511cf975a8d37848cb9e0525",
        methods: [
          {
            name: "totalSupply",
            parameters: [],
            offset: 0,
            returntype: "Integer",
          },
          {
            name: "onPersist",
            parameters: [],
            offset: 0,
            returntype: "Void",
          },
          {
            name: "unclaimedGas",
            parameters: [
              {
                name: "account",
                type: "ByteArray",
              },
              {
                name: "end",
                type: "Integer",
              },
            ],
            offset: 0,
            returntype: "Integer",
          },
          {
            name: "registerCandidate",
            parameters: [
              {
                name: "pubkey",
                type: "ByteArray",
              },
            ],
            offset: 0,
            returntype: "Boolean",
          },
          {
            name: "unregisterCandidate",
            parameters: [
              {
                name: "pubkey",
                type: "ByteArray",
              },
            ],
            offset: 0,
            returntype: "Boolean",
          },
          {
            name: "vote",
            parameters: [
              {
                name: "account",
                type: "ByteArray",
              },
              {
                name: "voteTo",
                type: "ByteArray",
              },
            ],
            offset: 0,
            returntype: "Boolean",
          },
          {
            name: "getCandidates",
            parameters: [],
            offset: 0,
            returntype: "Array",
          },
          {
            name: "getValidators",
            parameters: [],
            offset: 0,
            returntype: "Array",
          },
          {
            name: "getCommittee",
            parameters: [],
            offset: 0,
            returntype: "Array",
          },
          {
            name: "getNextBlockValidators",
            parameters: [],
            offset: 0,
            returntype: "Array",
          },
          {
            name: "balanceOf",
            parameters: [
              {
                name: "account",
                type: "ByteArray",
              },
            ],
            offset: 0,
            returntype: "Integer",
          },
          {
            name: "transfer",
            parameters: [
              {
                name: "from",
                type: "ByteArray",
              },
              {
                name: "to",
                type: "ByteArray",
              },
              {
                name: "amount",
                type: "Integer",
              },
            ],
            offset: 0,
            returntype: "Boolean",
          },
          {
            name: "name",
            parameters: [],
            offset: 0,
            returntype: "String",
          },
          {
            name: "symbol",
            parameters: [],
            offset: 0,
            returntype: "String",
          },
          {
            name: "decimals",
            parameters: [],
            offset: 0,
            returntype: "Integer",
          },
        ],
        events: [
          {
            name: "Transfer",
            parameters: [
              {
                name: "from",
                type: "Hash160",
              },
              {
                name: "to",
                type: "Hash160",
              },
              {
                name: "amount",
                type: "Integer",
              },
            ],
          },
        ],
      },
      permissions: [
        {
          contract: "*",
          methods: "*",
        } as ContractPermissionJson,
      ],
      trusts: [],
      safemethods: [
        "totalSupply",
        "unclaimedGas",
        "getCandidates",
        "getValidators",
        "getCommittee",
        "getNextBlockValidators",
        "balanceOf",
        "name",
        "symbol",
        "decimals",
      ],
      extra: null,
    };

    const manifest = ContractManifest.fromJson(neoManifestJson);
    expect(manifest.toJson()).toStrictEqual(neoManifestJson);
  });
});
