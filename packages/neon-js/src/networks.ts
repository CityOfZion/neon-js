export default {
  MainNet: {
    Name: "MainNet",
    ProtocolConfiguration: {
      Magic: 7630401,
      AddressVersion: 23,
      StandbyValidators: [
        "03b209fd4f53a7170ea4444e0cb0a6bb6a53c2bd016926989cf85f9b0fba17a70c",
        "02df48f60e8f3e01c48ff40b9b7f1310d7a8b2a193188befe1c2e3df740e895093",
        "03b8d9d5771d8f513aa0869b9cc8d50986403b78c6da36890638c3d46a5adce04a",
        "02ca0e27697b9c248f6f16e085fd0061e26f44da85b58ee835c110caa5ec3ba554",
        "024c7b7fb6c310fccf1ba33b082519d82964ea93868d676662d4a59ad548df0e7d",
        "02aaec38470f6aad0042c6e877cfd8087d2676b0f516fddd362801b9bd3936399e",
        "02486fd15702c4490a26703112a5cc1d0923fd697a33406bd5a1c00e0013b09a70",
      ],
      SeedList: [
        "seed1.neo.org:10333",
        "seed2.neo.org:10333",
        "seed3.neo.org:10333",
        "seed4.neo.org:10333",
        "seed5.neo.org:10333",
      ],
      SystemFee: {
        EnrollmentTransaction: 1000,
        IssueTransaction: 500,
        PublishTransaction: 500,
        RegisterTransaction: 10000,
      },
    },
    ExtraConfiguration: {
      neonDB: "http://api.wallet.cityofzion.io",
      neoscan: "https://api.neoscan.io/api/main_net",
    },
  },
  TestNet: {
    Name: "TestNet",
    ProtocolConfiguration: {
      Magic: 1953787457,
      AddressVersion: 23,
      StandbyValidators: [
        "0327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee8",
        "026ce35b29147ad09e4afe4ec4a7319095f08198fa8babbe3c56e970b143528d22",
        "0209e7fd41dfb5c2f8dc72eb30358ac100ea8c72da18847befe06eade68cebfcb9",
        "039dafd8571a641058ccc832c5e2111ea39b09c0bde36050914384f7a48bce9bf9",
        "038dddc06ce687677a53d54f096d2591ba2302068cf123c1f2d75c2dddc5425579",
        "02d02b1873a0863cd042cc717da31cea0d7cf9db32b74d4c72c01b0011503e2e22",
        "034ff5ceeac41acf22cd5ed2da17a6df4dd8358fcb2bfb1a43208ad0feaab2746b",
      ],
      SeedList: [
        "seed1.neo.org:20333",
        "seed2.neo.org:20333",
        "seed3.neo.org:20333",
        "seed4.neo.org:20333",
        "seed5.neo.org:20333",
      ],
      SystemFee: {
        EnrollmentTransaction: 10,
        IssueTransaction: 5,
        PublishTransaction: 5,
        RegisterTransaction: 100,
      },
    },
    ExtraConfiguration: {
      neonDB: "http://testnet-api.wallet.cityofzion.io",
      neoscan: "https://neoscan-testnet.io/api/test_net",
    },
  },
  CozNet: {
    Name: "CozNet",
    ProtocolConfiguration: {
      Magic: 1010102,
      AddressVersion: 23,
      StandbyValidators: [
        "032d9e51c7d48b0f5cc63d63deb89767685832cf69eb7113900290f217ae0504ee",
        "022a5b7ccf03166a95e1750f0c350c734c34fe7aac66622eecdb5a529d2e69b1df",
        "03c478d43271c297696ee3ab5a7946ee60287015c7dca6cba867819c7f271bc4ea",
        "0393ef777d01fb60eef1da3474b975c6a393b464bcfe588e2ad7dbc4dbdfa2c244",
      ],
      SeedList: [
        "188.68.34.29:10330",
        "188.68.34.29:10332",
        "188.68.34.29:10334",
        "188.68.34.29:10336",
      ],
      SystemFee: {
        EnrollmentTransaction: 1000,
        IssueTransaction: 500,
        PublishTransaction: 500,
        RegisterTransaction: 10000,
      },
    },
    ExtraConfiguration: {
      neoscan: "https://coz.neoscan-testnet.io/api/main_net",
    },
  },
};
