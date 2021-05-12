export default {
  MainNet: {
    Name: "MainNet",
    ProtocolConfiguration: {
      Magic: 5195086,
      MillisecondsPerBlock: 15000,
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
    },
  },
  TestNet: {
    Name: "TestNet",
    ProtocolConfiguration: {
      Magic: 827601742,
      MillisecondsPerBlock: 15000,
      AddressVersion: 23,
      StandbyValidators: [
        "023e9b32ea89b94d066e649b124fd50e396ee91369e8e2a6ae1b11c170d022256d",
        "03009b7540e10f2562e5fd8fac9eaec25166a58b26e412348ff5a86927bfac22a2",
        "02ba2c70f5996f357a43198705859fae2cfea13e1172962800772b3d588a9d4abd",
        "03408dcd416396f64783ac587ea1e1593c57d9fea880c8a6a1920e92a259477806",
        "02a7834be9b32e2981d157cb5bbd3acb42cfd11ea5c3b10224d7a44e98c5910f1b",
        "0214baf0ceea3a66f17e7e1e839ea25fd8bed6cd82e6bb6e68250189065f44ff01",
        "030205e9cefaea5a1dfc580af20c8d5aa2468bb0148f1a5e4605fc622c80e604ba",
      ],
      SeedList: [
        "seed1t.neo.org:20333",
        "seed2t.neo.org:20333",
        "seed3t.neo.org:20333",
        "seed4t.neo.org:20333",
        "seed5t.neo.org:20333",
      ],
    },
    ExtraConfiguration: {
      neonDB: "http://testnet-api.wallet.cityofzion.io",
      neoscan: "https://neoscan-testnet.io/api/test_net",
    },
  },
};
