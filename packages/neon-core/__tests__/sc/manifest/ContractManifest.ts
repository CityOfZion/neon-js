import {
  ContractManifest,
  ContractManifestLike,
  ContractParamType
} from "../../../src/sc";

const defaultManifestLike: ContractManifestLike = {
  abi: {
    entryPoint: {
      name: "",
      parameters: [],
      returnType: ContractParamType.Any
    },
    events: [],
    hash: "",
    methods: []
  },
  features: {
    payable: false,
    storage: false
  },
  groups: [],
  permissions: [],
  safeMethods: "*",
  trusts: "*"
};

const definedManifestLike: ContractManifestLike = {
  abi: {
    entryPoint: {
      name: "transfer",
      parameters: [
        {
          name: "from",
          type: ContractParamType.Hash160
        },
        {
          name: "to",
          type: ContractParamType.Hash160
        },
        {
          name: "amount",
          type: ContractParamType.Integer
        }
      ],
      returnType: ContractParamType.Boolean
    },
    events: [
      {
        name: "transfer",
        parameters: [
          {
            name: "from",
            type: ContractParamType.Hash160
          },
          {
            name: "to",
            type: ContractParamType.Hash160
          },
          {
            name: "amount",
            type: ContractParamType.Integer
          }
        ]
      }
    ],
    hash: "43cf98eddbe047e198a3e5d57006311442a0ca15",
    methods: [
      {
        name: "transfer",
        parameters: [
          {
            name: "from",
            type: ContractParamType.Hash160
          },
          {
            name: "to",
            type: ContractParamType.Hash160
          },
          {
            name: "amount",
            type: ContractParamType.Integer
          }
        ],
        returnType: ContractParamType.Boolean
      }
    ]
  },
  features: {
    payable: false,
    storage: false
  },
  groups: [
    {
      pubKey: "this_is_a_public_key",
      signature: "this_is_a_signature"
    }
  ],
  permissions: [
    {
      contract: "a1760976db5fcdfab2a9930e8f6ce875b2d18225",
      methods: ["balanceOf"]
    }
  ],
  safeMethods: "*",
  trusts: "*"
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
            methods: ["balanceOf"]
          }
        ]
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
            methods: ["balanceOf"]
          }
        ]
      })
    );
    const manifest2 = new ContractManifest(
      Object.assign({}, definedManifestLike, {
        groups: [
          {
            pubKey:
              "03ff12614a7f6f370fb22260061be9da8b320ff33207aa10118b2bb2e717f5159d",
            signature: "this_is_a_signature"
          }
        ]
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

describe("parse", () => {
  test("can parse neo", () => {
    const neoManifestInString = `{"groups":[{"pubKey":"03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c","signature":"41414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141"}],"features":{"storage":true,"payable":true},"abi":{"hash":"0x1d8642796276c8ce3c5c03b8984a1b593d99b49a63d830bb06f800b8c953be77","entryPoint":{"name":"Main","parameters":[{"name":"operation","type":"String"},{"name":"args","type":"Array"}],"returnType":"Any"},"methods":[],"events":[]},"permissions":[{"contract":"0x0000000000000000000000000000000000000000","methods":["method1","method2"]}],"trusts":[],"safeMethods":[]}`;
    const neoManifestInJson = {
      groups: [
        {
          pubKey:
            "03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c",
          signature:
            "41414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141"
        }
      ],
      features: {
        storage: true,
        payable: true
      },
      abi: {
        hash:
          "0x1d8642796276c8ce3c5c03b8984a1b593d99b49a63d830bb06f800b8c953be77",
        entryPoint: {
          name: "Main",
          parameters: [
            {
              name: "operation",
              type: "String"
            },
            {
              name: "args",
              type: "Array"
            }
          ],
          returnType: "Any"
        },
        methods: [],
        events: []
      },
      permissions: [
        {
          contract: "0000000000000000000000000000000000000000",
          methods: ["method1", "method2"]
        }
      ],
      trusts: [],
      safeMethods: []
    };
    const manifest = ContractManifest.parse(neoManifestInString);
    expect(manifest.export()).toStrictEqual(neoManifestInJson);
  });
});
